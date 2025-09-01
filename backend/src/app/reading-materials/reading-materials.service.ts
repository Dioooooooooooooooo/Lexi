import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateReadingMaterialDto } from "./dto/create-reading-material.dto";
import { Kysely, sql } from "kysely";
import { DB } from "@/database/db";
import { GenresService } from "../genres/genres.service";
import { ReadabilityService } from "./readibility.service";

@Injectable()
export class ReadingMaterialsService {
  constructor(
    @Inject("DATABASE") private readonly db: Kysely<DB>,
    private genreService: GenresService,
    private readabilityService: ReadabilityService,
  ) {}

  async create(createReadingMaterialDto: CreateReadingMaterialDto) {
    // Insert the reading material into the database
    const readingMaterial = await this.db
      .insertInto("public.reading_materials")
      .values({
        author: createReadingMaterialDto.author,
        title: createReadingMaterialDto.title,
        description: createReadingMaterialDto.description,
        content: createReadingMaterialDto.content,
        difficulty: await this.readabilityService.calculateFleschScore(
          createReadingMaterialDto.content,
        ),
        is_deped: createReadingMaterialDto.is_deped,
        cover: createReadingMaterialDto.cover,
        grade_level: createReadingMaterialDto.grade_level,
      })
      .returningAll()
      .executeTakeFirst();

    if (!readingMaterial) {
      throw new Error("Failed to create reading material");
    }

    // Create genre associations for the reading material
    await this.genreService.createReadingMaterialGenres(
      readingMaterial.id,
      createReadingMaterialDto.genres,
    );

    return {
      message: "Reading material successfully created",
      data: readingMaterial,
    };
  }

  async findAll() {
    //   return `This action returns all readingMaterials`;
    // Fetch all reading materials from the database
    const readingMaterials = await this.db
      .selectFrom("public.reading_materials as rm")
      .selectAll()
      .execute();

    // Fetch associated genres for each reading material
    const readingMaterialsWithGenres = await Promise.all(
      readingMaterials.map(async material => {
        const genres = await this.db
          .selectFrom("public.reading_material_genres as rmg")
          .innerJoin("public.genres as g", "g.id", "rmg.genre_id")
          .where("rmg.reading_material_id", "=", material.id)
          .select(["g.name"])
          .execute();

        return {
          ...material,
          genres: genres.map(genre => genre.name),
        };
      }),
    );

    return {
      message: "Reading materials successfully fetched",
      data: readingMaterialsWithGenres,
    };
  }

  async findOne(id: string) {
    //   return `This action returns a #${id} readingMaterial`;
    // Fetch a specific reading material by ID
    const readingMaterial = await this.db
      .selectFrom("public.reading_materials as rm")
      .where("rm.id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Reading material with ID ${id} not found`),
      );

    // Fetch associated genres for the reading material
    const genres = await this.db
      .selectFrom("public.reading_material_genres as rmg")
      .innerJoin("public.genres as g", "g.id", "rmg.genre_id")
      .where("rmg.reading_material_id", "=", id)
      .select(["g.name"])
      .execute();

    return {
      message: "Reading material successfully fetched",
      data: {
        ...readingMaterial,
        genres: genres.map(genre => genre.name),
      },
    };
  }

  async getRecommendedReadingMaterials(userId: string) {
    const pupil = await this.db
      .selectFrom("public.pupils")
      .where("user_id", "=", userId)
      .selectAll()
      .executeTakeFirstOrThrow(() => new NotFoundException("Pupil not found"));

    // temporary solution to fetch recommended reading materials
    // Fetch recommended reading materials based on pupil's grade level, get 3 random
    const recommendedMaterials = await this.db
      .selectFrom("public.reading_materials as rm")
      .where("rm.grade_level", "=", pupil.grade_level)
      .selectAll()
      .orderBy(sql`random()`)
      .limit(3)
      .execute();

    const materialsWithGenres = await Promise.all(
      recommendedMaterials.map(async material => {
        const genres = await this.db
          .selectFrom("public.reading_material_genres as rmg")
          .innerJoin("public.genres as g", "g.id", "rmg.genre_id")
          .where("rmg.reading_material_id", "=", material.id)
          .select(["g.name"])
          .execute();

        return {
          ...material,
          genres: genres.map(genre => genre.name),
        };
      }),
    );

    return {
      message: "Recommended reading materials successfully fetched",
      data: materialsWithGenres,
    };
  }
}
