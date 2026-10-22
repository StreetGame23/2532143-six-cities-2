import { IsMongoId } from 'class-validator';

export class ChangeFavoriteDto {
  @IsMongoId({ message: 'userId must be a valid id' })
  public userId!: string;
}
