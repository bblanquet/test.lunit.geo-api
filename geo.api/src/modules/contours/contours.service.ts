import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GeoData } from '../../common/model/geoData';
import { GeoType } from '../../common/model/geoType';
import { Contour } from './schemas/contour.schema';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { CreateContourDto } from './dtos/create-contours.dto';

@Injectable()
export class ContoursService {
  constructor(
    @InjectModel(Contour.name, 'geo') private contourModel: Model<Contour>,
  ) {}

  async findAll(): Promise<Array<ResponseDto<GeoData>>> {
    const response = await this.contourModel.find().exec();
    const result = response.map((item) => {
      return new ResponseDto<GeoData>(item.id, {
        type: GeoType[GeoType.Polygon],
        coordinates: item.coordinates.map((coordinate) => [
          coordinate.x,
          coordinate.y,
        ]),
      });
    });
    return result;
  }

  async create(
    createContourDto: CreateContourDto,
  ): Promise<ResponseDto<GeoData>> {
    const createContours = new this.contourModel({
      coordinates: createContourDto.coordinates.map((coo) => {
        return { x: coo[0], y: coo[1] };
      }),
    });
    const response = await createContours.save();
    return new ResponseDto<GeoData>(response.id, {
      type: GeoType[GeoType.Polygon],
      coordinates: response.coordinates.map((coo) => [coo.x, coo.y]),
    });
  }

  async findOne(id: string): Promise<ResponseDto<GeoData> | null> {
    const response = await this.contourModel.findOne({ _id: id }).exec();
    if (response && response.id) {
      return new ResponseDto<GeoData>(response.id, {
        type: GeoType[GeoType.Polygon],
        coordinates: response.coordinates.map((coo) => [coo.x, coo.y]),
      });
    } else {
      return null;
    }
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
