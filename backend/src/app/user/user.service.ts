import { DB } from '@/database/db';
import { LoginStreak, Session } from '@/database/schemas';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { UserResponseDto } from '../auth/dto/auth.dto';
import { PupilsService } from '../pupils/pupils.service';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('DATABASE') private readonly db: Kysely<DB>,
    private readonly pupilService: PupilsService,
    private readonly achievementService: AchievementsService,
  ) {}
  async updateLoginStreak(user_id: string): Promise<LoginStreak | null> {
    const pupil = await this.pupilService.getPupilProfile(user_id);
    let loginStreak = await this.db
      .selectFrom('auth.login_streaks')
      .where('pupil_id', '=', pupil.id)
      .selectAll()
      .executeTakeFirst();

    if (!loginStreak) {
      loginStreak = await this.db
        .insertInto('auth.login_streaks')
        .values({
          pupil_id: pupil.id,
          current_streak: 1,
          longest_streak: 1,
          last_login_date: new Date(),
        })
        .returningAll()
        .executeTakeFirst();
    } else {
      const daysSinceLastLogin = Math.floor(
        (new Date().getTime() -
          new Date(loginStreak.last_login_date).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      let newCurrentStreak = loginStreak.current_streak;
      let newLongestStreak = loginStreak.longest_streak;

      if (daysSinceLastLogin === 1) {
        // Last login was yesterday, increment the streak
        newCurrentStreak += 1;
        if (newCurrentStreak > newLongestStreak) {
          newLongestStreak = newCurrentStreak;
        }
      } else if (daysSinceLastLogin > 1) {
        // Last login was before yesterday, reset the streak
        newCurrentStreak = 1;
      } else {
        // Last login was today, do nothing
        return loginStreak;
      }

      loginStreak = await this.db
        .updateTable('auth.login_streaks')
        .set({
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_login_date: new Date(),
        })
        .where('id', '=', loginStreak.id)
        .returningAll()
        .executeTakeFirst();
    }

    await this.achievementService.addLoginAchievement(pupil.id);

    return loginStreak;
  }

  async getLoginStreak(user_id: string): Promise<LoginStreak> {
    const pupil = await this.pupilService.getPupilProfile(user_id);
    const loginStreak = await this.db
      .selectFrom('auth.login_streaks')
      .where('pupil_id', '=', pupil.id)
      .selectAll()
      .executeTakeFirst();

    if (!loginStreak) {
      throw new NotFoundException('Login streak not found');
    }

    return loginStreak;
  }

  async searchUsersByRole(
    query: string,
    role: string,
  ): Promise<UserResponseDto[]> {
    const usersInRole = await this.getUsersByRole(role);

    query = query.toLowerCase();

    const filteredUsers = usersInRole.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return (
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });

    return filteredUsers;
  }

  async getUsersByRole(role: string): Promise<UserResponseDto[]> {
    const users = await this.db
      .selectFrom('auth.users as u')
      .leftJoin('auth.user_roles as ur', 'u.id', 'ur.user_id')
      .leftJoin('auth.roles as r', 'ur.role_id', 'r.id')
      .where('r.name', '=', role)
      .where('u.is_deleted', '=', false)
      .select([
        'u.id',
        'u.email',
        'u.first_name',
        'u.last_name',
        'u.created_at',
        'u.updated_at',
        sql<string>`r.name`.as('role'),
      ])
      .execute();
    return users;
  }

  async createSession(user_id: string): Promise<Session> {
    const newSession = await this.db
      .insertInto('auth.sessions')
      .values({
        user_id: user_id,
        created_at: new Date(),
        duration: 0,
      })
      .returningAll()
      .executeTakeFirst();

    await this.updateLoginStreak(user_id);

    return newSession;
  }

  async endSession(id: string, sessionId: string): Promise<Session> {
    const session = await this.db
      .selectFrom('auth.sessions')
      .where('id', '=', sessionId)
      .selectAll()
      .executeTakeFirstOrThrow(() => {
        throw new NotFoundException('Session not found.');
      });

    if (session.end_at) {
      throw new BadRequestException('Session already ended.');
    }

    const durationOfSession = Math.floor(
      (new Date().getTime() - new Date(session.created_at).getTime()) /
        (1000 * 60),
    );

    const endedSession = await this.db
      .updateTable('auth.sessions')
      .set({
        duration: durationOfSession,
        end_at: new Date(),
      })
      .where('id', '=', sessionId)
      .returningAll()
      .executeTakeFirst();

    return endedSession;
  }

  async getTotalSessions(user_id: string): Promise<{ number }> {
    const session = await this.db
      .selectFrom('auth.sessions')
      .where('user_id', '=', user_id)
      .select(sql`Sum(duration)`.as('number'))
      .executeTakeFirst();

    return session;
  }
}
