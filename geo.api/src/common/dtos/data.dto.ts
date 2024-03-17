import { ValidateNested } from 'class-validator';

export class DataDto<T> {
  @ValidateNested()
  data: T;
}
