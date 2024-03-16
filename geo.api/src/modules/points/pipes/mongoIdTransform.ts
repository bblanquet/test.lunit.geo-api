import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export const MongoIdTransform = ({ value }) => {
  if (
    Types.ObjectId.isValid(value) &&
    new Types.ObjectId(value).toString() === value
  ) {
    return value;
  }
  throw new BadRequestException(value, {
    cause: new Error('Id validation fail'),
    description: 'Bad Request',
  });
};
