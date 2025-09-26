import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LibraryEntriesService } from './library-entries.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from '../auth/dto/auth.dto';
import { SuccessResponseDto } from '@/common/dto';
import { LibraryEntries } from '@/database/db';

@Controller('library-entries')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class LibraryEntriesController {
  constructor(private readonly libraryEntriesService: LibraryEntriesService) {}

  @Post('reading-materials/:readingMaterialId')
  @ApiOperation({ summary: 'This adds a reading material to the library' })
  @ApiResponse({
    status: 201,
    description: 'Reading material successsfully added to library.',
    type: SuccessResponseDto,
  })
  async create(@Param('readingMaterialId') readingMaterialId: string) {
    const entry = await this.libraryEntriesService.create(readingMaterialId);
    return {
      message: 'Reading material successsfully added to library.',
      data: entry,
    };
  }

  @Get()
  @ApiOperation({ summary: 'This will get all reading materials in library.' })
  @ApiResponse({
    status: 200,
    description: 'Reading materials in library successfully fetched.',
    type: SuccessResponseDto,
  })
  async findAll() {
    const entries = await this.libraryEntriesService.findAll();
    return {
      message: 'Successfully fetched reading materials from library.',
      data: entries,
    };
  }

  @Delete(':readingMaterialId')
  @ApiOperation({ summary: 'Remove reading material from library.' })
  @ApiResponse({
    status: 200,
    description: 'Successfully removed reading material from library.',
    type: SuccessResponseDto,
  })
  async remove(@Param('readingMaterialId') readingMaterialId: string) {
    await this.libraryEntriesService.remove(readingMaterialId);
    return { message: 'Successfully removed reading material from library.' };
  }
}
