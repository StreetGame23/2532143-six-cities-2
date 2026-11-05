import { Expose } from 'class-transformer';
import { Location } from '../../../types/index.js';

export class CityRdo {
  @Expose()
  public name: string;

  @Expose()
  public location: Location;
}
