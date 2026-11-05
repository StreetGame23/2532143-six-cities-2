import { Expose, Transform } from 'class-transformer';

export class UserRdo {
  @Expose()
  @Transform(({ obj }) => obj.id ?? obj._id?.toString())
  public id: string;

  @Expose()
  public email: string;

  @Expose()
  public name: string;

  @Expose()
  public avatarUrl: string;

  @Expose()
  public isPro: boolean;
}
