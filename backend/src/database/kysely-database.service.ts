import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { DB } from "./db";

@Injectable()
export class DatabaseService {
  constructor(@Inject("DATABASE") private readonly db: Kysely<DB>) {}

  get database() {
    return this.db;
  }

  async testConnection() {
    try {
      await this.db.selectFrom("auth.users").select("id").limit(1).execute();
      return { status: "connected", message: "Database connection successful" };
    } catch (error) {
      console.error("Database connection error:", error);
      return { status: "error", message: "Database connection failed" };
    }
  }
}
