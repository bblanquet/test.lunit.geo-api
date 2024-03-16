import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { Point } from './schema/point.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class PointsService {
  constructor(
    @InjectModel(Point.name, 'geo') private pointModel: Model<Point>,
  ) {}

  async list(): Promise<Array<ResponseDto<Point>>> {
    const response = await this.pointModel.find().exec();
    const result = response.map((item) => {
      return new ResponseDto<Point>(item.id, { x: item.x, y: item.y });
    });
    return result;
  }

  async create(createPointDto: CreatePointDto): Promise<ResponseDto<Point>> {
    const createdPoint = new this.pointModel({
      x: createPointDto.coordinates[0],
      y: createPointDto.coordinates[1],
    });
    const response = await createdPoint.save();
    return new ResponseDto<Point>(response.id, {
      x: response.x,
      y: response.y,
    });
  }
}
