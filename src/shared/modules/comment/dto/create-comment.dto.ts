import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { CreateCommentMessages } from './create-comment.messages.js';
import {
  MAX_COMMENT_LENGTH,
  MAX_COMMENT_RATING,
  MIN_COMMENT_LENGTH,
  MIN_COMMENT_RATING,
} from '../comment.constant.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.invalidFormat })
  @Length(MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH, { message: CreateCommentMessages.text.lengthField })
  public text!: string;

  @IsInt({ message: CreateCommentMessages.rating.invalidFormat })
  @Min(MIN_COMMENT_RATING, { message: CreateCommentMessages.rating.invalidFormat })
  @Max(MAX_COMMENT_RATING, { message: CreateCommentMessages.rating.invalidFormat })
  public rating!: number;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalidFormat })
  public offerId!: string;

  public userId!: string;
}
