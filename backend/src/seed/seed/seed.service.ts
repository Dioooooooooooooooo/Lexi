import { DB } from '@/database/db';
import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import CompleteData from '../data/all_complete_data.json';
import Achievements from '../data/achievements.json';
import { ReadabilityService } from '@/app/reading-materials/readibility.service';

const Genres = new Set<string>([
  'Adventure',
  'Romance',
  'Drama',
  'Comedy',
  'Fantasy',
  'Horror',
  'Mystery',
  'Science Fiction',
  'History',
  'Coming of Age',
  'Non-Fiction',
  'Fiction',
  'Passage',
  'Animal',
  'Poetry',
  'Educational',
]);

@Injectable()
export class SeedService {
  constructor(
    @Inject('DATABASE') private readonly db: Kysely<DB>,
    private readabilityService: ReadabilityService,
  ) {}

  async run() {
    this.ReadingContentSeed();
    this.AchievementSeed();
  }

  async isTableEmpty(table: any) {
    const exist = await this.db
      .selectFrom(table)
      .select('id')
      .limit(1)
      .executeTakeFirst();

    console.log(table, 'is empty?', !exist);
    return !exist;
  }

  async ReadingContentSeed() {
    const isEmpty = await this.isTableEmpty('public.reading_materials');
    if (!isEmpty) return;

    // Seed genres
    const genreIdMap = new Map<string, string>();
    for (const gen of Genres) {
      const genre = await this.db
        .insertInto('public.genres')
        .values({ name: gen, created_at: new Date() })
        .returning(['id', 'name'])
        .executeTakeFirst();

      // If inserted, use returned id; otherwise, fetch existing id
      if (genre) {
        genreIdMap.set(genre.name, genre.id);
      } else {
        const existing = await this.db
          .selectFrom('public.genres')
          .select(['id', 'name'])
          .where('name', '=', gen)
          .executeTakeFirst();
        if (existing) genreIdMap.set(existing.name, existing.id);
      }
    }
    console.log('Genres Seeding Finished');

    // Seed reading materials and their genres
    for (const material of CompleteData) {
      const readingMat = await this.db
        .insertInto('public.reading_materials')
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
        .returning('id')
        .executeTakeFirstOrThrow();

      const readingMatId = readingMat.id;

      for (const genreName of material.genre) {
        const genreId = genreIdMap.get(genreName);
        if (genreId) {
          await this.db
            .insertInto('public.reading_material_genres')
            .values({ reading_material_id: readingMatId, genre_id: genreId })
            .execute();
        }
      }

      for (const wfl of material.minigames.WordsFromLetters) {
        await this.db.insertInto('public.minigames').values({
          reading_material_id: readingMatId,
        });
      }
    }
    console.log('Reading Materials Seeding Finished');
  }

  async AchievementSeed() {
    const isEmpty = await this.isTableEmpty('public.achievements');
    if (!isEmpty) return;

    for (const achieve of Achievements) {
      await this.db
        .insertInto('public.achievements')
        .values({
          name: achieve.Name,
          description: achieve.Description,
          badge: achieve.Badge,
          created_at: new Date(),
        })
        .execute();
    }
    console.log('Achievements Seeding Finished');
  }
}
