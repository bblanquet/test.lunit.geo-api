import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PointSchema, Point } from './schema/point.schema';
import { CoordinateValidator } from './common/CoordinateValidator';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Point.name, schema: PointSchema }],
      'geo',
    ),
  ],
  controllers: [PointsController],
  providers: [PointsService, CoordinateValidator],
})
export class PointsModule {}
