import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dtos/create-point.dto';
import { ResponseDto } from '../../common/dtos/response.dto';
import { GeoData } from '../../common/model/geoData';
import { GeoType } from '../../common/model/geoType';
import DbPool from 'src/common/databases/dbPool';
import { formatPoint } from 'src/common/utils';

@Injectable()
export class PointsService {
  private _id: string;
  private _coordinate: string;
  private _tablename: string;

  constructor(private dbPool: DbPool) {
    this._id = 'id';
    this._coordinate = 'coordinate';
    this._tablename = 'points';
  }

  async findOne(id: string): Promise<ResponseDto<GeoData> | null> {
    const rows = await this.dbPool.query(
      `SELECT id as ${this._id}, ST_AsText(coordinate) as ${this._coordinate} FROM ${this._tablename} where id = $1`,
      [id],
    );
    if (1 === rows.length) {
      return this.mapRowToResponseDto(rows[0]);
    } else {
      return null;
    }
  }

  async findAll(): Promise<Array<ResponseDto<GeoData>>> {
    const rows = await this.dbPool.query(
      `SELECT id as ${this._id}, ST_AsText(coordinate) as ${this._coordinate} FROM ${this._tablename}`,
      [],
    );
    return rows.map((row) => this.mapRowToResponseDto(row));
  }

  async create(createPointDto: CreatePointDto): Promise<ResponseDto<GeoData>> {
    const query = `INSERT INTO ${this._tablename} (coordinate) VALUES (ST_SetSRID(ST_MakePoint($1, $2), 4326)) RETURNING id;`;
    const values = [
      `${createPointDto.coordinates[0]}`,
      `${createPointDto.coordinates[1]}`,
    ];
    const rows = await this.dbPool.query(query, values);
    return this.mapRowToResponseDto(rows[0], createPointDto.coordinates);
  }

  async update(
    id: string,
    createPointDto: CreatePointDto,
  ): Promise<ResponseDto<GeoData>> {
    const query = `UPDATE ${this._tablename} SET coordinate = ST_SetSRID(ST_MakePoint($1, $2), 4326) where id = $3 RETURNING id;`;
    const values = [
      `${createPointDto.coordinates[0]}`,
      `${createPointDto.coordinates[1]}`,
      id,
    ];
    const rows = await this.dbPool.query(query, values);
    return this.mapRowToResponseDto(rows[0], createPointDto.coordinates);
  }

  async delete(id: string): Promise<ResponseDto<null> | null> {
    const query = `DELETE FROM ${this._tablename} where id = $1 RETURNING id;`;
    const values = [id];
    const rows = await this.dbPool.query(query, values);
    if (rows.length === 1) {
      return new ResponseDto<null>(id, null);
    } else {
      return null;
    }
  }

  async contours(id: string): Promise<ResponseDto<GeoData>[]> {
    const query = `SELECT points.id as ${this._id}, ST_AsText(points.coordinate) as ${this._coordinate}
        FROM ${this._tablename} JOIN contours ON ST_Contains(contours.coordinates, points.coordinate)
        WHERE contours.id = $1;`;
    const values = [id];
    const rows = await this.dbPool.query(query, values);
    return rows.map((row) => this.mapRowToResponseDto(row));
  }

  private mapRowToResponseDto(
    row: any,
    coordinates?: number[],
  ): ResponseDto<GeoData> {
    const responseCoordinates = coordinates
      ? coordinates
      : formatPoint(row[this._coordinate]);
    return new ResponseDto<GeoData>(row[this._id], {
      type: GeoType[GeoType.Point],
      coordinates: responseCoordinates,
    });
  }
}
