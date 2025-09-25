import { Injectable } from '@nestjs/common';
import { CreateLibraryEntryDto } from './dto/create-library-entry.dto';
import { UpdateLibraryEntryDto } from './dto/update-library-entry.dto';

@Injectable()
export class LibraryEntriesService {
  async create(userId: string,  readingMaterialId: string) {
    return 'This action adds a new libraryEntry';
  }

  findAll() {
    return `This action returns all libraryEntries`;
  }

  findOne(id: string) {
    return `This action returns a #${id} libraryEntry`;
  }

  update(id: string, updateLibraryEntryDto: UpdateLibraryEntryDto) {
    return `This action updates a #${id} libraryEntry`;
  }

  remove(id: string) {
    return `This action removes a #${id} libraryEntry`;
  }
}
