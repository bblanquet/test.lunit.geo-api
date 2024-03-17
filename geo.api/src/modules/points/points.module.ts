import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import DbPool from 'src/common/databases/dbPool';
import { PointsDAO } from './points.dao';

@Module({
  controllers: [PointsController],
  providers: [PointsService, DbPool, PointsDAO],
})
export class PointsModule {}
