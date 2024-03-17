import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dtos/create-point.dto';
import { Point } from './schemas/point.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDto } from '../../common/dtos/response.dto';
import { GeoData } from '../../common/model/geoData';
import { GeoType } from '../../common/model/geoType';
import DbPool from 'src/common/databases/dbPool';
import { formatPoint } from 'src/common/utils';

@Injectable()
export class PointsService {
  constructor(
    @InjectModel(Point.name, 'geo') private pointModel: Model<Point>,
    private dbPool: DbPool,
  ) {}

  async findOne(id: string): Promise<ResponseDto<GeoData> | null> {
    const response = await this.pointModel.findOne({ _id: id }).exec();
    if (response && response.id) {
      return new ResponseDto<GeoData>(response.id, {
        type: GeoType[GeoType.Point],
        coordinates: [response.x, response.y],
      });
    } else {
      return null;
    }
  }

  async findAll(): Promise<Array<ResponseDto<GeoData>>> {
    const idProp = 'id';
    const cooProp = 'coordinate';

    const rows = await this.dbPool.query(
      `SELECT ${idProp} as ${idProp}, ST_AsText(${cooProp}) as ${cooProp} FROM points`,
      [],
    );
    const result = rows.map(
      (item) =>
        new ResponseDto<GeoData>(item[idProp], {
          type: GeoType[GeoType.Point],
          coordinates: formatPoint(item[cooProp]),
        }),
    );
    return result;
  }

  async create(createPointDto: CreatePointDto): Promise<ResponseDto<GeoData>> {
    const query =
      'INSERT INTO points (coordinate) VALUES (ST_SetSRID(ST_MakePoint($1, $2), 4326)) RETURNING id;';
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
    const response = await this.pointModel
      .updateOne(
        { _id: id },
        {
          x: createPointDto.coordinates[0],
          y: createPointDto.coordinates[1],
        },
        { upsert: true },
      )
      .exec();

    return new ResponseDto<GeoData>(
      response.upsertedCount === 1 ? response.upsertedId.toString() : id,
      {
        type: GeoType[GeoType.Point],
        coordinates: [
          createPointDto.coordinates[0],
          createPointDto.coordinates[1],
        ],
      },
    );
  }

  async delete(id: string): Promise<ResponseDto<GeoData> | null> {
    const findResponse = await this.findOne(id);
    const response = await this.pointModel.deleteOne({ _id: id }).exec();
    if (response.deletedCount === 1) {
      return new ResponseDto<GeoData>(id, findResponse.data);
    } else {
      return null;
    }
  }

  async contours(id: string): Promise<ResponseDto<GeoData>[]> {
    const idProp = 'id';
    const cooProp = 'coordinate';
    const query = `SELECT points.${idProp} as ${idProp}, ST_AsText(points.${cooProp}) as ${cooProp}
        FROM points JOIN contours ON ST_Contains(contours.coordinates, points.${cooProp})
        WHERE contours.id = $1;`;
    const values = [id];
    const rows = await this.dbPool.query(query, values);
    const result = rows.map(
      (item) =>
        new ResponseDto<GeoData>(item[idProp], {
          type: GeoType[GeoType.Point],
          coordinates: formatPoint(item[cooProp]),
        }),
    );
    return result;
  }
}
