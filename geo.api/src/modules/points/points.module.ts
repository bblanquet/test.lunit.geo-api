import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import DbPool from 'src/common/databases/dbPool';

@Module({
  controllers: [PointsController],
  providers: [PointsService, DbPool],
})
export class PointsModule {}
