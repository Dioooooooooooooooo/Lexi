import { Module } from "@nestjs/common";
import { SeedService } from "./seed/seed.service";
import { ReadingMaterialsModule } from "@/app/reading-materials/reading-materials.module";

@Module({
  providers: [SeedService],
  imports: [ReadingMaterialsModule],
})
export class SeedModule {}
