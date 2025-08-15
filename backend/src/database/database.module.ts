import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { KyselyDatabaseService } from "./kysely-database.service";

@Module({
  imports: [ConfigModule],
  providers: [KyselyDatabaseService],
  exports: [KyselyDatabaseService],
})
export class DatabaseModule {}
