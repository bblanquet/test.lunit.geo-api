import { IsOptional, IsString } from 'class-validator';

export class OptionalContourDto {
  @IsString()
  @IsOptional()
  contour: string;
}
