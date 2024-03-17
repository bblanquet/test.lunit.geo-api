import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos/response.dto';
import { GeoData } from '../../common/model/geoData';
import { GeoType } from '../../common/model/geoType';
import { CreateContourDto } from './dtos/create-contours.dto';
import { ContoursDao } from './contours.dao';
import { formatPolygon } from '../../common/utils';

@Injectable()
export class ContoursService {
  private readonly _coordinates: string = 'coordinates';
  private readonly _id: string = 'id';

  constructor(private readonly _contoursDao: ContoursDao) {}

  async findAll(): Promise<Array<ResponseDto<GeoData>>> {
    const rows = await this._contoursDao.findAll();
    return rows.map((row) => this.mapRowToResponseDto(row));
  }

  async create(
    createContourDto: CreateContourDto,
  ): Promise<ResponseDto<GeoData>> {
    const newRow = await this._contoursDao.create(createContourDto.coordinates);
    return this.mapRowToResponseDto(newRow, createContourDto.coordinates);
  }

  async findOne(id: string): Promise<ResponseDto<GeoData> | null> {
    const row = await this._contoursDao.findOne(id);
    if (!row) {
      throw new NotFoundException('Contour not found');
    }
    return this.mapRowToResponseDto(row);
  }

  async update(
    id: string,
    createContourDto: CreateContourDto,
  ): Promise<ResponseDto<GeoData>> {
    const updatedRow = await this._contoursDao.update(
      id,
      createContourDto.coordinates,
    );
    return this.mapRowToResponseDto(updatedRow, createContourDto.coordinates);
  }

  async delete(id: string): Promise<ResponseDto<null> | null> {
    const deletedRow = await this._contoursDao.delete(id);
    if (!deletedRow) {
      return null;
    }
    return new ResponseDto<null>(id, null);
  }

  async intersect(
    id: string,
    contourId: string,
  ): Promise<Array<ResponseDto<GeoData>>> {
    const id1 = 'id1';
    const id2 = 'id2';
    const coos1 = 'coos1';
    const coos2 = 'coos2';
    const rows = await this._contoursDao.interesect(id, contourId);
    if (rows.length === 1) {
      return [
        new ResponseDto<GeoData>(rows[0][id1], {
          type: GeoType[GeoType.Polygon],
          coordinates: formatPolygon(rows[0][coos1]),
        }),
        new ResponseDto<GeoData>(rows[0][id2], {
          type: GeoType[GeoType.Polygon],
          coordinates: formatPolygon(rows[0][coos2]),
        }),
      ];
    } else {
      return new Array<ResponseDto<GeoData>>();
    }
  }

  private mapRowToResponseDto(
    row: any,
    coordinates?: number[][],
  ): ResponseDto<GeoData> {
    return new ResponseDto<GeoData>(row[this._id], {
      type: GeoType[GeoType.Polygon],
      coordinates: coordinates
        ? coordinates
        : formatPolygon(row[this._coordinates]),
    });
  }
}
