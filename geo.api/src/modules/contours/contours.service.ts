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
}
