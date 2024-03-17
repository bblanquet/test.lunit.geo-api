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
  findOne(@Param('id') id: string): Promise<ResponseDto<GeoData> | null> {
    return this.pointService.findOne(id);
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
    @Param('id') id: string,
    @Body() createPointDto: CreatePointDto,
  ): Promise<ResponseDto<GeoData>> {
    return this.pointService.update(id, createPointDto);
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
  async delete(@Param('id') id: string): Promise<ResponseDto<GeoData> | null> {
    return this.pointService.delete(id);
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
  async findAll(
    @Query() query: ContourDto,
  ): Promise<Array<ResponseDto<GeoData>>> {
    if (query.contour) {
      return this.pointService.contours(query.contour);
    } else {
      return this.pointService.findAll();
    }
  }
}
