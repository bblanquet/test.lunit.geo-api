import { error } from 'console';

export const formatPoint = (coordinate: string): number[] => {
  const regex = /POINT\((.*)\)/;
  const match = coordinate.match(regex);
  if (match) {
    const coos = match[1].split(' ').map((coo) => parseFloat(coo));
    if (coos.length === 2) {
      return coos;
    }
  }
  throw error('DB returns invalid coordinate format.');
};

export const formatPolygon = (coordinate: string): number[][] => {
  const regex = /POLYGON\(\((.*)\)\)/;
  const match = coordinate.match(regex);
  if (match) {
    const coos = match[1]
      .split(',')
      .map((coo) => coo.split(' ').map((c) => parseFloat(c)));
    if (coos.every((coo) => coo.length === 2)) {
      return coos;
    }
  }
  throw error('DB returns invalid coordinate format.');
};
