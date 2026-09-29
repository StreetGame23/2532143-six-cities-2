import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { DefaultCommentService } from './default-comment.service.js';

export function createCommentContainer(container: Container): Container {
  container.bind<CommentService>(Component.CommentService)
    .to(DefaultCommentService)
    .inSingletonScope();

  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);

  return container;
}
