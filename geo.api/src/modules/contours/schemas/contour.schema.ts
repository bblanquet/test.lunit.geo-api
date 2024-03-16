import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Coordinate } from 'src/common/model/coordinate';

export type PointDocument = HydratedDocument<Contour>;

@Schema()
export class Contour {
  @Prop({ required: true })
  coordinates: Array<Coordinate>;
}

export const ContourSchema = SchemaFactory.createForClass(Contour);
