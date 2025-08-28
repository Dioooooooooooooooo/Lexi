import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./app/auth/auth.module";
import { ClassroomsModule } from "./app/classrooms/classrooms.module";
import { MinigamesModule } from "./app/minigames/minigames.module";
import { PupilsModule } from "./app/pupils/pupils.module";
import { ReadingSessionsModule } from "./app/reading-sessions/reading-sessions.module";
import configuration from "./configuration/configuration";
import { DatabaseModule } from "./database/database.module";
import { EmailModule } from "./app/email/email.module";
import { ReadingMaterialsModule } from "./app/reading-materials/reading-materials.module";
import { GenresModule } from "./app/genres/genres.module";
import { SeedModule } from "./seed/seed.module";
import { ActivityModule } from './app/activity/activity.module';
import { UserModule } from './app/user/user.module';

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
    EmailModule,
    AuthModule,
    PupilsModule,
    ClassroomsModule,
    MinigamesModule,
    ReadingSessionsModule,
    ReadingMaterialsModule,
    GenresModule,
    SeedModule,
    ActivityModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
