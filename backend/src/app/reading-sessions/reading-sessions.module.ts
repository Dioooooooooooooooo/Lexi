import { Module } from '@nestjs/common';
import { ReadingSessionsService } from './reading-sessions.service';
import { ReadingSessionsController } from './reading-sessions.controller';
import { MinigamesService } from '../minigames/minigames.service';
import { AchievementsService } from '../achievements/achievements.service';
import { ReadingMaterialsService } from '../reading-materials/reading-materials.service';
import { GenresService } from '../genres/genres.service';
import { ReadabilityService } from '../reading-materials/readibility.service';

@Module({
  controllers: [ReadingSessionsController],
  providers: [ReadingSessionsService, MinigamesService, AchievementsService, ReadingMaterialsService, GenresService, ReadabilityService],
})
export class ReadingSessionsModule {}
