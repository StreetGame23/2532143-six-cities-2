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
import { CITIES, GOODS, OFFER_TYPES } from '../offer.constant.js';

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title!: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description!: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.publicationDate.invalidFormat })
  public publicationDate!: Date;

  @IsIn(CITIES, { message: CreateOfferValidationMessage.city.invalid })
  public city!: string;

  @IsString({ message: CreateOfferValidationMessage.previewImage.invalidFormat })
  public previewImage!: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @IsString({ each: true })
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.length })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.images.length })
  public images!: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium!: boolean;

  @IsIn(OFFER_TYPES, { message: CreateOfferValidationMessage.type.invalid })
  public type!: OfferType;

  @IsInt({ message: CreateOfferValidationMessage.bedrooms.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.bedrooms.minValue })
  @Max(8, { message: CreateOfferValidationMessage.bedrooms.maxValue })
  public bedrooms!: number;

  @IsInt({ message: CreateOfferValidationMessage.maxAdults.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.maxAdults.minValue })
  @Max(10, { message: CreateOfferValidationMessage.maxAdults.maxValue })
  public maxAdults!: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price!: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  @IsIn(GOODS, { each: true, message: CreateOfferValidationMessage.goods.invalidFormat })
  @ArrayMinSize(1)
  public goods!: string[];

  public hostId!: string;

  @ValidateNested()
  @Type(() => LocationDto)
  public location!: LocationDto;
}
