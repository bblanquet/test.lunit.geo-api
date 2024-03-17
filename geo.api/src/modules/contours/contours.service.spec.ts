import { ContoursService } from './contours.service';
import { ContoursDao } from './contours.dao';
import { GeoType } from '../../common/model/geoType';

describe('ContoursService', () => {
  let contoursService: ContoursService;
  let contoursDao: jest.Mocked<ContoursDao>;

  beforeEach(() => {
    contoursDao = {
      findOne: jest.fn(),
      interesect: jest.fn(),
    } as unknown as jest.Mocked<ContoursDao>;
    contoursService = new ContoursService(contoursDao);
  });

  it('should return contour data', async () => {
    const contourId = '3';
    const contour = {
      id: contourId,
      coordinates: 'POLYGON((10 10,5 5,1 1,10 10))',
    };
    contoursDao.findOne.mockResolvedValue(contour);

    const result = await contoursService.findOne(contourId);
    expect(result.data.coordinates).toEqual([
      [10, 10],
      [5, 5],
      [1, 1],
      [10, 10],
    ]);
    expect(result.id).toEqual(contourId);
    expect(result.data.type).toEqual(GeoType[GeoType.Polygon]);
    expect(contoursDao.findOne).toHaveBeenCalledWith(contourId);
  });
  it('should return the intersected data', async () => {
    const id = '3';
    const contourId = '4';
    const value = [
      {
        coordinates:
          'GEOMETRYCOLLECTION(POLYGON((0 1,1 1,1 0,0 0,0 1)),POLYGON((3 1,4 1,4 0,3 0,3 1)),LINESTRING(3 1,1 1))',
      },
    ];
    contoursDao.interesect.mockResolvedValue(value);
    const result = await contoursService.interesect(id, contourId);

    expect(result[0].data.type).toEqual(GeoType[GeoType.Polygon]);
    expect(result[0].data.coordinates).toEqual([
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
      [0, 1],
    ]);
    expect(result[1].data.type).toEqual(GeoType[GeoType.Polygon]);
    expect(result[1].data.coordinates).toEqual([
      [3, 1],
      [4, 1],
      [4, 0],
      [3, 0],
      [3, 1],
    ]);
  });
  it('should return the intersected data #2', async () => {
    const id = '3';
    const contourId = '4';
    const value = [
      {
        coordinates: 'POLYGON((2 5,5 5,5 2,2 2,2 5))',
      },
    ];
    contoursDao.interesect.mockResolvedValue(value);
    const result = await contoursService.interesect(id, contourId);

    expect(result[0].data.type).toEqual(GeoType[GeoType.Polygon]);
    expect(result[0].data.coordinates).toEqual([
      [2, 5],
      [5, 5],
      [5, 2],
      [2, 2],
      [2, 5],
    ]);
  });
  it('should return the intersected data #3', async () => {
    const id = '3';
    const contourId = '4';
    const value = [
      {
        coordinates:
          'GEOMETRYCOLLECTION(POLYGON((0 1,1 1)),POLYGON((3 1,4 1)),POLYGON((2 2,6 6)),LINESTRING(3 1,1 1))',
      },
    ];
    contoursDao.interesect.mockResolvedValue(value);
    const result = await contoursService.interesect(id, contourId);

    expect(result[0].data.type).toEqual(GeoType[GeoType.Polygon]);
    expect(result[0].data.coordinates).toEqual([
      [0, 1],
      [1, 1],
    ]);
    expect(result[1].data.type).toEqual(GeoType[GeoType.Polygon]);
    expect(result[1].data.coordinates).toEqual([
      [3, 1],
      [4, 1],
    ]);
    expect(result[2].data.type).toEqual(GeoType[GeoType.Polygon]);
    expect(result[2].data.coordinates).toEqual([
      [2, 2],
      [6, 6],
    ]);
  });
});
