import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { ResponseDto } from './dto/response.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoordinateValidator } from './common/CoordinateValidator';
import { GeoData } from './common/GeoData';
import { ObjectIdDto } from './dto/objectId.dto';

@ApiTags('Points')
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
            type: 'point',
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
            type: 'point',
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
  update(
    @Param() params: ObjectIdDto,
    @Body() createPointDto: CreatePointDto,
  ): Promise<ResponseDto<GeoData>> {
    if (
      this.coordinateValidator.validate(
        createPointDto.coordinates[0],
        createPointDto.coordinates[1],
      )
    ) {
      return this.pointService.update(params.id, createPointDto);
    } else {
      throw new BadRequestException('', {
        cause: new Error(
          'coordinate[0] should be between -180 and 180\n y should be between -90 and 90',
        ),
        description: 'Bad Request',
      });
    }
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
          type: 'point',
          coordinates: [1, 1],
        },
      },
    },
  })
  async create(
    @Body() createPointDto: CreatePointDto,
  ): Promise<ResponseDto<GeoData>> {
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
  @Delete(':id')
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        data: {
          type: 'point',
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
