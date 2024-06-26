import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
} from '@nestjs/common';
import { ContoursService } from './contours.service';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeoData } from '../../common/model/geoData';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { GeoType } from 'src/common/model/geoType';
import { CreateContourDto } from './dtos/create-contours.dto';
import { RequiredContourDto } from 'src/modules/contours/dtos/requiredcontour.dto';
import { DataDto } from 'src/common/dtos/data.dto';

@ApiTags('Contours')
@Controller('Contours')
export class ContoursController {
  constructor(private readonly contoursService: ContoursService) {}

  @Get()
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 1,
          data: {
            type: 'Polygon',
            coordinates: [
              [1, 1],
              [-1, 1],
              [-1, -1],
            ],
          },
        },
      ],
    },
  })
  findAll(): Promise<Array<ResponseDto<GeoData>>> {
    return this.contoursService.findAll();
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 1,
          data: {
            type: GeoType[GeoType.Polygon],
            coordinates: [
              [1, 1],
              [1, 1],
            ],
          },
        },
      ],
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseDto<GeoData> | null> {
    return this.contoursService.findOne(id);
  }

  @Post()
  @ApiBody({
    type: DataDto<CreateContourDto>,
    examples: {
      a: {
        value: {
          data: {
            type: GeoType[GeoType.Polygon],
            coordinates: [
              [25, 25],
              [35, 25],
              [35, 35],
              [25, 35],
              [25, 25],
            ],
          },
        } as DataDto<CreateContourDto>,
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        data: {
          type: GeoType[GeoType.Polygon],
          coordinates: [
            [1, 1],
            [1, 1],
          ],
        },
      },
    },
  })
  async create(
    @Body() createContourDto: DataDto<CreateContourDto>,
  ): Promise<ResponseDto<GeoData>> {
    return await this.contoursService.create(createContourDto.data);
  }

  @Patch(':id')
  @ApiBody({
    type: DataDto<CreateContourDto>,
    examples: {
      a: {
        value: {
          data: {
            type: GeoType[GeoType.Polygon],
            coordinates: [
              [1, 1],
              [1, 1],
            ],
          },
        } as DataDto<CreateContourDto>,
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        data: {
          type: GeoType[GeoType.Polygon],
          coordinates: [
            [1, 1],
            [1, 1],
          ],
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() createPointDto: DataDto<CreateContourDto>,
  ): Promise<ResponseDto<GeoData>> {
    return this.contoursService.update(id, createPointDto.data);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        data: {
          type: GeoType[GeoType.Polygon],
          coordinates: [
            [1, 1],
            [1, 1],
          ],
        },
      },
    },
  })
  async delete(@Param('id') id: string): Promise<ResponseDto<GeoData> | null> {
    return this.contoursService.delete(id);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 1,
          data: {
            type: GeoType[GeoType.Polygon],
            coordinates: [
              [1, 1],
              [1, 1],
            ],
          },
        },
      ],
    },
  })
  @Get(':id/intersections')
  @ApiQuery({ name: 'contour', required: true, type: String })
  async intersection(
    @Param('id') id: string,
    @Query() query: RequiredContourDto,
  ): Promise<Array<ResponseDto<GeoData>>> {
    return this.contoursService.interesect(id, query.contour);
  }
}
