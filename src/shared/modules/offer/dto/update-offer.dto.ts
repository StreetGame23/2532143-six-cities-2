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
import {
  CITIES,
  GOODS,
  MAX_OFFER_ADULTS,
  MAX_OFFER_BEDROOMS,
  MAX_OFFER_DESCRIPTION_LENGTH,
  MAX_OFFER_PRICE,
  MAX_OFFER_TITLE_LENGTH,
  MIN_OFFER_ADULTS,
  MIN_OFFER_BEDROOMS,
  MIN_OFFER_DESCRIPTION_LENGTH,
  MIN_OFFER_PRICE,
  MIN_OFFER_TITLE_LENGTH,
  OFFER_IMAGES_COUNT,
  OFFER_TYPES,
} from '../offer.constant.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(MIN_OFFER_TITLE_LENGTH, { message: CreateUpdateOfferMessage.title.minLength })
  @MaxLength(MAX_OFFER_TITLE_LENGTH, { message: CreateUpdateOfferMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(MIN_OFFER_DESCRIPTION_LENGTH, { message: CreateUpdateOfferMessage.description.minLength })
  @MaxLength(MAX_OFFER_DESCRIPTION_LENGTH, { message: CreateUpdateOfferMessage.description.maxLength })
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
  @ArrayMinSize(OFFER_IMAGES_COUNT, { message: CreateUpdateOfferMessage.images.length })
  @ArrayMaxSize(OFFER_IMAGES_COUNT, { message: CreateUpdateOfferMessage.images.length })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateUpdateOfferMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsIn(OFFER_TYPES, { message: CreateUpdateOfferMessage.type.invalidFormat })
  public type?: OfferType;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.bedrooms.invalidFormat })
  @Min(MIN_OFFER_BEDROOMS, { message: CreateUpdateOfferMessage.bedrooms.min })
  @Max(MAX_OFFER_BEDROOMS, { message: CreateUpdateOfferMessage.bedrooms.max })
  public bedrooms?: number;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.maxAdults.invalidFormat })
  @Min(MIN_OFFER_ADULTS, { message: CreateUpdateOfferMessage.maxAdults.min })
  @Max(MAX_OFFER_ADULTS, { message: CreateUpdateOfferMessage.maxAdults.max })
  public maxAdults?: number;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.price.invalidFormat })
  @Min(MIN_OFFER_PRICE, { message: CreateUpdateOfferMessage.price.min })
  @Max(MAX_OFFER_PRICE, { message: CreateUpdateOfferMessage.price.max })
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
