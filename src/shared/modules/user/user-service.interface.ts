import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserEntity } from './user.entity.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { OfferEntity } from '../offer/offer.entity.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  addFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  removeFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
}
