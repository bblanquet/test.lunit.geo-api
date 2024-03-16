import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { ContoursService } from './contours.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeoData } from '../../common/model/geoData';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { GeoType } from 'src/common/model/geoType';
import { CreateContourDto } from './dtos/create-contours.dto';
import { ObjectIdDto } from 'src/common/dtos/objectId.dto';

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
  findOne(@Param() params: ObjectIdDto): Promise<ResponseDto<GeoData> | null> {
    return this.contoursService.findOne(params.id);
  }

  @Post()
  @ApiBody({
    type: CreateContourDto,
    examples: {
      a: {
        value: {
          type: GeoType[GeoType.Polygon],
          coordinates: [
            [1, 1],
            [1, 1],
          ],
        } as CreateContourDto,
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
    @Body() createContourDto: CreateContourDto,
  ): Promise<ResponseDto<GeoData>> {
    return await this.contoursService.create(createContourDto);
  }

  @Patch(':id')
  @ApiBody({
    type: CreateContourDto,
    examples: {
      a: {
        value: {
          type: GeoType[GeoType.Polygon],
          coordinates: [
            [1, 1],
            [1, 1],
          ],
        } as CreateContourDto,
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
    @Param() params: ObjectIdDto,
    @Body() createPointDto: CreateContourDto,
  ): Promise<ResponseDto<GeoData>> {
    return this.contoursService.update(params.id, createPointDto);
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
  async delete(
    @Param() params: ObjectIdDto,
  ): Promise<ResponseDto<GeoData> | null> {
    return this.contoursService.delete(params.id);
  }
}
