import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CreatePointDto } from '../dto/create-point.dto';

@Injectable()
export class FirstElementValidatorPipe implements PipeTransform {
  transform(value: CreatePointDto) {
    // Check if the value is an array
    if (!Array.isArray(value)) {
      throw new BadRequestException('Invalid input. Expecting an array.');
    }

    // Check if the array is empty
    if (value.length === 0) {
      throw new BadRequestException('Array is empty.');
    }

    // Extract the first element of the array
    const firstElement = value[0];

    // Validate the first element (example validation, replace with your own logic)
    if (typeof firstElement !== 'number' || isNaN(firstElement)) {
      throw new BadRequestException('First element must be a number.');
    }

    // Return the validated value
    return value;
  }
}
