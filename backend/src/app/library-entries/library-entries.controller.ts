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
import { CreateLibraryEntryDto } from './dto/create-library-entry.dto';
import { UpdateLibraryEntryDto } from './dto/update-library-entry.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from '../auth/dto/auth.dto';

@Controller('library-entries')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class LibraryEntriesController {
  constructor(private readonly libraryEntriesService: LibraryEntriesService) {}

  @Post('reading-materials/:readingMaterialId')
  create(
    @Request() req: { user: UserResponseDto },
    @Param('readingMaterialId') readingMaterialId: string,
  ) {
    return this.libraryEntriesService.create(readingMaterialId);
  }

  @Get()
  findAll() {
    return this.libraryEntriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.libraryEntriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLibraryEntryDto: UpdateLibraryEntryDto,
  ) {
    return this.libraryEntriesService.update(+id, updateLibraryEntryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryEntriesService.remove(+id);
  }
}
