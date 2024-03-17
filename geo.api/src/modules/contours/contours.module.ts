import { Module } from '@nestjs/common';
import { ContoursService } from './contours.service';
import { ContoursController } from './contours.controller';
import DbPool from 'src/common/databases/dbPool';
import { ContoursDao } from './contours.dao';

@Module({
  controllers: [ContoursController],
  providers: [ContoursService, DbPool, ContoursDao],
})
export class contoursModule {}
