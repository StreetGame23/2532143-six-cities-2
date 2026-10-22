import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OfferType } from '../../../types/index.js';
import { CreateUpdateOfferMessage } from './update-offer.messages.js';
import { LocationDto } from './location.dto.js';
import { CITIES, GOODS, OFFER_TYPES } from '../offer.constant.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: CreateUpdateOfferMessage.title.minLength })
  @MaxLength(100, { message: CreateUpdateOfferMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: CreateUpdateOfferMessage.description.minLength })
  @MaxLength(1024, { message: CreateUpdateOfferMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: CreateUpdateOfferMessage.publicationDate.invalidFormat })
  public publicationDate?: Date;

  @IsOptional()
  @IsIn(CITIES, { message: CreateUpdateOfferMessage.city.invalid })
  public city?: string;

  @IsOptional()
  @IsString({ message: CreateUpdateOfferMessage.previewImage.invalidFormat })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: CreateUpdateOfferMessage.images.invalidFormat })
  @IsString({ each: true })
  @ArrayMinSize(6, { message: CreateUpdateOfferMessage.images.length })
  @ArrayMaxSize(6, { message: CreateUpdateOfferMessage.images.length })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateUpdateOfferMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsIn(OFFER_TYPES, { message: CreateUpdateOfferMessage.type.invalidFormat })
  public type?: OfferType;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.bedrooms.invalidFormat })
  @Min(1, { message: CreateUpdateOfferMessage.bedrooms.min })
  @Max(8, { message: CreateUpdateOfferMessage.bedrooms.max })
  public bedrooms?: number;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.maxAdults.invalidFormat })
  @Min(1, { message: CreateUpdateOfferMessage.maxAdults.min })
  @Max(10, { message: CreateUpdateOfferMessage.maxAdults.max })
  public maxAdults?: number;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.price.invalidFormat })
  @Min(100, { message: CreateUpdateOfferMessage.price.min })
  @Max(100000, { message: CreateUpdateOfferMessage.price.max })
  public price?: number;

  @IsOptional()
  @IsArray({ message: CreateUpdateOfferMessage.goods.invalidFormat })
  @IsIn(GOODS, { each: true, message: CreateUpdateOfferMessage.goods.invalidFormat })
  public goods?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  public location?: LocationDto;
}
