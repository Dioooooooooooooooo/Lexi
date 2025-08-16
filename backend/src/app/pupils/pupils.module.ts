import { Module } from "@nestjs/common";
import { PupilsService } from "./pupils.service";
import { PupilsController } from "./pupils.controller";
import { KyselyDatabaseService } from "@/database/kysely-database.service";

@Module({
  controllers: [PupilsController],
  providers: [PupilsService, KyselyDatabaseService],
})
export class PupilsModule { }
