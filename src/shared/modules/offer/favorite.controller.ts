import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from '../user/user-service.interface.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
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
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async index(
    { tokenPayload }: Request,
    res: Response,
  ): Promise<void> {
    const offers = await this.userService.findFavorites(tokenPayload.id);
    const offersRdo = fillDTO(OfferRdo, offers);
    const items = Array.isArray(offersRdo) ? offersRdo : [offersRdo];

    for (const offer of items) {
      offer.isFavorite = true;
    }

    this.ok(res, offersRdo);
  }

  public async create(
    { tokenPayload, params }: Request,
    res: Response,
  ): Promise<void> {
    await this.userService.addFavorite(tokenPayload.id, params.offerId);
    const offer = await this.offerService.findById(params.offerId);
    const offerRdo = fillDTO(OfferRdo, offer);
    offerRdo.isFavorite = true;
    this.created(res, offerRdo);
  }

  public async delete(
    { tokenPayload, params }: Request,
    res: Response,
  ): Promise<void> {
    await this.userService.removeFavorite(tokenPayload.id, params.offerId);
    this.noContent(res, {});
  }
}
