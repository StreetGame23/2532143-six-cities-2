import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PathTransformer,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { OfferService } from './offer-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { CommentRdo } from '../comment/rdo/comment.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UserService } from '../user/user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { UploadImageRdo } from './rdo/upload-image.rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.PathTransformer) pathTransformer: PathTransformer,
  ) {
    super(logger, pathTransformer);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  private async getFavoriteIds(userId?: string): Promise<Set<string>> {
    if (!userId) {
      return new Set();
    }

    const user = await this.userService.findById(userId);
    const favorites = user?.favorites ?? [];

    return new Set(favorites.map((favoriteId) => String(favoriteId)));
  }

  private markFavorites(
    offers: { id: string; isFavorite: boolean }[] | { id: string; isFavorite: boolean },
    favoriteIds: Set<string>,
  ): void {
    const items = Array.isArray(offers) ? offers : [offers];

    items.forEach((offer) => {
      offer.isFavorite = favoriteIds.has(offer.id);
    });
  }

  private getOfferHostId(offer: { hostId?: unknown }): string {
    const host = offer.hostId;

    if (host && typeof host === 'object' && 'id' in host) {
      return String(host.id);
    }

    return String(host);
  }

  private assertOfferOwner(offer: { hostId?: unknown } | null, userId: string): void {
    if (!offer || this.getOfferHostId(offer) !== userId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Access denied',
        'OfferController',
      );
    }
  }

  public async index(
    { query, tokenPayload }: Request,
    res: Response,
  ): Promise<void> {
    const count = query.count ? Number.parseInt(String(query.count), 10) : undefined;
    const offers = await this.offerService.find(count);
    const favoriteIds = await this.getFavoriteIds(tokenPayload?.id);
    const offersRdo = fillDTO(OfferPreviewRdo, offers);
    this.markFavorites(offersRdo, favoriteIds);
    this.ok(res, offersRdo);
  }

  public async create(
    { body, tokenPayload }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({ ...body, hostId: tokenPayload.id });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async show(
    { params, tokenPayload }: Request,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    const favoriteIds = await this.getFavoriteIds(tokenPayload?.id);
    const offerRdo = fillDTO(OfferRdo, offer);
    this.markFavorites(offerRdo, favoriteIds);
    this.ok(res, offerRdo);
  }

  public async update(
    { body, params, tokenPayload }: Request,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    this.assertOfferOwner(offer, tokenPayload.id);
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    const favoriteIds = await this.getFavoriteIds(tokenPayload.id);
    const offerRdo = fillDTO(OfferRdo, updatedOffer);
    this.markFavorites(offerRdo, favoriteIds);
    this.ok(res, offerRdo);
  }

  public async delete(
    { params, tokenPayload }: Request,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    this.assertOfferOwner(offer, tokenPayload.id);
    const deletedOffer = await this.offerService.deleteById(params.offerId);
    this.noContent(res, deletedOffer);
  }

  public async getPremium(
    { params, tokenPayload }: Request,
    res: Response,
  ): Promise<void> {
    const offers = await this.offerService.findPremiumByCityName(params.city);
    const favoriteIds = await this.getFavoriteIds(tokenPayload?.id);
    const offersRdo = fillDTO(OfferPreviewRdo, offers);
    this.markFavorites(offersRdo, favoriteIds);
    this.ok(res, offersRdo);
  }

  public async getComments(
    { params }: Request,
    res: Response,
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async uploadImage({ params, file, tokenPayload }: Request, res: Response) {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    this.assertOfferOwner(offer, tokenPayload.id);
    const updateDto = { previewImage: file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageRdo, updateDto));
  }
}
