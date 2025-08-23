import { Test, TestingModule } from '@nestjs/testing';
import { ReadingSessionsController } from './reading-sessions.controller';
import { ReadingSessionsService } from './reading-sessions.service';

describe('ReadingSessionsController', () => {
  let controller: ReadingSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingSessionsController],
      providers: [ReadingSessionsService],
    }).compile();

    controller = module.get<ReadingSessionsController>(ReadingSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
