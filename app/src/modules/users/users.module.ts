import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../database/database.service';
import { IsInUseMiddleware } from './middlewares/is-in-use.middleware';
import { NotFoundMiddleware } from './middlewares/not-found.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsInUseMiddleware)
      .forRoutes(
        { method: RequestMethod.POST, path: 'users' },
        { method: RequestMethod.PATCH, path: 'users/:id' },
      )
      .apply(NotFoundMiddleware)
      .forRoutes('users/:id');
  }
}
