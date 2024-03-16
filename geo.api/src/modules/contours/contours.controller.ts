import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContoursService } from './contours.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeoData } from '../../common/model/geoData';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { GeoType } from 'src/common/model/geoType';
import { CreateContourDto } from './dtos/create-contours.dto';

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
          coordinates: [1, 1],
        },
      },
    },
  })
  async create(
    @Body() createContourDto: CreateContourDto,
  ): Promise<ResponseDto<GeoData>> {
    return await this.contoursService.create(createContourDto);
  }
}
