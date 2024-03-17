import { ContoursService } from './contours.service';
import { ContoursDao } from './contours.dao';
import { GeoType } from '../../common/model/geoType';

describe('ContoursService', () => {
  let contoursService: ContoursService;
  let contoursDao: jest.Mocked<ContoursDao>;

  beforeEach(() => {
    contoursDao = {
      findOne: jest.fn(),
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
});
