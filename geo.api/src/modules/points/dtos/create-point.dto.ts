import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, Equals, IsArray } from 'class-validator';
import { GeoType } from 'src/common/model/geoType';
import { coordinateTransform } from '../pipes/coordinateTransform';

export class CreatePointDto {
  @Equals(GeoType[GeoType.Point])
  type: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Transform((value) => coordinateTransform(value))
  coordinates: Array<number>;
}
