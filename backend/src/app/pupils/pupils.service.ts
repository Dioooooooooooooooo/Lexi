import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePupilProfileDto } from './dto/update-pupil-profile.dto';
import { Kysely } from 'kysely';
import { DB } from '@/database/db';
import { Pupil, PupilLeaderboard } from '@/database/schemas';

@Injectable()
export class PupilsService {
  constructor(@Inject('DATABASE') private readonly db: Kysely<DB>) { }

  async getPupilProfile(userId: string): Promise<Pupil> {
    return await this.db
      .selectFrom('public.pupils as p')
      .where('p.user_id', '=', userId)
      .selectAll()
      .executeTakeFirstOrThrow(() => new NotFoundException('Pupil not found'));
  }

  async updatePupilProfile(
    userId: string,
    updatePupilProfileDto: UpdatePupilProfileDto,
  ): Promise<Pupil> {
    return await this.db
      .updateTable('public.pupils as p')
      .set(updatePupilProfileDto)
      .where('p.user_id', '=', userId)
      .returningAll()
      .executeTakeFirstOrThrow(() => new NotFoundException('Pupil not found'));
  }

  async getPupilByUsername(username: string) {
    const result = await this.db
      .selectFrom('authentication.users as u')
      .innerJoin('public.pupils as p', 'p.user_id', 'u.id')
      .where('u.username', '=', username)
      .where('u.is_deleted', '=', false)
      .select([
        'u.id as user_id',
        'u.first_name',
        'u.last_name',
        'u.avatar',
        'u.username',
        'p.id as pupil_id',
        'p.age',
        'p.grade_level',
        'p.level',
      ])
      .executeTakeFirstOrThrow(() => new NotFoundException('Pupil not found'));

    const {
      user_id,
      first_name,
      last_name,
      avatar,
      username: uname,
      pupil_id,
      age,
      grade_level,
      level,
    } = result;

    return {
      message: 'Pupil successfully fetched',
      data: {
        user: {
          id: user_id,
          first_name,
          last_name,
          avatar,
          username: uname,
        },
        pupil: {
          id: pupil_id,
          age,
          grade_level,
          level,
        },
      },
    };
  }
  async getGlobalPupilLeaderboard(): Promise<PupilLeaderboard[]> {
    return await this.db
      .selectFrom('public.pupil_leaderboard')
      .selectAll()
      .orderBy('level', 'desc')
      .limit(10)
      .execute();
  }

  async getPupilLeaderBoardByPupilId(
    pupilId: string,
  ): Promise<PupilLeaderboard[]> {
    return await this.db
      .selectFrom('public.pupil_leaderboard')
      .selectAll()
      .where('pupil_id', '=', pupilId)
      .orderBy('level', 'desc')
      .execute();
  }
}
