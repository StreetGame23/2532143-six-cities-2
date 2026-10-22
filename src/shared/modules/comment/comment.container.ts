import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentController } from './comment.controller.js';
import { Controller } from '../../libs/rest/index.js';

export function createCommentContainer(container: Container): Container {
  container.bind<CommentService>(Component.CommentService)
    .to(DefaultCommentService)
    .inSingletonScope();

  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);

  container.bind<Controller>(Component.CommentController)
    .to(CommentController)
    .inSingletonScope();

  return container;
}
