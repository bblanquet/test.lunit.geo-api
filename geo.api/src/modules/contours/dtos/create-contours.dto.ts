import { ArrayMinSize, Equals, IsArray, IsNotEmpty } from 'class-validator';
import { GeoType } from 'src/common/model/geoType';
import { coordinatesTransform } from '../pipes/coordinatesTransform';
import { Transform } from 'class-transformer';

export class CreateContourDto {
  @Equals(GeoType[GeoType.Polygon])
  type: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(4)
  @Transform((value) => coordinatesTransform(value))
  coordinates: Array<Array<number>>;
}
