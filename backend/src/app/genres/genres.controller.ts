import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from '@/database/schemas';
import { SuccessResponseDto } from '@/common/dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller("genres")
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Genre',
  })
  @ApiResponse({
    status: 201,
    description: 'Genre created successfully',
    type: SuccessResponseDto,
  })
  create(@Body() createGenreDto: CreateGenreDto): Promise<SuccessResponseDto<Genre>> {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all Genres',
  })
  @ApiResponse({
    status: 200,
    description: 'Genres fetched successfully',
    type: SuccessResponseDto,
  })
  findAll(): Promise<SuccessResponseDto<Genre[]>> {
    return this.genresService.findAll();
  }
}
