import { Test, TestingModule } from '@nestjs/testing';
import { ReadingMaterialsService } from './reading-materials.service';

describe('ReadingMaterialsService', () => {
  let service: ReadingMaterialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadingMaterialsService],
    }).compile();

    service = module.get<ReadingMaterialsService>(ReadingMaterialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
