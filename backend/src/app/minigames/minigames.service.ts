import {
  ClassSerializerInterceptor,
  Inject,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';

import { Kysely, sql } from 'kysely';
import {
  Minigame,
  MinigameLog,
  MinigameType,
  ReadingSession,
} from '../../database/schemas/public.schema';
import { CreateMinigameLogDto } from './dto/create-minigame-log.dto';
import { DB } from '../../database/db.d';
import { CompleteReadingSessionDto } from './dto/complete-reading-session.dto';
import { AchievementsService } from '../achievements/achievements.service';
import { ReadingMaterialsService } from '../reading-materials/reading-materials.service';
import {
  CreateMinigameDto,
  CreateWordsFromLettersGame,
} from './dto/create-minigame.dto';
import { instanceToPlain } from 'class-transformer';
import { UpdateMinigameLogDto } from './dto/update-minigame-log.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Injectable()
export class MinigamesService {
  constructor(
    @Inject('DATABASE') private readonly db: Kysely<DB>,
    private readonly achievementService: AchievementsService,
    private readonly readingMaterialService: ReadingMaterialsService,
  ) {}

  async getAssignedMinigamesBySessionID(
    readingSessionId: string,
  ): Promise<Minigame[]> {
    return await this.db
      .selectFrom('public.minigames as m')
      .leftJoin('public.minigame_logs as ml', 'ml.minigame_id', 'm.id')
      .leftJoin(
        'public.reading_sessions as rs',
        'rs.id',
        'ml.reading_session_id',
      )
      .where('rs.id', '=', readingSessionId)
      .selectAll('m')
      .orderBy('m.part_num')
      .execute();
  }

  async createMinigame(
    minigameType: MinigameType,
    request: CreateMinigameDto,
  ): Promise<Minigame> {
    const metaDataObj = instanceToPlain(request);
    const metaData = JSON.stringify(metaDataObj, null, 2);

    const maxScore = this.getMaxScore(minigameType, request);

    const minigame = await this.db
      .insertInto('public.minigames')
      .values({
        reading_material_id: request.reading_material_id,
        minigame_type: minigameType,
        part_num: request.part_num,
        max_score: maxScore,
        metadata: metaData,
      })
      .returningAll()
      .executeTakeFirst();

    if (!minigame) {
      throw new Error('Error creating minigame.');
    }

    return minigame;
  }

  getMaxScore(minigameType: MinigameType, request: CreateMinigameDto): number {
    switch (minigameType) {
      case MinigameType.Choices:
      case MinigameType.SentenceRearrangement:
        return 1;

      case MinigameType.WordsFromLetters:
        const wordRequest = request as CreateWordsFromLettersGame;
        return wordRequest.words.length;
    }
  }

  async createMinigamesCompletion(
    readingSessionID: string,
    userId: string,
  ): Promise<CompleteReadingSessionDto> {
    const readingSession = await this.db
      .selectFrom('public.reading_sessions as rs')
      .innerJoin(
        'public.reading_materials as rm',
        'rm.id',
        'rs.reading_material_id',
      )
      .where('rs.id', '=', readingSessionID)
      .select(['rs.pupil_id', 'rs.reading_material_id', 'rm.difficulty'])
      .executeTakeFirstOrThrow(
        () => new NotFoundException('Reading session not found'),
      );

    const logs = await this.db
      .selectFrom('public.minigame_logs as ml')
      .innerJoin('public.minigames as m', 'm.id', 'ml.minigame_id')
      .where('reading_session_id', '=', readingSessionID)
      .select(['ml.result', 'm.max_score'])
      .execute();

    if (logs.length === 0) {
      throw new NotFoundException(
        'No minigame logs found for this reading session',
      );
    }

    let totalScore = 0;
    let maxScore = 0;

    logs.forEach(log => {
      // log.result can be a JSON string or a number depending on source
      let score = 0;
      if (typeof log.result === 'string') {
        try {
          const parsed = JSON.parse(log.result);
          score = typeof parsed === 'number' ? parsed : (parsed?.score ?? 0);
        } catch {
          score = Number(log.result) || 0;
        }
      } else if (typeof log.result === 'number') {
        score = log.result;
      }

      totalScore += score || 0;
      maxScore += (log.max_score as number) || 0;
    });

    let scorePercent = totalScore / maxScore;

    let minigamePerformanceMultiplier = 0;
    if (scorePercent == 1) minigamePerformanceMultiplier = 1.5;
    else if (scorePercent >= 0.8) minigamePerformanceMultiplier = 1.25;
    else if (scorePercent >= 0.6) minigamePerformanceMultiplier = 1;
    else if (scorePercent < 0.4) minigamePerformanceMultiplier = 0.75;
    else if (scorePercent < 0.2) minigamePerformanceMultiplier = 0.5;
    else if (scorePercent < 0.05) minigamePerformanceMultiplier = 0.25;
    else if (scorePercent >= 0) minigamePerformanceMultiplier = 0.1;

    let basePoints = 0;
    if (readingSession.difficulty >= 90) basePoints = 10;
    else if (readingSession.difficulty >= 80) basePoints = 15;
    else if (readingSession.difficulty >= 70) basePoints = 20;
    else if (readingSession.difficulty >= 60) basePoints = 30;
    else if (readingSession.difficulty >= 50) basePoints = 45;
    else if (readingSession.difficulty >= 30) basePoints = 60;
    else if (readingSession.difficulty >= 10) basePoints = 80;
    else if (readingSession.difficulty >= 0) basePoints = 100;

    const readingSessions = await this.db
      .selectFrom('public.reading_sessions')
      .where('reading_material_id', '=', readingSession.reading_material_id)
      .select(eb => eb.fn.count('id').as('count'))
      .executeTakeFirst();

    const readingSessionsCount = readingSessions.count as number;
    let numSessionsMultiplier = 0;
    if (readingSessionsCount > 4) numSessionsMultiplier = 0.1;
    else if (readingSessionsCount == 3) numSessionsMultiplier = 0.25;
    else if (readingSessionsCount == 2) numSessionsMultiplier = 0.5;
    else if (readingSessionsCount == 1) numSessionsMultiplier = 1;

    const finalScore =
      basePoints * numSessionsMultiplier +
      totalScore * minigamePerformanceMultiplier;

    const updatedPupil = await this.db
      .updateTable('public.pupils')
      .set({
        level: sql`level + ${Math.floor(finalScore)}`,
      })
      .where('id', '=', readingSession.pupil_id)
      .returning(['level'])
      .executeTakeFirst();

    // add for achievements n recommendations
    const newAchievements =
      await this.achievementService.addBooksReadAchievement(
        readingSession.pupil_id,
      );
    const newRecommendations =
      await this.readingMaterialService.getRecommendedReadingMaterials(userId);

    return {
      achievements: newAchievements,
      recommendations: newRecommendations,
      level: updatedPupil.level,
    };
  }

  async getRandomMinigamesBySessionID(
    readingSessionID: string,
  ): Promise<Minigame[]> {
    // Fetch reading material ID based on the reading session ID and return error if not found
    const readingSession = await this.db
      .selectFrom('public.reading_sessions')
      .selectAll()
      .where('id', '=', readingSessionID)
      .executeTakeFirstOrThrow(
        () => new NotFoundException('Reading session not found'),
      );

    // Extract reading material ID from the result
    const { reading_material_id: readingMaterialID } = readingSession;

    // Fetch distinct minigames based on part_num, ordered randomly
    let randomMinigames = await this.db
      .selectFrom('public.minigames as m')
      .where('m.reading_material_id', '=', readingMaterialID)
      .selectAll('m')
      .orderBy(sql`random()`)
      .execute();

    randomMinigames = this.pickMinigamesNoConsecutiveSameType(randomMinigames);

    await this.createMinigameLogs(randomMinigames, readingSession);

    return randomMinigames;
  }

  async getRandomMinigamesByMaterialID(
    readingMaterialID: string,
  ): Promise<Minigame[]> {
    // Fetch distinct minigames based on part_num, ordered randomly
    let randomMinigames = await this.db
      .selectFrom('public.minigames as m')
      .where('m.reading_material_id', '=', readingMaterialID)
      .selectAll('m')
      .orderBy('m.part_num')
      .execute();

    randomMinigames = this.pickMinigamesNoConsecutiveSameType(randomMinigames);

    return randomMinigames;
  }

  async createMinigameLogs(
    minigames: Minigame[],
    readingSession: ReadingSession,
  ) {
    let minigameLogs = [];
    for (const m of minigames) {
      minigameLogs.push({
        pupil_id: readingSession.pupil_id,
        reading_session_id: readingSession.id,
        minigame_id: m.id,
      });
    }

    minigameLogs = await this.db
      .insertInto('public.minigame_logs')
      .values(minigameLogs)
      .returningAll()
      .execute();

    return minigameLogs;
  }

  pickMinigamesNoConsecutiveSameType(allMinigames: Minigame[]): Minigame[] {
    // group by part_num
    const grouped: Record<number, Minigame[]> = {};
    for (const m of allMinigames) {
      if (!grouped[m.part_num]) grouped[m.part_num] = [];
      grouped[m.part_num].push(m);
    }

    const result: Minigame[] = [];
    let prevType: number | null;

    const partNums = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);

    for (const part of partNums) {
      const options = grouped[part];

      // Filter out same-type as previous part
      let candidates = options.filter(o => o.minigame_type !== prevType);

      // If no candidates left, fallback to full set
      if (candidates.length === 0) {
        candidates = options;
      }

      // Random pick
      const choice = candidates[Math.floor(Math.random() * candidates.length)];
      result.push(choice);

      // Update prevType
      prevType = choice.minigame_type;
    }

    return result;
  }

  async getWordsFromLettersMinigame(
    readingMaterialID: string,
  ): Promise<Minigame> {
    // Fetch WordsFromLetters minigame for the specific reading material
    return await this.db
      .selectFrom('public.minigames as m')
      .where('reading_material_id', '=', readingMaterialID)
      .where('minigame_type', '=', 2) // 2 is the enum value for WordsFromLetters
      .selectAll('m')
      .executeTakeFirstOrThrow(
        () => new NotFoundException('WordsFromLetters minigame not found'),
      );
  }

  async createMinigameLog(
    minigameType: MinigameType,
    minigameLogDto: CreateMinigameLogDto,
  ): Promise<MinigameLog> {
    // Create a new minigame log entry
    return await this.db
      .insertInto('public.minigame_logs')
      .values({
        minigame_id: minigameLogDto.minigame_id,
        pupil_id: minigameLogDto.pupil_id,
        reading_session_id: minigameLogDto.reading_session_id,
        result: minigameLogDto.result,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async updateMinigameLog(
    minigameType: MinigameType,
    minigameLogDto: UpdateMinigameLogDto,
  ): Promise<MinigameLog> {
    let minigamelog = await this.db
      .selectFrom('public.minigame_logs as ml')
      .where('ml.reading_session_id', '=', minigameLogDto.reading_session_id)
      .where('ml.minigame_id', '=', minigameLogDto.minigame_id)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException('Minigame log not found.'),
      );

    minigamelog.result = minigameLogDto.result;

    minigamelog = await this.db
      .updateTable('public.minigame_logs as ml')
      .set(minigamelog)
      .where('ml.reading_session_id', '=', minigameLogDto.reading_session_id)
      .where('ml.minigame_id', '=', minigameLogDto.minigame_id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new Error('Updating minigame log failed.'),
      );

    return minigamelog;
  }

  async getLogsByReadingSessionID(
    readingSessionID: string,
  ): Promise<MinigameLog[]> {
    const logs = await this.db
      .selectFrom('public.minigame_logs')
      .where('reading_session_id', '=', readingSessionID)
      .selectAll()
      .execute();

    return logs;
  }
}
