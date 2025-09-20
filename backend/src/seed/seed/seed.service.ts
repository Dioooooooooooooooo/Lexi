import { WordsFromLettersGame } from '@/app/minigames/entities/minigame.entity';
import { ReadabilityService } from '@/app/reading-materials/readibility.service';
import { DB } from '@/database/db';
import { MinigameType } from '@/database/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import Achievements from '../data/achievements.json';
import CompleteData from '../data/all_complete_data.json';

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
        .selectFrom('public.genres')
        .select(['id', 'name'])
        .where('name', '=', gen)
        .executeTakeFirst();

      // If existing, use returned id; otherwise, create  new genre
      if (genre) {
        genreIdMap.set(genre.name, genre.id);
      } else {
        const existing = await this.db
          .insertInto('public.genres')
          .values({ name: gen, created_at: new Date() })
          .returning(['id', 'name'])
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

      const wordsFromLetters = this.CreateMinigamesList(
        material.minigames.WordsFromLetters,
        MinigameType.WordsFromLetters,
        readingMatId,
      );

      let sentenceRearrangement = [];
      if (material.minigames.SentenceRearrangement) {
        sentenceRearrangement = this.CreateMinigamesList(
          material.minigames.SentenceRearrangement,
          MinigameType.SentenceRearrangement,
          readingMatId,
        );
      }

      let choices = [];
      if (material.minigames.Choices) {
        choices = this.CreateMinigamesList(
          material.minigames.Choices,
          MinigameType.Choices,
          readingMatId,
        );
      }

      const mgcount = await this.db
        .insertInto('public.minigames')
        .values([...wordsFromLetters, ...sentenceRearrangement, ...choices])
        .returning('id')
        .execute();

      console.log(
        `Successfully created RM: ${material.title} with minigames: ${mgcount.length}`,
      );
    }
    console.log('Reading Materials Seeding Finished');
  }

  CreateMinigamesList(
    items: object[],
    minigameType: MinigameType,
    readingMaterialID: string,
  ) {
    const maxScores = this.getMaxScore(minigameType, items);
    return items.map((minigame, index) => {
      const { part_num, ...rest } = minigame as any;

      return {
        reading_material_id: readingMaterialID,
        minigame_type: minigameType,
        part_num: part_num,
        max_score: maxScores[index],
        metadata: JSON.stringify(rest),
      };
    });
  }

  getMaxScore(minigameType: MinigameType, items: object[]): number[] {
    const maxScores = [];

    items.forEach(minigame => {
      let score = 0;
      switch (minigameType) {
        case MinigameType.Choices:
        case MinigameType.SentenceRearrangement:
          score = 1;
          break;
        case MinigameType.WordsFromLetters:
          const wfl = minigame as WordsFromLettersGame;
          score = wfl.words.length;
          break;
      }
      maxScores.push(score);
    });

    return maxScores;
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
