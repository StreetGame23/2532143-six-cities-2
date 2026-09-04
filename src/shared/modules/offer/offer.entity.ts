import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Location, OfferType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

class LocationType {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;

  @prop({ required: true })
  public zoom!: number;
}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title!: string;

  @prop({ trim: true, required: true })
  public description!: string;

  @prop({ required: true })
  public publicationDate!: Date;

  @prop({ required: true })
  public city!: string;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ type: () => [String], required: true, default: [] })
  public images!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({ required: true, default: 1 })
  public rating!: number;

  @prop({ type: () => String, enum: ['apartment', 'house', 'room', 'hotel'], required: true })
  public type!: OfferType;

  @prop({ required: true })
  public bedrooms!: number;

  @prop({ required: true })
  public maxAdults!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ type: () => [String], required: true, default: [] })
  public goods!: string[];

  @prop({ ref: UserEntity, required: true })
  public hostId!: Ref<UserEntity>;

  @prop({ type: () => LocationType, required: true, _id: false })
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
