import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '../../database/db';
import type { Achievement, NewAchievement } from '../../database/schemas';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

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
}
