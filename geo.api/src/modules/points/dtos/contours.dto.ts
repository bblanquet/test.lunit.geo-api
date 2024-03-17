import { IsString } from 'class-validator';

export class ContourDto {
  @IsString()
  contour: string;
}
