import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';
import { DB } from './db';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE',
      useFactory: (configService: ConfigService) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            host: configService.get<string>('DB_HOST'),
            port: parseInt(configService.get<string>('DB_PORT') ?? '5432', 10),
            user: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            ssl: {
              rejectUnauthorized: true,
              ca: configService.get<string>('DB_SSL_CA'),
            },
          }),
        });
        return new Kysely<DB>({ dialect });
      },
      inject: [ConfigService],
    },
    DatabaseService,
  ],
  exports: ['DATABASE', DatabaseService],
})
export class DatabaseModule { }
