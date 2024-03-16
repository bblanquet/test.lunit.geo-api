import { BadRequestException } from '@nestjs/common';

export const coordinateTransform = ({ value }) => {
  const v = value as Array<number>;
  const idValid =
    v.length === 2 && -180 <= v[0] && v[0] <= 180 && -90 <= v[1] && v[1] <= 90;

  if (idValid) {
    return v;
  } else {
    throw new BadRequestException(
      'x should be between -180 and 180\n y should be between -90 and 90',
      {
        cause: new Error(),
        description: 'Bad Request',
      },
    );
  }
};
