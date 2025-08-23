import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReadingMaterialsService } from './reading-materials.service';
import { CreateReadingMaterialDto } from './dto/create-reading-material.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SuccessResponseDto } from '@/common/dto';
import { ReadingMaterial } from '@/database/schemas';
import { RolesGuard } from '../auth/role-guard';
import { Roles } from '@/decorators/roles.decorator';
import { UserResponseDto } from '../auth/dto/auth.dto';

@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth("JWT-auth")
@Controller("reading-materials")
export class ReadingMaterialsController {
  constructor(
    private readonly readingMaterialsService: ReadingMaterialsService,
  ) {}

  @Post()
  create(
    @Body() createReadingMaterialDto: CreateReadingMaterialDto,
  ): Promise<SuccessResponseDto<ReadingMaterial>> {
    return this.readingMaterialsService.create(createReadingMaterialDto);
  }

  @Get()
  findAll(): Promise<SuccessResponseDto<ReadingMaterial[]>> {
    return this.readingMaterialsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<SuccessResponseDto<ReadingMaterial>> {
    return this.readingMaterialsService.findOne(id);
  }

  @Get("recommendations")
  @UseGuards(RolesGuard)
  @Roles(["Pupil"])
  findRecommendations(
    @Request() req: { user: UserResponseDto },
  ): Promise<SuccessResponseDto<ReadingMaterial[]>> {
    return this.readingMaterialsService.getRecommendedReadingMaterials(
      req.user.id,
    );
  }
}
