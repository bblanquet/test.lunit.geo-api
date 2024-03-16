import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PointDocument = HydratedDocument<Point>;

@Schema()
export class Point {
  @Prop({ required: true })
  x: number;
  @Prop({ required: true })
  y: number;
}

export const PointSchema = SchemaFactory.createForClass(Point);
