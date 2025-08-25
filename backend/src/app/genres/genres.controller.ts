import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from '@/database/schemas';
import { SuccessResponseDto } from '@/common/dto';

@Controller("genres")
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  create(@Body() createGenreDto: CreateGenreDto): Promise<SuccessResponseDto<Genre>> {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  findAll(): Promise<SuccessResponseDto<Genre[]>> {
    return this.genresService.findAll();
  }
}
