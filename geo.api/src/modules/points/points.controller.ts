import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dtos/create-point.dto';
import { ResponseDto } from '../../common/dtos/response.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeoData } from '../../common/model/geoData';
import { ObjectIdDto } from '../../common/dtos/objectId.dto';
import { GeoType } from 'src/common/model/geoType';

@ApiTags('Points')
@Controller('Points')
export class PointsController {
  constructor(private readonly pointService: PointsService) {}

  @Get()
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
  findAll(): Promise<Array<ResponseDto<GeoData>>> {
    return this.pointService.findAll();
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
}
