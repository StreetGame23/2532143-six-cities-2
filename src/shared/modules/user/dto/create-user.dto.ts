import { IsBoolean, IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { CreateUserMessages } from './create-user.messages.js';
import {
  MAX_USER_NAME_LENGTH,
  MAX_USER_PASSWORD_LENGTH,
  MIN_USER_NAME_LENGTH,
  MIN_USER_PASSWORD_LENGTH,
} from '../user.constant.js';

export class CreateUserDto {
  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email!: string;

  @IsOptional()
  @IsString({ message: CreateUserMessages.avatarUrl.invalidFormat })
  public avatarUrl!: string;

  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH, { message: CreateUserMessages.name.lengthField })
  public name!: string;

  @IsBoolean({ message: CreateUserMessages.isPro.invalidFormat })
  public isPro!: boolean;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(MIN_USER_PASSWORD_LENGTH, MAX_USER_PASSWORD_LENGTH, { message: CreateUserMessages.password.lengthField })
  public password!: string;
}
