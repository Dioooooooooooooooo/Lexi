import { Test, TestingModule } from '@nestjs/testing';
import { MinigamesController } from './minigames.controller';
import { MinigamesService } from './minigames.service';

describe('MinigamesController', () => {
  let controller: MinigamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinigamesController],
      providers: [MinigamesService],
    }).compile();

    controller = module.get<MinigamesController>(MinigamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
