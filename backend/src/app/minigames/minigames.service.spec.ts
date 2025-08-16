import { Test, TestingModule } from '@nestjs/testing';
import { MinigamesService } from './minigames.service';

describe('MinigamesService', () => {
  let service: MinigamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinigamesService],
    }).compile();

    service = module.get<MinigamesService>(MinigamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
