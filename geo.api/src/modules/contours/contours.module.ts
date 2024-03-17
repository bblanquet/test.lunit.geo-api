import { Module } from '@nestjs/common';
import { ContoursService } from './contours.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Contour, ContourSchema } from './schemas/contour.schema';
import { ContoursController } from './contours.controller';
import DbPool from 'src/common/databases/dbPool';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Contour.name, schema: ContourSchema }],
      'geo',
    ),
  ],
  controllers: [ContoursController],
  providers: [ContoursService, DbPool],
})
export class contoursModule {}
