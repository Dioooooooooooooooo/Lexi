import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AchievementsModule } from './app/achievements/achievements.module';
import { ActivityLogsModule } from './app/activity-logs/activity-logs.module';
import { ActivityModule } from './app/activity/activity.module';
import { AuthModule } from './app/auth/auth.module';
import { ClassroomsModule } from './app/classrooms/classrooms.module';
import { EmailModule } from './app/email/email.module';
import { GenresModule } from './app/genres/genres.module';
import { MinigamesModule } from './app/minigames/minigames.module';
import { PupilsModule } from './app/pupils/pupils.module';
import { ReadingMaterialsModule } from './app/reading-materials/reading-materials.module';
import { ReadingSessionsModule } from './app/reading-sessions/reading-sessions.module';
import { UserModule } from './app/user/user.module';
import configuration from './configuration/configuration';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './seed/seed.module';

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
    AchievementsModule,
    SeedModule,
    ActivityModule,
    UserModule,
    ActivityLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
