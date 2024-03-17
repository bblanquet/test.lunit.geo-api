import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dtos/create-point.dto';
import { ResponseDto } from '../../common/dtos/response.dto';
import { GeoData } from '../../common/model/geoData';
import { GeoType } from '../../common/model/geoType';
import DbPool from 'src/common/databases/dbPool';
import { formatPoint } from 'src/common/utils';

@Injectable()
export class PointsService {
  private id: string;
  private coordinate: string;
  private tablename: string;

  constructor(private dbPool: DbPool) {
    this.id = 'id';
    this.coordinate = 'coordinate';
    this.tablename = 'points';
  }

  async findOne(id: string): Promise<ResponseDto<GeoData> | null> {
    const rows = await this.dbPool.query(
      `SELECT id as ${this.id}, ST_AsText(coordinate) as ${this.coordinate} FROM ${this.tablename} where id = $1`,
      [id],
    );
    if (1 === rows.length) {
      return new ResponseDto<GeoData>(rows[0][this.id], {
        type: GeoType[GeoType.Point],
        coordinates: formatPoint(rows[0][this.coordinate]),
      });
    } else {
      return null;
    }
  }

  async findAll(): Promise<Array<ResponseDto<GeoData>>> {
    const rows = await this.dbPool.query(
      `SELECT id as ${this.id}, ST_AsText(coordinate) as ${this.coordinate} FROM ${this.tablename}`,
      [],
    );
    const result = rows.map(
      (item) =>
        new ResponseDto<GeoData>(item[this.id], {
          type: GeoType[GeoType.Point],
          coordinates: formatPoint(item[this.coordinate]),
        }),
    );
    return result;
  }

  async create(createPointDto: CreatePointDto): Promise<ResponseDto<GeoData>> {
    const query = `INSERT INTO ${this.tablename} (coordinate) VALUES (ST_SetSRID(ST_MakePoint($1, $2), 4326)) RETURNING id;`;
    const values = [
      `${createPointDto.coordinates[0]}`,
      `${createPointDto.coordinates[1]}`,
    ];
    const rows = await this.dbPool.query(query, values);
    return new ResponseDto<GeoData>(rows[0].id, {
      type: GeoType[GeoType.Point],
      coordinates: createPointDto.coordinates,
    });
  }

  async update(
    id: string,
    createPointDto: CreatePointDto,
  ): Promise<ResponseDto<GeoData>> {
    const query = `UPDATE ${this.tablename} SET coordinate = ST_SetSRID(ST_MakePoint($1, $2), 4326) where id = $3 RETURNING id;`;
    const values = [
      `${createPointDto.coordinates[0]}`,
      `${createPointDto.coordinates[1]}`,
      id,
    ];
    const rows = await this.dbPool.query(query, values);
    return new ResponseDto<GeoData>(rows[0].id, {
      type: GeoType[GeoType.Point],
      coordinates: createPointDto.coordinates,
    });
  }

  async delete(id: string): Promise<ResponseDto<null> | null> {
    const query = `DELETE FROM ${this.tablename} where id = $1 RETURNING id;`;
    const values = [id];
    const rows = await this.dbPool.query(query, values);
    if (rows.length === 1) {
      return new ResponseDto<null>(id, null);
    } else {
      return null;
    }
  }

  async contours(id: string): Promise<ResponseDto<GeoData>[]> {
    const query = `SELECT points.id as ${this.id}, ST_AsText(points.coordinate) as ${this.coordinate}
        FROM ${this.tablename} JOIN contours ON ST_Contains(contours.coordinates, points.coordinate)
        WHERE contours.id = $1;`;
    const values = [id];
    const rows = await this.dbPool.query(query, values);
    const result = rows.map(
      (item) =>
        new ResponseDto<GeoData>(item[this.id], {
          type: GeoType[GeoType.Point],
          coordinates: formatPoint(item[this.coordinate]),
        }),
    );
    return result;
  }
}
