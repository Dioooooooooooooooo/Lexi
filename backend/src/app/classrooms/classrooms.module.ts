import { Module } from "@nestjs/common";
import { ClassroomsService } from "./classrooms.service";
import { ClassroomsController } from "./classrooms.controller";
import { KyselyDatabaseService } from "@/database/kysely-database.service";

@Module({
  controllers: [ClassroomsController],
  providers: [ClassroomsService, KyselyDatabaseService],
})
export class ClassroomsModule { }
