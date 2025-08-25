import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./app/auth/auth.module";
import { ClassroomsModule } from "./app/classrooms/classrooms.module";
import { MinigamesModule } from "./app/minigames/minigames.module";
import { PupilsModule } from "./app/pupils/pupils.module";
import configuration from "./configuration/configuration";
import { DatabaseModule } from "./database/database.module";
import { ReadingMaterialsModule } from './app/reading-materials/reading-materials.module';
import { GenresModule } from './app/genres/genres.module';

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
    MinigamesModule,
    ReadingMaterialsModule,
    GenresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
