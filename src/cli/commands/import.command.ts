import { createOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { Command } from './command.interface.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';
import {
  DEFAULT_USER_PASSWORD,
  DefaultUserService,
  UserModel,
  UserService,
} from '../../shared/modules/user/index.js';
import {
  DefaultOfferService,
  OfferModel,
  OfferService,
} from '../../shared/modules/offer/index.js';
import { Offer } from '../../shared/types/index.js';

const DEFAULT_DB_PORT = '27017';

export class ImportCommand implements Command {
  private readonly logger: Logger;
  private readonly offerService: OfferService;
  private readonly userService: UserService;
  private readonly databaseClient: DatabaseClient;
  private salt!: string;

  constructor() {
    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    const hostEmail = offer.host.email
      ?? `${offer.host.name.toLowerCase().replace(/\s+/g, '.')}@six-cities.local`;

    const user = await this.userService.findOrCreate({
      email: hostEmail,
      name: offer.host.name,
      avatarUrl: offer.host.avatarUrl,
      isPro: offer.host.isPro,
      password: DEFAULT_USER_PASSWORD,
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      publicationDate: new Date(offer.publicationDate),
      city: offer.city.name,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      bedrooms: offer.bedrooms,
      maxAdults: offer.maxAdults,
      price: offer.price,
      goods: offer.goods,
      hostId: user.id,
      location: offer.location,
    });
  }

  private onCompleteImport(count: number) {
    this.logger.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  public async execute(
    filename: string,
    login: string = '',
    password: string = '',
    host: string = '127.0.0.1',
    dbname: string = 'six-cities',
    salt: string = 'secretSalt'
  ): Promise<void> {
    const normalizedLogin = login === '-' ? '' : login;
    const normalizedPassword = password === '-' ? '' : password;
    const uri = getMongoURI(normalizedLogin, normalizedPassword, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine.bind(this));
    fileReader.on('end', this.onCompleteImport.bind(this));

    try {
      await fileReader.read();
    } catch (error) {
      this.logger.error(`Can't import data from file: ${filename}`);
      this.logger.error(getErrorMessage(error));
    }
  }
}
