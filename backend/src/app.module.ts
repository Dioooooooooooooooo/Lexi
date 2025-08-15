import configuration from "./configuration/configuration";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { PupilsModule } from "./modules/pupils/pupils.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { ClassroomsModule } from "./modules/classrooms/classrooms.module";
import { MinigamesModule } from "./modules/minigames/minigames.module";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuthModule,
    PupilsModule,
    ClassroomsModule,
    MinigamesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
