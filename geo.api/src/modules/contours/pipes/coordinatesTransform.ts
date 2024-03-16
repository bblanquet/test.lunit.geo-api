import { BadRequestException } from '@nestjs/common';

export const coordinatesTransform = ({ value }) => {
  const v = value as Array<Array<number>>;
  const idValid = v.every((item) => {
    return (
      item.length === 2 &&
      -180 <= item[0] &&
      item[0] <= 180 &&
      -90 <= item[1] &&
      item[1] <= 90
    );
  });

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
