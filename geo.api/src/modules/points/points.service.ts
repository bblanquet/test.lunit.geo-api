import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dtos/create-point.dto';
import { Point } from './schemas/point.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDto } from '../../common/dtos/response.dto';
import { GeoData } from '../../common/model/geoData';
import { GeoType } from '../../common/model/geoType';

@Injectable()
export class PointsService {
  constructor(
    @InjectModel(Point.name, 'geo') private pointModel: Model<Point>,
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
    const response = await this.pointModel.find().exec();
    const result = response.map((item) => {
      return new ResponseDto<GeoData>(item.id, {
        type: GeoType[GeoType.Point],
        coordinates: [item.x, item.y],
      });
    });
    return result;
  }

  async create(createPointDto: CreatePointDto): Promise<ResponseDto<GeoData>> {
    const createdPoint = new this.pointModel({
      x: createPointDto.coordinates[0],
      y: createPointDto.coordinates[1],
    });
    const response = await createdPoint.save();
    return new ResponseDto<GeoData>(response.id, {
      type: GeoType[GeoType.Point],
      coordinates: [response.x, response.y],
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
}
