import { PointsService } from './points.service';
import { PointsDAO } from './points.dao';
import { GeoType } from '../../common/model/geoType';

describe('PointsService', () => {
  let pointService: PointsService;
  let pointDao: jest.Mocked<PointsDAO>;

  beforeEach(() => {
    pointDao = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<PointsDAO>;
    pointService = new PointsService(pointDao);
  });

  it('should return point data', async () => {
    const pointId = '1';
    const point = { id: pointId, coordinate: 'POINT(10 10)' };
    pointDao.findOne.mockResolvedValue(point);

    const result = await pointService.findOne(pointId);
    expect(result.data.coordinates).toEqual([10, 10]);
    expect(result.id).toEqual(pointId);
    expect(result.data.type).toEqual(GeoType[GeoType.Point]);
    expect(pointDao.findOne).toHaveBeenCalledWith(pointId);
  });
});
