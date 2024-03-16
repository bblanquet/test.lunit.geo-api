import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { MongoIdTransform } from '../pipes/mongoIdTransform';

export class ObjectIdDto {
  @ApiProperty({
    description: 'Id',
    required: true,
    type: String,
    default: '61d9cfbf17ed7311c4b3e485',
  })
  @IsMongoId()
  @IsString()
  @Transform((value) => MongoIdTransform(value))
  id: string;
}
