import { Injectable, NotFoundException } from '@nestjs/common';
import { GeoData } from '../../common/model/geoData';
import { GeoType } from '../../common/model/geoType';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { CreateContourDto } from './dtos/create-contours.dto';
import DbPool from 'src/common/databases/dbPool';
import { formatPolygon } from 'src/common/utils';

@Injectable()
export class ContoursService {
  private _id: string;
  private _coordinates: string;
  private _tablename: string;
  constructor(private dbPool: DbPool) {
    this._id = 'id';
    this._coordinates = 'coordinates';
    this._tablename = 'contours';
  }

  async findAll(): Promise<Array<ResponseDto<GeoData>>> {
    const query = `SELECT id as ${this._id}, ST_AsText(coordinates) as ${this._coordinates} FROM ${this._tablename}`;
    const values = [];

    const rows = await this.dbPool.query(query, values);
    return rows.map((row) => this.mapRowToResponseDto(row));
  }

  async create(
    createContourDto: CreateContourDto,
  ): Promise<ResponseDto<GeoData>> {
    const query = `INSERT INTO ${this._tablename} (coordinates) VALUES (ST_GeomFromText($1, 4326)) RETURNING id;`;
    const values = [
      `POLYGON((${createContourDto.coordinates.map((coo) => `${coo[0]} ${coo[1]}`).join(',')}))`,
    ];
    const rows = await this.dbPool.query(query, values);
    return this.mapRowToResponseDto(rows[0]);
  }

  async findOne(id: string): Promise<ResponseDto<GeoData> | null> {
    const query = `SELECT id as ${this._id}, ST_AsText(coordinates) as ${this._coordinates} FROM ${this._tablename} where id = $1;`;
    const values = [id];
    const rows = await this.dbPool.query(query, values);
    if (!rows[0]) {
      throw new NotFoundException('Contour not found');
    }
    return this.mapRowToResponseDto(rows[0]);
  }
  async update(
    id: string,
    createContourDto: CreateContourDto,
  ): Promise<ResponseDto<GeoData>> {
    const query = `UPDATE ${this._tablename} SET coordinates = $1 where id = $2 RETURNING id;`;
    const values = [
      `POLYGON((${createContourDto.coordinates.map((coo) => `${coo[0]} ${coo[1]}`).join(',')}))`,
      id,
    ];
    const rows = await this.dbPool.query(query, values);
    return new ResponseDto<GeoData>(rows[0].id, {
      type: GeoType[GeoType.Polygon],
      coordinates: createContourDto.coordinates,
    });
  }

  async delete(id: string): Promise<ResponseDto<GeoData> | null> {
    const query = `DELETE FROM ${this._tablename} where id = $1 RETURNING id;`;
    const values = [id];
    const rows = await this.dbPool.query(query, values);
    if (rows.length === 1) {
      return new ResponseDto<null>(id, null);
    } else {
      return null;
    }
  }

  async intersect(
    id: string,
    contourId: string,
  ): Promise<Array<ResponseDto<GeoData>>> {
    const id1 = 'id1';
    const id2 = 'id2';
    const coos1 = 'coos1';
    const coos2 = 'coos2';
    const query = `SELECT a.id AS ${id1}, 
                        b.id AS ${id2},
                        ST_AsText(a.coordinates) AS ${coos1},
                        ST_AsText(b.coordinates) AS ${coos2}
                    FROM contours AS a
                    JOIN contours AS b
                        ON a.id = $1 AND b.id = $2
                    WHERE ST_Intersects(a.coordinates, b.coordinates);`;
    const values = [id, contourId];
    const rows = await this.dbPool.query(query, values);
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

  private mapRowToResponseDto(row: any): ResponseDto<GeoData> {
    return new ResponseDto<GeoData>(row[this._id], {
      type: GeoType[GeoType.Polygon],
      coordinates: formatPolygon(row[this._coordinates]),
    });
  }
}
