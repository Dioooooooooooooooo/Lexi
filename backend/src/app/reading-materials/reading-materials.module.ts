import { Module } from '@nestjs/common';
import { ReadingMaterialsService } from './reading-materials.service';
import { ReadingMaterialsController } from './reading-materials.controller';

@Module({
  controllers: [ReadingMaterialsController],
  providers: [ReadingMaterialsService],
})
export class ReadingMaterialsModule {}
