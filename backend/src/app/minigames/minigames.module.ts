import { Module } from '@nestjs/common';
import { MinigamesService } from './minigames.service';
import { MinigamesController } from './minigames.controller';
import { KyselyDatabaseService } from '@/database/kysely-database.service';

@Module({
  controllers: [MinigamesController],
  providers: [MinigamesService, KyselyDatabaseService],
})
export class MinigamesModule {}
