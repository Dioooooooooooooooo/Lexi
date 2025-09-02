import { Module } from "@nestjs/common";
import { MinigamesService } from "./minigames.service";
import { MinigamesController } from "./minigames.controller";
import { AchievementsService } from "../achievements/achievements.service";
import { ReadingMaterialsService } from "../reading-materials/reading-materials.service";
import { GenresService } from "../genres/genres.service";
import { ReadabilityService } from "../reading-materials/readibility.service";

@Module({
  controllers: [MinigamesController],
  providers: [MinigamesService, AchievementsService, ReadingMaterialsService, GenresService, ReadabilityService],
})
export class MinigamesModule {}
