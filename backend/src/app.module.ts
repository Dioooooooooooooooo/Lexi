import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { DictionaryModule } from './app/dictionary/dictionary.module';
import { ImagekitModule } from './app/imagekit/imagekit.module';
import { MulterModule } from '@nestjs/platform-express';
import { LibraryEntriesModule } from './app/library-entries/library-entries.module';
import multer from 'multer';

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

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            createKeyv(config.get<string>('REDIS_URI')),
          ],
        };
      },
    }),

    MulterModule.register({
      storage: multer.memoryStorage(),
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
    DictionaryModule,
    ImagekitModule,
    LibraryModule,
    LibraryEntriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
