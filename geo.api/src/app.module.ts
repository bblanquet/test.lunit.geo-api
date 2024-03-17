import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PointsModule } from './modules/points/points.module';
import { LoggerMiddleware } from './middlewares/logger';
import { contoursModule } from './modules/contours/contours.module';
import configuration from './common/configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
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
