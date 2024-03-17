import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePointDto } from './dtos/create-point.dto';
import { ResponseDto } from '../../common/dtos/response.dto';
import { GeoData } from '../../common/model/geoData';
import { GeoType } from '../../common/model/geoType';
import { PointsDAO } from './points.dao';
import { formatPoint } from '../../common/utils';

@Injectable()
export class PointsService {
  constructor(private readonly _pointsDAO: PointsDAO) {}

  async findOne(id: string): Promise<ResponseDto<GeoData> | null> {
    const row = await this._pointsDAO.findOne(id);
    if (!row) {
      return null;
    }
    return this.mapRowToResponseDto(row);
  }

  async findAll(): Promise<ResponseDto<GeoData>[]> {
    const rows = await this._pointsDAO.findAll();
    return rows.map((row) => this.mapRowToResponseDto(row));
  }

  async create(createPointDto: CreatePointDto): Promise<ResponseDto<GeoData>> {
    const row = await this._pointsDAO.create(createPointDto.coordinates);
    return this.mapRowToResponseDto(row, createPointDto.coordinates);
  }

  async update(
    id: string,
    createPointDto: CreatePointDto,
  ): Promise<ResponseDto<GeoData>> {
    const row = await this._pointsDAO.update(id, createPointDto.coordinates);
    return this.mapRowToResponseDto(row, createPointDto.coordinates);
  }

  async delete(id: string): Promise<ResponseDto<null>> {
    const row = await this._pointsDAO.delete(id);
    if (!row) {
      throw new NotFoundException('Point not found');
    }
    return new ResponseDto<null>(id, null);
  }

  async findContained(id: string): Promise<ResponseDto<GeoData>[]> {
    const rows = await this._pointsDAO.findContained(id);
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
