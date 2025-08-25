import { DB } from "@/database/db";
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import CompleteData from "../data/all_complete_data.json";
import { ReadabilityService } from "@/app/reading-materials/readibility.service";
// ig wala pay reading materials
@Injectable()
export class SeedService {
  constructor(
    @Inject("DATABASE") private readonly db: Kysely<DB>,
    private readabilityService: ReadabilityService,
  ) {}

  async run() {
    for (const material of CompleteData) {
      await this.db
        .insertInto("public.reading_materials")
        .values({
          author: material.author,
          title: material.title,
          description: material.description,
          grade_level: material.grade_level,
          difficulty: this.readabilityService.calculateFleschScore(
            material.passage,
          ),
          cover: material.cover,
          content: material.passage,
          is_deped: true,
          created_at: new Date(),
        })
        .execute();
    }
  }
}
