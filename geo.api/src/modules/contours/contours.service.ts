import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GeoData } from '../../common/model/geoData';
import { GeoType } from '../../common/model/geoType';
import { Contour } from './schemas/contour.schema';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { CreateContourDto } from './dtos/create-contours.dto';
import DbPool from 'src/common/databases/dbPool';
import { formatPolygon } from 'src/common/utils';

@Injectable()
export class ContoursService {
  constructor(
    private dbPool: DbPool,
    @InjectModel(Contour.name, 'geo') private contourModel: Model<Contour>,
  ) {}

  async findAll(): Promise<Array<ResponseDto<GeoData>>> {
    const idProp = 'id';
    const coosProp = 'coordinates';
    const query = `SELECT ${idProp} as ${idProp}, ST_AsText(${coosProp}) as ${coosProp} FROM contours`;
    const values = [];

    const rows = await this.dbPool.query(query, values);
    const result = rows.map(
      (item) =>
        new ResponseDto<GeoData>(item[idProp], {
          type: GeoType[GeoType.Polygon],
          coordinates: formatPolygon(item[coosProp]),
        }),
    );
    return result;
  }

  async create(
    createContourDto: CreateContourDto,
  ): Promise<ResponseDto<GeoData>> {
    const query =
      'INSERT INTO contours (coordinates) VALUES (ST_GeomFromText($1, 4326)) RETURNING id;';
    const values = [
      `POLYGON((${createContourDto.coordinates.map((coo) => `${coo[0]} ${coo[1]}`).join(',')}))`,
    ];
    const rows = await this.dbPool.query(query, values);
    return new ResponseDto<GeoData>(rows[0].id, {
      type: GeoType[GeoType.Polygon],
      coordinates: createContourDto.coordinates,
    });
  }

  async findOne(id: string): Promise<ResponseDto<GeoData> | null> {
    const idProp = 'id';
    const coosProp = 'coordinates';
    const query = `SELECT ${idProp} as ${idProp}, ST_AsText(${coosProp}) as ${coosProp} FROM contours where ${idProp} = $1;`;
    const values = [id];

    const rows = await this.dbPool.query(query, values);

    return new ResponseDto<GeoData>(rows[0][idProp], {
      type: GeoType[GeoType.Polygon],
      coordinates: formatPolygon(rows[0][coosProp]),
    });
  }
  async update(
    id: string,
    createPointDto: CreateContourDto,
  ): Promise<ResponseDto<GeoData>> {
    const response = await this.contourModel
      .updateOne(
        { _id: id },
        {
          coordinates: createPointDto.coordinates.map((coo) => {
            return { x: coo[0], y: coo[1] };
          }),
        },
        { upsert: true },
      )
      .exec();

    return new ResponseDto<GeoData>(
      response.upsertedCount === 1 ? response.upsertedId.toString() : id,
      {
        type: GeoType[GeoType.Polygon],
        coordinates: createPointDto.coordinates,
      },
    );
  }

  async delete(id: string): Promise<ResponseDto<GeoData> | null> {
    const findResponse = await this.findOne(id);
    const response = await this.contourModel.deleteOne({ _id: id }).exec();
    if (response.deletedCount === 1) {
      return new ResponseDto<GeoData>(id, findResponse.data);
    } else {
      return null;
    }
  }
}
