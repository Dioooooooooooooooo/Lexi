import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import {
  AuthProvidersTable,
  AuthEmailVerificationTokensTable,
  AuthLoginLogsTable,
  AuthPasswordResetTokensTable,
  AuthRefreshTokensTable,
  AuthUsersTable,
  AuthUserRolesTable,
  AuthPermissionsTable,
  AuthRolePermissionsTable,
  AuthRolesTable,
  PupilsTable,
  TeachersTable,
  PupilLeaderBoardTable,
  ClassroomsTable,
  ReadingMaterialsTable,
  MinigamesTable,
  ReadingSessionsTable,
  MinigameLogsTable,
} from "./schemas";

interface Database {
  "auth.auth_providers": AuthProvidersTable;
  "auth.email_verification_tokens": AuthEmailVerificationTokensTable;
  "auth.login_logs": AuthLoginLogsTable;
  "auth.password_reset_tokens": AuthPasswordResetTokensTable;
  "auth.permissions": AuthPermissionsTable;
  "auth.refresh_tokens": AuthRefreshTokensTable;
  "auth.role_permissions": AuthRolePermissionsTable;
  "auth.roles": AuthRolesTable;
  "auth.user_roles": AuthUserRolesTable;
  "auth.users": AuthUsersTable;

  "public.pupils": PupilsTable;
  "public.teachers": TeachersTable;
  "public.pupil_leaderboard": PupilLeaderBoardTable;
  "public.classrooms": ClassroomsTable;
  "public.reading_materials": ReadingMaterialsTable;
  "public.reading_sessions": ReadingSessionsTable;
  "public.minigames": MinigamesTable;
  "public.minigame_logs": MinigameLogsTable;
}

@Injectable()
export class KyselyDatabaseService implements OnModuleInit, OnModuleDestroy {
  private db: Kysely<Database>;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const dbConfig = this.configService.get("database");

    const { host, port, user, password, database, ssl } = dbConfig;

    this.db = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          host,
          port,
          user,
          password,
          database,
          ssl,
        }),
      }),
    });
  }

  async onModuleDestroy() {
    await this.db.destroy();
  }

  get database() {
    return this.db;
  }
}
