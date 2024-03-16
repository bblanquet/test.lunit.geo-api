import {
  ArrayMaxSize,
  ArrayMinSize,
  Equals,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class CreatePointDto {
  @Equals('point')
  type: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates: Array<number>;
}
