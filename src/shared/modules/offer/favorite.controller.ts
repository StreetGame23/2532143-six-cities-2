import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from '../user/user-service.interface.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { ChangeFavoriteDto } from '../user/dto/change-favorite.dto.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(ChangeFavoriteDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(ChangeFavoriteDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async index(
    { query }: Request,
    res: Response,
  ): Promise<void> {
    const userId = String(query.userId ?? '');

    if (!Types.ObjectId.isValid(userId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${userId} is invalid ObjectID`,
        'FavoriteController',
      );
    }

    if (!await this.userService.exists(userId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found.`,
        'FavoriteController',
      );
    }

    const offers = await this.userService.findFavorites(userId);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    { body, params }: Request,
    res: Response,
  ): Promise<void> {
    const { userId } = body as ChangeFavoriteDto;

    if (!await this.userService.exists(userId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found.`,
        'FavoriteController',
      );
    }

    await this.userService.addFavorite(userId, params.offerId);
    const offer = await this.offerService.findById(params.offerId);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { body, params }: Request,
    res: Response,
  ): Promise<void> {
    const { userId } = body as ChangeFavoriteDto;

    if (!await this.userService.exists(userId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found.`,
        'FavoriteController',
      );
    }

    await this.userService.removeFavorite(userId, params.offerId);
    this.noContent(res, {});
  }
}
