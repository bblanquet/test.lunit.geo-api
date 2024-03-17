import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PointsModule } from './modules/points/points.module';
import { RequestLoggerMiddleware } from './middlewares/requestLogger';
import { contoursModule } from './modules/contours/contours.module';
import configuration from './common/configuration';
import { ConfigModule } from '@nestjs/config';
import { ResponseLoggerMiddleware } from './middlewares/responseLogger';

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
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(ResponseLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
