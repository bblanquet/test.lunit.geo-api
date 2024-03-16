import { Module } from '@nestjs/common';
import { PointsModule } from './points/points.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin_password@localhost/geo', {
      connectionName: 'geo',
    }),
    PointsModule,
  ],
})
export class AppModule {}
