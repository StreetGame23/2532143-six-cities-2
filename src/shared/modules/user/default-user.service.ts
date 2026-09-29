import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { OfferEntity } from '../offer/offer.entity.js';
import { OfferService } from '../offer/offer-service.interface.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({
      email: dto.email,
      name: dto.name,
      avatarUrl: dto.avatarUrl || DEFAULT_AVATAR_FILE_NAME,
      isPro: dto.isPro,
    });
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId).exec();
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .exec();
  }

  public async addFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { $addToSet: { favorites: offerId } }, { new: true })
      .exec();
  }

  public async removeFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { $pull: { favorites: offerId } }, { new: true })
      .exec();
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.findById(userId);

    if (!user) {
      return [];
    }

    return this.offerService.findFavoriteByIds(user.favorites);
  }
}
