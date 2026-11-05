import { Expose, Type } from 'class-transformer';
import { LocationRdo } from './location.rdo.js';

export class CityRdo {
  @Expose()
  public name: string;

  @Expose()
  @Type(() => LocationRdo)
  public location: LocationRdo;
}
