import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '../../database/db';
import type {
  Achievement,
  NewAchievement,
  NewPupilAchievement,
  PupilAchievement,
} from '../../database/schemas';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { getCurrentRequest } from '@/common/utils/request-context';

@Injectable()
export class AchievementsService {
  constructor(@Inject('DATABASE') private readonly db: Kysely<DB>) {}

  async create(
    createAchievementDto: CreateAchievementDto,
  ): Promise<Achievement> {
    const newAchievement: NewAchievement = {
      name: createAchievementDto.name,
      description: createAchievementDto.description,
      badge: createAchievementDto.badge || null,
      created_at: new Date(),
    };

    const achievement = await this.db
      .insertInto('public.achievements')
      .values(newAchievement)
      .returningAll()
      .executeTakeFirst();

    return achievement;
  }

  async findAll(): Promise<Achievement[]> {
    return await this.db
      .selectFrom('public.achievements')
      .selectAll()
      .execute();
  }

  async findOne(id: string): Promise<Achievement> {
    return await this.db
      .selectFrom('public.achievements')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Achievement with id ${id} not found`),
      );
  }

  async update(
    id: string,
    updateAchievementDto: UpdateAchievementDto,
  ): Promise<Achievement> {
    const achievement = await this.db
      .updateTable('public.achievements')
      .set(updateAchievementDto)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Achievement with id ${id} not found`),
      );

    return achievement;
  }

  async remove(id: string): Promise<Achievement> {
    const achievement = await this.db
      .deleteFrom('public.achievements')
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Achievement with id ${id} not found`),
      );

    return achievement;
  }

  async getUserAchievements(pupilId: string): Promise<Achievement[]> {
    return await this.db
      .selectFrom('public.pupil_achievements as pa')
      .innerJoin(
        'public.achievements',
        'public.achievements.id',
        'pa.achievement_id',
      )
      .where('pa.pupil_id', '=', pupilId)
      .select([
        'public.achievements.id',
        'public.achievements.name',
        'public.achievements.description',
        'public.achievements.badge',
        'public.achievements.created_at',
      ])
      .execute();
  }

  async awardAchievementToUser(
    pupilId: string,
    achievementId: string,
  ): Promise<PupilAchievement> {
    // Check if achievement exists
    await this.findOne(achievementId);

    // Check if user already has this achievement
    const existingAward = await this.db
      .selectFrom('public.pupil_achievements')
      .where('pupil_id', '=', pupilId)
      .where('achievement_id', '=', achievementId)
      .selectAll()
      .executeTakeFirst();

    if (existingAward) {
      throw new NotFoundException(`User already has this achievement`);
    }

    const newPupilAchievement: NewPupilAchievement = {
      pupil_id: pupilId,
      achievement_id: achievementId,
    };

    return await this.db
      .insertInto('public.pupil_achievements')
      .values(newPupilAchievement)
      .returningAll()
      .executeTakeFirst();
  }

  async awardAchievementByName(
    pupilId: string,
    achievementName: string,
  ): Promise<PupilAchievement> {
    // Find achievement by name
    const achievement = await this.db
      .selectFrom('public.achievements')
      .where('name', '=', achievementName)
      .selectAll()
      .executeTakeFirst();

    if (!achievement) {
      throw new NotFoundException(
        `Achievement with name '${achievementName}' not found`,
      );
    }

    // Award the achievement using existing method
    return await this.awardAchievementToUser(pupilId, achievement.id);
  }

  async hasAchievement(
    pupilId: string,
    achievementName: string,
  ): Promise<PupilAchievement | null> {
    return (
      (await this.db
        .selectFrom('public.pupil_achievements')
        .innerJoin(
          'public.achievements',
          'public.achievements.id',
          'public.pupil_achievements.achievement_id',
        )
        .where('public.pupil_achievements.pupil_id', '=', pupilId)
        .where('public.achievements.name', '=', achievementName)
        .selectAll()
        .executeTakeFirst()) || null
    );
  }

  async addLoginAchievement(pupilId: string): Promise<PupilAchievement[]> {
    const achievementMilestones = new Map([
      [3, 'Getting Started'],
      [7, 'One Week Wonder'],
      [14, 'Consistency Champ'],
      [30, 'Committed Learner'],
      [180, 'Half-Year Hero'],
    ]);

    const pupil = await this.db
      .selectFrom('public.pupils')
      .where('id', '=', pupilId)
      .select('user_id')
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Pupil ${pupilId} not found.`),
      );

    // Get longest loginstreak
    const streak = await this.db
      .selectFrom('authentication.login_streaks as ls')
      .where('ls.user_id', '=', pupil.user_id)
      .select('ls.longest_streak')
      .executeTakeFirstOrThrow(
        () =>
          new NotFoundException(
            `Login streak for pupil ${pupilId} not available.`,
          ),
      );

    const longestStreak = streak.longest_streak;
    const addedAchievements: PupilAchievement[] = [];

    for (const [milestone, achievementName] of achievementMilestones) {
      if (longestStreak >= milestone) {
        const existing = await this.hasAchievement(pupilId, achievementName);
        if (!existing) {
          const achievement = await this.db
            .selectFrom('public.achievements')
            .where('name', '=', achievementName)
            .selectAll()
            .executeTakeFirst();

          if (achievement) {
            const pupilAchievement = await this.awardAchievementToUser(
              pupilId,
              achievement.id,
            );
            addedAchievements.push(pupilAchievement);
          }
        }
      }
    }

    return addedAchievements;
  }

  async addBooksReadAchievement(pupilId: string): Promise<PupilAchievement[]> {
    const achievementMilestones = new Map([
      [3, 'Page Turner'],
      [5, 'Avid Reader'],
      [10, 'Story Seeker'],
      [20, 'Book Explorer'],
      [30, 'Book Master'],
    ]);

    // Get number of reading materials read by pupil
    const booksRead = await this.db
      .selectFrom('public.reading_sessions')
      .where('pupil_id', '=', pupilId)
      .where('completion_percentage', '=', 100)
      .select('reading_material_id')
      .distinct()
      .execute();

    const booksReadCount = booksRead.length;
    const addedAchievements: PupilAchievement[] = [];

    for (const [milestone, achievementName] of achievementMilestones) {
      if (booksReadCount >= milestone) {
        const existing = await this.hasAchievement(pupilId, achievementName);
        if (!existing) {
          const achievement = await this.db
            .selectFrom('public.achievements')
            .where('name', '=', achievementName)
            .selectAll()
            .executeTakeFirst();

          if (achievement) {
            const pupilAchievement = await this.awardAchievementToUser(
              pupilId,
              achievement.id,
            );
            addedAchievements.push(pupilAchievement);
          }
        }
      }
    }

    return addedAchievements;
  }

  async removePupilAchievement(
    pupilId: string,
    achievementId: string,
  ): Promise<PupilAchievement> {
    const deletedAchievement = await this.db
      .deleteFrom('public.pupil_achievements')
      .where('pupil_id', '=', pupilId)
      .where('achievement_id', '=', achievementId)
      .returningAll()
      .executeTakeFirstOrThrow(
        () =>
          new NotFoundException(
            `Achievement not found for this pupil or already removed`,
          ),
      );

    return deletedAchievement;
  }
}
