import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReadingMaterialDto } from './dto/create-reading-material.dto';
import { Kysely, sql } from 'kysely';
import { DB } from '@/database/db';
import { GenresService } from '../genres/genres.service';
import { ReadabilityService } from './readibility.service';
import { ReadingMaterial } from '@/database/schemas';
import { ReadingMaterialWithGenres } from './reading-materials.controller';
import { rmSync } from 'fs';

@Injectable()
export class ReadingMaterialsService {
  constructor(
    @Inject('DATABASE') private readonly db: Kysely<DB>,
    private genreService: GenresService,
    private readabilityService: ReadabilityService,
  ) {}

  async create(
    createReadingMaterialDto: CreateReadingMaterialDto,
  ): Promise<ReadingMaterialWithGenres> {
    // Insert the reading material into the database
    const readingMaterial = await this.db
      .insertInto('public.reading_materials')
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
      throw new Error('Failed to create reading material');
    }

    // Create genre associations for the reading material
    await this.genreService.createReadingMaterialGenres(
      readingMaterial.id,
      createReadingMaterialDto.genres,
    );

    return { ...readingMaterial, genres: createReadingMaterialDto.genres };
  }

  async findAll(): Promise<ReadingMaterialWithGenres[]> {
    //   return `This action returns all readingMaterials`;
    // Fetch all reading materials from the database
    const readingMaterials = await this.db
      .selectFrom('public.reading_materials as rm')
      .selectAll()
      .execute();

    // Fetch associated genres for each reading material
    const readingMaterialsWithGenres = await Promise.all(
      readingMaterials.map(async material => {
        const genres = await this.db
          .selectFrom('public.reading_material_genres as rmg')
          .innerJoin('public.genres as g', 'g.id', 'rmg.genre_id')
          .where('rmg.reading_material_id', '=', material.id)
          .select(['g.name'])
          .execute();

        return {
          ...material,
          genres: genres.map(genre => genre.name),
        };
      }),
    );

    return readingMaterialsWithGenres;
  }

  async findOne(id: string): Promise<ReadingMaterialWithGenres> {
    //   return `This action returns a #${id} readingMaterial`;
    // Fetch a specific reading material by ID
    const readingMaterial = await this.db
      .selectFrom('public.reading_materials as rm')
      .where('rm.id', '=', id)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Reading material with ID ${id} not found`),
      );

    // Fetch associated genres for the reading material
    const genres = await this.db
      .selectFrom('public.reading_material_genres as rmg')
      .innerJoin('public.genres as g', 'g.id', 'rmg.genre_id')
      .where('rmg.reading_material_id', '=', id)
      .select(['g.name'])
      .execute();

    return { ...readingMaterial, genres: genres.map(genre => genre.name) };
  }

  async getRecommendedReadingMaterials(
    userId: string,
  ): Promise<ReadingMaterialWithGenres[]> {
    const pupil = await this.db
      .selectFrom('public.pupils')
      .where('id', '=', userId)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Pupil ${userId} not found`),
      );

    // step 1: get completed sessions and include readingmaterial + genres
    const completedSessions = await this.db
      .selectFrom('public.reading_sessions as rs')
      .innerJoin(
        'public.reading_materials as rm',
        'rm.id',
        'rs.reading_material_id',
      )
      .leftJoin(
        'public.reading_material_genres as rmg',
        'rmg.reading_material_id',
        'rm.id',
      )
      .leftJoin('public.genres as g', 'g.id', 'rmg.genre_id')
      .where('rs.id', '=', pupil.id)
      .where('rs.completion_percentage', '>=', 80)
      .select([
        'rs.id as session_id',
        'rs.completion_percentage',
        'rm.id as reading_material_id',
        'rm.title',
        'rm.difficulty',
        // combine all genres
        sql<
          string[]
        >`coalesce(json_agg(g.name) filter (where g.name is not null), '[]')`.as(
          'genres',
        ),
        sql<string[]>`coalesce(json_agg(g.id), '[]')`.as('genreIds'),
      ])
      .groupBy(['rs.id', 'rm.id'])
      .execute();

    if (!completedSessions || completedSessions.length === 0) {
      return await this.db
        .selectFrom('public.reading_materials as rm')
        .innerJoin(
          'public.reading_material_genres as rmg',
          'rmg.reading_material_id',
          'rm.id',
        )
        .leftJoin('public.genres as g', 'g.id', 'rmg.genre_id')
        .selectAll('rm')
        .select([sql<string[]>`array_agg(g.name)`.as('genres')])
        .groupBy(['rm.id'])
        .orderBy(sql`RANDOM()`)
        .limit(3)
        .execute();
    }

    // step 2: extract completed materials
    const completedMaterialIds = completedSessions.map(
      rs => rs.reading_material_id,
    );

    const avgDifficulty =
      completedSessions.reduce((sum, c) => sum + c.difficulty, 0) /
      completedSessions.length;

    // Favorite genres (top 3)
    const genreCount: Record<number, number> = {};
    for (const c of completedSessions) {
      for (const g of c.genreIds ?? []) {
        genreCount[g] = (genreCount[g] ?? 0) + 1;
      }
    }
    const favoriteGenreIds = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);

    // Step 3: Recommend similar materials
    const recommended = await this.db
      .selectFrom('public.reading_materials as rm')
      .innerJoin(
        'public.reading_material_genres as rmg',
        'rmg.reading_material_id',
        'rm.id',
      )
      .leftJoin('public.genres as g', 'g.id', 'rmg.genre_id')
      .where('rm.id', 'not in', completedMaterialIds)
      .where(sql<boolean>`abs(rm.difficulty - ${avgDifficulty}) <= 10`)
      .groupBy('rm.id')
      .selectAll('rm')
      .select([sql<string[]>`array_agg(g.name)`.as('genres')])
      .limit(3)
      .execute();

    return recommended;
  }
}
