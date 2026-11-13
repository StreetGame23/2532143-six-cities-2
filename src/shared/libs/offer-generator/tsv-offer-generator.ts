import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { CITY_LOCATIONS } from '../../modules/offer/offer.constant.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const DEFAULT_HOST = {
  name: 'Oliver Conner',
  email: 'oliver.conner@six-cities.local',
  avatarUrl: 'https://url-to-image/avatar.png',
  isPro: false,
};

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const publicationDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const cityName = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItems(this.mockData.images).join(',');
    const isPremium = String(getRandomItem(this.mockData.isPremium));
    const isFavorite = String(getRandomItem(this.mockData.isFavorite));
    const rating = String(getRandomItem(this.mockData.ratings));
    const type = getRandomItem(this.mockData.types).replace('appartment', 'apartment');
    const bedrooms = String(getRandomItem(this.mockData.bedrooms));
    const maxAdults = String(getRandomItem(this.mockData.maxAdults));
    const price = String(getRandomItem(this.mockData.prices));
    const goods = getRandomItems(this.mockData.goods).join(',');
    const host = JSON.stringify(DEFAULT_HOST);
    const location = JSON.stringify(CITY_LOCATIONS[cityName as keyof typeof CITY_LOCATIONS] ?? CITY_LOCATIONS.Paris);

    return [
      title,
      description,
      publicationDate,
      cityName,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      host,
      location,
    ].join('\t');
  }
}
