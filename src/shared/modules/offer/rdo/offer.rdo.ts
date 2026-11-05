import { Expose, Transform, Type } from 'class-transformer';
import { Location, OfferType } from '../../../types/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { getCityByName } from '../offer.constant.js';
import { CityRdo } from './city.rdo.js';

export class OfferRdo {
  @Expose()
  @Transform(({ obj }) => obj.id ?? obj._id?.toString())
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public publicationDate: Date;

  @Expose()
  @Transform(({ value }) => typeof value === 'string' ? getCityByName(value) : value)
  public city: CityRdo;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: OfferType;

  @Expose()
  public bedrooms: number;

  @Expose()
  public maxAdults: number;

  @Expose()
  public price: number;

  @Expose()
  public goods: string[];

  @Expose({ name: 'hostId' })
  @Type(() => UserRdo)
  public host: UserRdo;

  @Expose()
  public commentCount: number;

  @Expose()
  public location: Location;
}
