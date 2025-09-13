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
import { ApiBearerAuth } from '@nestjs/swagger';
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
