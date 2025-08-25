import { Module } from '@nestjs/common';
import { SeedService } from './seed/seed.service';

@Module({
  providers: [SeedService]
})
export class SeedModule {}
