import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dtos/create-point.dto';
import { ResponseDto } from '../../common/dtos/response.dto';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeoData } from '../../common/model/geoData';
import { ObjectIdDto } from '../../common/dtos/objectId.dto';
import { GeoType } from 'src/common/model/geoType';
import { ContourDto } from './dtos/contours.dto';

@ApiTags('Points')
@Controller('Points')
export class PointsController {
  constructor(private readonly pointService: PointsService) {}

  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 1,
          data: {
            type: GeoType[GeoType.Point],
            coordinates: [1, 1],
          },
        },
      ],
    },
  })
  @Get(':id')
  findOne(@Param() params: ObjectIdDto): Promise<ResponseDto<GeoData> | null> {
    return this.pointService.findOne(params.id);
  }

  @Patch(':id')
  @ApiBody({
    type: CreatePointDto,
    examples: {
      a: {
        value: {
          type: GeoType[GeoType.Point],
          coordinates: [1, 1],
        } as CreatePointDto,
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        data: {
          type: GeoType[GeoType.Point],
          coordinates: [1, 1],
        },
      },
    },
  })
  update(
    @Param() params: ObjectIdDto,
    @Body() createPointDto: CreatePointDto,
  ): Promise<ResponseDto<GeoData>> {
    return this.pointService.update(params.id, createPointDto);
  }

  @Post()
  @ApiBody({
    type: CreatePointDto,
    examples: {
      a: {
        value: {
          type: GeoType[GeoType.Point],
          coordinates: [1, 1],
        } as CreatePointDto,
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        data: {
          type: GeoType[GeoType.Point],
          coordinates: [1, 1],
        },
      },
    },
  })
  async create(
    @Body() createPointDto: CreatePointDto,
  ): Promise<ResponseDto<GeoData>> {
    return this.pointService.create(createPointDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        data: {
          type: GeoType[GeoType.Point],
          coordinates: [1, 1],
        },
      },
    },
  })
  async delete(
    @Param() params: ObjectIdDto,
  ): Promise<ResponseDto<GeoData> | null> {
    return this.pointService.delete(params.id);
  }

  @Get()
  @ApiQuery({ name: 'contour', required: false, type: String })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 1,
          data: {
            type: GeoType[GeoType.Point],
            coordinates: [1, 1],
          },
        },
      ],
    },
  })
  async contours(
    @Query() query: ContourDto,
  ): Promise<Array<ResponseDto<GeoData>>> {
    if (query.contour) {
      return this.pointService.contours(query.contour);
    } else {
      return this.pointService.findAll();
    }
  }
}
