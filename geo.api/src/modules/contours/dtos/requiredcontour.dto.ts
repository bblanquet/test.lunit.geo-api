import { IsNotEmpty, IsString } from 'class-validator';

export class RequiredContourDto {
  @IsString()
  @IsNotEmpty()
  contour: string;
}
