import { error } from 'console';

export const getPoint = (coordinate: string): number[] => {
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

export const getPolygon = (coordinate: string): number[][] => {
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

export const getPolygonCollection = (coordinate: string): number[][][] => {
  const regex = /POLYGON\(\((.*?)\)\)/g;
  const polygons = [];
  let match: any[];
  while ((match = regex.exec(coordinate)) !== null) {
    const coosText = match[1];
    if (coosText) {
      const coos = coosText
        .split(',')
        .map((coo: string) => coo.split(' ').map((c) => parseFloat(c)));
      polygons.push(coos);
    }
  }
  return polygons;
};
