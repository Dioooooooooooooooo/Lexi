import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateReadingSessionDto } from "./dto/create-reading-session.dto";
import { UpdateReadingSessionDto } from "./dto/update-reading-session.dto";
import { Kysely } from "kysely";
import { DB } from "@/database/db";
import { JwtAccessTokenPayload } from "@/common/types/jwt.types";
import { getCurrentRequest } from "@/common/utils/request-context";
import { NewReadingSession } from "@/database/schemas";

@Injectable()
export class ReadingSessionsService {
  constructor(@Inject("DATABASE") private readonly db: Kysely<DB>) {}

  async create(createReadingSessionDto: CreateReadingSessionDto) {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req["user"];

    const newReadingSession: NewReadingSession = {
      ...createReadingSessionDto,
      pupil_id: user.pupil.id,
      started_at: new Date(),
    };

    return await this.db
      .insertInto("public.reading_sessions")
      .values(newReadingSession)
      .returningAll()
      .executeTakeFirst();
  }

  async findAll() {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req["user"];
    return await this.db
      .selectFrom("public.reading_sessions")
      .where("pupil_id", "=", user.pupil.id)
      .selectAll()
      .execute();
  }

  async findOne(id: string) {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req["user"];
    return await this.db
      .selectFrom("public.reading_sessions")
      .where("pupil_id", "=", user.pupil.id)
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Reading session with id ${id} not found`),
      );
  }

  async update(id: string, updateReadingSessionDto: UpdateReadingSessionDto) {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req["user"];

    return await this.db
      .updateTable("public.reading_sessions")
      .set(updateReadingSessionDto)
      .where("id", "=", id)
      .where("pupil_id", "=", user.pupil.id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Reading session with id ${id} not found`),
      );
  }

  async remove(id: string) {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req["user"];

    return await this.db
      .deleteFrom("public.reading_sessions")
      .where("id", "=", id)
      .where("pupil_id", "=", user.pupil.id)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Reading session with id ${id} not found`),
      );
  }
}
