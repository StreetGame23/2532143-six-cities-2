import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OfferType } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
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
  MIN_OFFER_GOODS_COUNT,
  MIN_OFFER_PRICE,
  MIN_OFFER_TITLE_LENGTH,
  OFFER_IMAGES_COUNT,
  OFFER_TYPES,
} from '../offer.constant.js';

export class CreateOfferDto {
  @MinLength(MIN_OFFER_TITLE_LENGTH, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(MAX_OFFER_TITLE_LENGTH, { message: CreateOfferValidationMessage.title.maxLength })
  public title!: string;

  @MinLength(MIN_OFFER_DESCRIPTION_LENGTH, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(MAX_OFFER_DESCRIPTION_LENGTH, { message: CreateOfferValidationMessage.description.maxLength })
  public description!: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.publicationDate.invalidFormat })
  public publicationDate!: Date;

  @IsIn(CITIES, { message: CreateOfferValidationMessage.city.invalid })
  public city!: string;

  @IsString({ message: CreateOfferValidationMessage.previewImage.invalidFormat })
  public previewImage!: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @IsString({ each: true })
  @ArrayMinSize(OFFER_IMAGES_COUNT, { message: CreateOfferValidationMessage.images.length })
  @ArrayMaxSize(OFFER_IMAGES_COUNT, { message: CreateOfferValidationMessage.images.length })
  public images!: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium!: boolean;

  @IsIn(OFFER_TYPES, { message: CreateOfferValidationMessage.type.invalid })
  public type!: OfferType;

  @IsInt({ message: CreateOfferValidationMessage.bedrooms.invalidFormat })
  @Min(MIN_OFFER_BEDROOMS, { message: CreateOfferValidationMessage.bedrooms.minValue })
  @Max(MAX_OFFER_BEDROOMS, { message: CreateOfferValidationMessage.bedrooms.maxValue })
  public bedrooms!: number;

  @IsInt({ message: CreateOfferValidationMessage.maxAdults.invalidFormat })
  @Min(MIN_OFFER_ADULTS, { message: CreateOfferValidationMessage.maxAdults.minValue })
  @Max(MAX_OFFER_ADULTS, { message: CreateOfferValidationMessage.maxAdults.maxValue })
  public maxAdults!: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(MIN_OFFER_PRICE, { message: CreateOfferValidationMessage.price.minValue })
  @Max(MAX_OFFER_PRICE, { message: CreateOfferValidationMessage.price.maxValue })
  public price!: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  @IsIn(GOODS, { each: true, message: CreateOfferValidationMessage.goods.invalidFormat })
  @ArrayMinSize(MIN_OFFER_GOODS_COUNT)
  public goods!: string[];

  public hostId!: string;

  @ValidateNested()
  @Type(() => LocationDto)
  public location!: LocationDto;
}
