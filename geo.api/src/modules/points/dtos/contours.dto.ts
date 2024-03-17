import { IsOptional, IsString } from 'class-validator';

export class ContourDto {
  @IsString()
  @IsOptional()
  contour: string;
}
