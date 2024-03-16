import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { ResponseDto } from './dto/response.dto';
import { Point } from './schema/point.schema';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CoordinateValidator } from './common/CoordinateValidator';

@Controller('Points')
export class PointsController {
  constructor(
    private readonly pointService: PointsService,
    private readonly coordinateValidator: CoordinateValidator,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 1,
          data: {
            x: 1,
            y: 1,
          },
        },
      ],
    },
  })
  list(): Promise<Array<ResponseDto<Point>>> {
    return this.pointService.list();
  }

  @Post()
  @ApiBody({
    type: CreatePointDto,
    examples: {
      a: {
        value: { type: 'point', coordinates: [1, 1] } as CreatePointDto,
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        data: {
          x: 1,
          y: 1,
        },
      },
    },
  })
  async create(
    @Body() createPointDto: CreatePointDto,
  ): Promise<ResponseDto<Point>> {
    if (
      this.coordinateValidator.validate(
        createPointDto.coordinates[0],
        createPointDto.coordinates[1],
      )
    ) {
      return await this.pointService.create(createPointDto);
    } else {
      throw new BadRequestException('', {
        cause: new Error(
          'coordinate[0] should be between -180 and 180\n y should be between -90 and 90',
        ),
        description: 'Bad Request',
      });
    }
  }
}
