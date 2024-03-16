import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PointsModule } from './modules/points/points.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './middlewares/logger';
import { contoursModule } from './modules/contours/contours.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin_password@localhost/geo', {
      connectionName: 'geo',
    }),
    PointsModule,
    contoursModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
