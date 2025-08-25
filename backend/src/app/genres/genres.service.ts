import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { Kysely } from "kysely";
import { DB } from "@/database/db";

@Injectable()
export class GenresService {
  constructor(@Inject("DATABASE") private readonly db: Kysely<DB>) {}

  async create(createGenreDto: CreateGenreDto) {
    // Insert the genre into the database
    const genre = await this.db
      .insertInto("public.genres")
      .values({
        name: createGenreDto.name,
      })
      .returningAll()
      .executeTakeFirst();

    if (!genre) {
      throw new Error("Failed to create genre");
    }

    return {
      message: "Genre successfully created",
      data: genre,
    };
  }

  async findAll() {
    // Fetch all genres from the database
    const genres = await this.db
      .selectFrom("public.genres as g")
      .selectAll()
      .execute();

    if (genres.length === 0) {
      throw new NotFoundException("No genres found");
    }

    return {
      message: "Genres successfully fetched",
      data: genres,
    };
  }

  async createReadingMaterialGenres(
    readingMaterialId: string,
    genreNames: string[],
  ) {
    // Fetch genre IDs based on the provided names
    const genreIds = await this.db
      .selectFrom("public.genres as g")
      .where("g.name", "in", genreNames)
      .select("g.id")
      .execute()
      .then(genres => genres.map(genre => genre.id));

    // Insert multiple genre associations for a reading material
    return await this.db
      .insertInto("public.reading_material_genres")
      .values(
        genreIds.map(genreId => ({
          reading_material_id: readingMaterialId,
          genre_id: genreId,
        })),
      )
      .execute();
  }
}
