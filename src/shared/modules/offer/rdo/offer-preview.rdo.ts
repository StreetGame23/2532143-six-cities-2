import { Expose, Transform } from 'class-transformer';
import { OfferType } from '../../../types/index.js';
import { getCityByName } from '../offer.constant.js';
import { CityRdo } from './city.rdo.js';

export class OfferPreviewRdo {
  @Expose()
  @Transform(({ obj }) => obj.id ?? obj._id?.toString())
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public type: OfferType;

  @Expose()
  public price: number;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public publicationDate: Date;

  @Expose()
  @Transform(({ value }) => typeof value === 'string' ? getCityByName(value) : value)
  public city: CityRdo;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public commentCount: number;
}
