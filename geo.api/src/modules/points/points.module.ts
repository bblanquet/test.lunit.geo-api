import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PointSchema, Point } from './schemas/point.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Point.name, schema: PointSchema }],
      'geo',
    ),
  ],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
