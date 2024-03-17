import { Module } from '@nestjs/common';
import { ContoursService } from './contours.service';
import { ContoursController } from './contours.controller';
import DbPool from 'src/common/databases/dbPool';

@Module({
  controllers: [ContoursController],
  providers: [ContoursService, DbPool],
})
export class contoursModule {}
