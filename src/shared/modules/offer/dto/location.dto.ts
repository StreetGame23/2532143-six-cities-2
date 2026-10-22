import { IsInt, IsNumber } from 'class-validator';

export class LocationDto {
  @IsNumber()
  public latitude!: number;

  @IsNumber()
  public longitude!: number;

  @IsInt()
  public zoom!: number;
}
