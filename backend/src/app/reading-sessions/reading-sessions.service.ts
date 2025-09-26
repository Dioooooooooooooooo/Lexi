import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReadingSessionDto } from './dto/create-reading-session.dto';
import { UpdateReadingSessionDto } from './dto/update-reading-session.dto';
import { Kysely } from 'kysely';
import { DB } from '@/database/db';
import { getCurrentRequest } from '@/common/utils/request-context';
import { NewReadingSession } from '@/database/schemas';
import { MinigamesService } from '../minigames/minigames.service';

@Injectable()
export class ReadingSessionsService {
  constructor(
    @Inject('DATABASE') private readonly db: Kysely<DB>,
    private readonly minigamesService: MinigamesService,
  ) {}

  async create(createReadingSessionDto: CreateReadingSessionDto) {
    const req = getCurrentRequest();
    const user = req['user'];

    const newReadingSession: NewReadingSession = {
      ...createReadingSessionDto,
      user_id: user.id,
      started_at: new Date(),
    };

    if (user.role === 'Pupil') {
      newReadingSession.pupil_id = user.pupil.id;
    }

    const readingSession = await this.db
      .insertInto('public.reading_sessions')
      .values(newReadingSession)
      .returningAll()
      .executeTakeFirst();

    var minigames = [];

    minigames = await this.minigamesService.getRandomMinigamesBySessionID(
      readingSession.id,
    );

    return { ...readingSession, minigames: minigames };
  }

  async findAll() {
    const req = getCurrentRequest();
    const user = req['user'];
    return await this.db
      .selectFrom('public.reading_sessions')
      .where('user_id', '=', user.id)
      .selectAll()
      .execute();
  }

  async findOne(id: string) {
    const req = getCurrentRequest();
    const user = req['user'];
    const readingSession = await this.db
      .selectFrom('public.reading_sessions as rs')
      .selectAll()
      .where('rs.user_id', '=', user.id)
      .where('rs.id', '=', id)
      .groupBy('rs.id')
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Reading session with id ${id} not found`),
      );

    const logs = await this.db
      .selectFrom('public.minigame_logs as ml')
      .where('ml.reading_session_id', '=', id)
      .select(['id', 'minigame_id', 'result'])
      .execute();

    const minigameIds = logs.map(l => l.minigame_id);

    const minigames = await this.db
      .selectFrom('public.minigames')
      .where('id', 'in', minigameIds)
      .orderBy('part_num')
      .selectAll()
      .execute();

    return { ...readingSession, minigame_logs: logs, minigames: minigames };
  }

  async update(id: string, updateReadingSessionDto: UpdateReadingSessionDto) {
    const req = getCurrentRequest();
    const user = req['user'];

    return await this.db
      .updateTable('public.reading_sessions')
      .set(updateReadingSessionDto)
      .where('id', '=', id)
      .where('user_id', '=', user.id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Reading session with id ${id} not found`),
      );
  }

  async remove(id: string) {
    const req = getCurrentRequest();
    const user = req['user'];

    return await this.db
      .deleteFrom('public.reading_sessions')
      .where('id', '=', id)
      .where('user_id', '=', user.id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Reading session with id ${id} not found`),
      );
  }
}
