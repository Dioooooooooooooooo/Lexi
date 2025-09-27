import { Test, TestingModule } from '@nestjs/testing';
import { LibraryEntriesService } from './library-entries.service';

describe('LibraryEntriesService', () => {
  let service: LibraryEntriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibraryEntriesService],
    }).compile();

    service = module.get<LibraryEntriesService>(LibraryEntriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
