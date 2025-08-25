import { Module } from '@nestjs/common';
import { ReadingMaterialsService } from './reading-materials.service';
import { ReadingMaterialsController } from './reading-materials.controller';
import { GenresService } from '../genres/genres.service';
import { ReadabilityService } from './readibility.service';

@Module({
  controllers: [ReadingMaterialsController],
  providers: [ReadingMaterialsService, ReadabilityService, GenresService],
})
export class ReadingMaterialsModule {}
