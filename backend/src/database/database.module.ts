import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DatabaseService } from "./database.service";
import { DB } from "./db";

@Global()
@Module({
  providers: [
    {
      provide: "DATABASE",
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.get<string>("DATABASE_URL");
        const dialect = new PostgresDialect({
          pool: new Pool({
            connectionString,
            ssl: { rejectUnauthorized: false },
          }),
        });
        return new Kysely<DB>({ dialect });
      },
      inject: [ConfigService],
    },
    DatabaseService,
  ],
  exports: ["DATABASE", DatabaseService],
})
export class DatabaseModule {}
