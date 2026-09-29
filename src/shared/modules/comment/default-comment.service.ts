import { inject, injectable } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { OfferService } from '../offer/index.js';
import { DEFAULT_COMMENT_COUNT } from './comment.constant.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    await this.offerService.incCommentCount(dto.offerId);
    await this.recalculateOfferRating(dto.offerId);

    return comment.populate(['userId']);
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_COMMENT_COUNT)
      .populate(['userId'])
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }

  private async recalculateOfferRating(offerId: string): Promise<void> {
    const aggregation = await this.commentModel
      .aggregate<{ averageRating: number }>([
        { $match: { offerId: new Types.ObjectId(offerId) } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
      ])
      .exec();

    const averageRating = aggregation[0]?.averageRating ?? 0;
    const rating = Math.round(averageRating * 10) / 10;

    await this.offerService.updateRating(offerId, rating);
  }
}
