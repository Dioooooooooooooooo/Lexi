import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReadingMaterialsService } from './reading-materials.service';
import { CreateReadingMaterialDto } from './dto/create-reading-material.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponseDto } from '@/common/dto';
import { ReadingMaterial } from '@/database/schemas';
import { RolesGuard } from '../auth/role-guard';
import { Roles } from '@/decorators/roles.decorator';
import { UserResponseDto } from '../auth/dto/auth.dto';
import { PupilsService } from '../pupils/pupils.service';

export type ReadingMaterialWithGenres = ReadingMaterial & { genres: string[] };

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@Controller('reading-materials')
export class ReadingMaterialsController {
  constructor(
    private readonly readingMaterialsService: ReadingMaterialsService,
    private readonly pupilService: PupilsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a reading material',
  })
  @ApiResponse({
    status: 201,
    description: 'Reading material created successfully',
    type: SuccessResponseDto<ReadingMaterial>,
  })
  async create(
    @Body() createReadingMaterialDto: CreateReadingMaterialDto,
  ): Promise<SuccessResponseDto<ReadingMaterial>> {
    const result = await this.readingMaterialsService.create(
      createReadingMaterialDto,
    );
    return {
      message: 'Reading material successfully created',
      data: result,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all reading materials',
  })
  @ApiResponse({
    status: 200,
    description: 'Reading materials fetched successfully',
    type: SuccessResponseDto<ReadingMaterialWithGenres[]>,
  })
  async findAll(): Promise<SuccessResponseDto<ReadingMaterialWithGenres[]>> {
    const readingMaterials = await this.readingMaterialsService.findAll();
    return {
      message: 'Reading materials successfully fetched',
      data: readingMaterials,
    };
  }

  @Get('recommendations')
  @UseGuards(RolesGuard)
  @Roles(['Pupil'])
  @ApiOperation({
    summary: 'Get recommended reading materials for the pupil',
  })
  @ApiResponse({
    status: 200,
    description: 'Recommended reading materials fetched successfully',
    type: SuccessResponseDto<ReadingMaterialWithGenres[]>,
  })
  async findRecommendations(
    @Request() req: { user: UserResponseDto },
  ): Promise<SuccessResponseDto<ReadingMaterialWithGenres[]>> {
    const recommendedMaterials =
      await this.readingMaterialsService.getRecommendedReadingMaterials(
        req.user.id,
      );
    return {
      message: 'Recommended reading materials successfully fetched',
      data: recommendedMaterials,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a reading material by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Reading material fetched successfully',
    type: SuccessResponseDto<ReadingMaterialWithGenres>,
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<ReadingMaterialWithGenres>> {
    const readingMaterial = await this.readingMaterialsService.findOne(id);
    return {
      message: 'Reading material successfully fetched',
      data: readingMaterial,
    };
  }
}
