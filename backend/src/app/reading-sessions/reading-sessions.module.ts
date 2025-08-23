import { Module } from '@nestjs/common';
import { ReadingSessionsService } from './reading-sessions.service';
import { ReadingSessionsController } from './reading-sessions.controller';

@Module({
  controllers: [ReadingSessionsController],
  providers: [ReadingSessionsService],
})
export class ReadingSessionsModule {}
