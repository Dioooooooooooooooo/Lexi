import { Module } from '@nestjs/common';
import { MinigamesService } from './minigames.service';
import { MinigamesController } from './minigames.controller';

@Module({
  controllers: [MinigamesController],
  providers: [MinigamesService],
})
export class MinigamesModule {}
