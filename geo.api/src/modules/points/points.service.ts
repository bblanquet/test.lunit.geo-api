import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePointDto } from './dtos/create-point.dto';
import { ResponseDto } from '../../common/dtos/response.dto';
import { GeoData } from '../../common/model/geoData';
import { GeoType } from '../../common/model/geoType';
import { formatPoint } from 'src/common/utils';
import { PointsDAO } from './points.dao';

@Injectable()
export class PointsService {
  constructor(private readonly _pointsDAO: PointsDAO) {}

  async findOne(id: string): Promise<ResponseDto<GeoData> | null> {
    const row = await this._pointsDAO.getPointById(id);
    if (!row) {
      return null;
    }
    return this.mapRowToResponseDto(row);
  }

  async findAll(): Promise<ResponseDto<GeoData>[]> {
    const rows = await this._pointsDAO.getAllPoints();
    return rows.map((row) => this.mapRowToResponseDto(row));
  }

  async create(createPointDto: CreatePointDto): Promise<ResponseDto<GeoData>> {
    const row = await this._pointsDAO.createPoint(createPointDto.coordinates);
    return this.mapRowToResponseDto(row, createPointDto.coordinates);
  }

  async update(
    id: string,
    createPointDto: CreatePointDto,
  ): Promise<ResponseDto<GeoData>> {
    const row = await this._pointsDAO.updatePoint(
      id,
      createPointDto.coordinates,
    );
    return this.mapRowToResponseDto(row, createPointDto.coordinates);
  }

  async delete(id: string): Promise<ResponseDto<null>> {
    const row = await this._pointsDAO.deletePoint(id);
    if (!row) {
      throw new NotFoundException('Point not found');
    }
    return new ResponseDto<null>(id, null);
  }

  async contours(id: string): Promise<ResponseDto<GeoData>[]> {
    const rows = await this._pointsDAO.getPointsWithinContour(id);
    return rows.map((row) => this.mapRowToResponseDto(row));
  }

  private mapRowToResponseDto(
    row: any,
    coordinates?: number[],
  ): ResponseDto<GeoData> {
    const responseCoordinates = coordinates
      ? coordinates
      : formatPoint(row.coordinate);
    return new ResponseDto<GeoData>(row.id, {
      type: GeoType[GeoType.Point],
      coordinates: responseCoordinates,
    });
  }
}
