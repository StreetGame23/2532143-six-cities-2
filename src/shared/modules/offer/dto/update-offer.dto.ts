import { Location, OfferType } from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public publicationDate?: Date;
  public city?: string;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public type?: OfferType;
  public bedrooms?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: string[];
  public location?: Location;
}
