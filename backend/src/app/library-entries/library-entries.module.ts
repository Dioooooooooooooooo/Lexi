import { Module } from '@nestjs/common';
import { LibraryEntriesService } from './library-entries.service';
import { LibraryEntriesController } from './library-entries.controller';

@Module({
  controllers: [LibraryEntriesController],
  providers: [LibraryEntriesService],
})
export class LibraryEntriesModule {}
