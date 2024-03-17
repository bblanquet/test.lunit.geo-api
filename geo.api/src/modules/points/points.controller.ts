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
import { OptionalContourDto } from './dtos/optionalcontour.dto';
import { DataDto } from 'src/common/dtos/data.dto';

@ApiTags('Points')
@Controller('Points')
export class PointsController {
  constructor(private readonly pointService: PointsService) {}

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
    @Query() query: OptionalContourDto,
  ): Promise<Array<ResponseDto<GeoData>>> {
    if (query.contour) {
      return this.pointService.findContained(query.contour);
    } else {
      return this.pointService.findAll();
    }
  }

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
    type: DataDto<CreatePointDto>,
    examples: {
      a: {
        value: {
          data: {
            type: GeoType[GeoType.Point],
            coordinates: [1, 1],
          },
        } as DataDto<CreatePointDto>,
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
    @Body() createPointDto: DataDto<CreatePointDto>,
  ): Promise<ResponseDto<GeoData>> {
    return this.pointService.update(id, createPointDto.data);
  }

  @Post()
  @ApiBody({
    type: DataDto<CreatePointDto>,
    examples: {
      a: {
        value: {
          data: {
            type: GeoType[GeoType.Point],
            coordinates: [1, 1],
          } as CreatePointDto,
        },
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
      } as DataDto<CreatePointDto>,
    },
  })
  async create(
    @Body() createPointDto: DataDto<CreatePointDto>,
  ): Promise<ResponseDto<GeoData>> {
    return this.pointService.create(createPointDto.data);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
      },
    },
  })
  async delete(@Param('id') id: string): Promise<ResponseDto<null> | null> {
    return this.pointService.delete(id);
  }
}
