import { DB } from "@/database/db";
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import CompleteData from "../data/all_complete_data.json";

// ig wala pay reading materials
@Injectable()
export class SeedService {
  constructor(@Inject("DATABASE") private readonly db: Kysely<DB>) {}

  async run() {
    for (const material of CompleteData) {
      await this.db
        .insertInto("public.reading_materials")
        .values({ ...material })
        .execute();
    }
  }
}
