import { Injectable, NotFoundException } from "@nestjs/common";
import { KyselyDatabaseService } from "@/database/kysely-database.service";
import { UpdatePupilProfileDto } from "./dto/update-pupil-profile.dto";

@Injectable()
export class PupilsService {
  constructor(private dbService: KyselyDatabaseService) {}

  async getPupilProfile(userId: string) {
    const db = this.dbService.database;

    const profile = await db
      .selectFrom("public.pupils as p")
      .where("p.user_id", "=", userId)
      .selectAll()
      .executeTakeFirstOrThrow(() => new NotFoundException("Pupil not found"));

    return { message: "Pupil profile successfully fetched", data: profile };
  }

  async updatePupilProfile(
    userId: string,
    updatePupilProfileDto: UpdatePupilProfileDto
  ) {
    const db = this.dbService.database;

    await db
      .selectFrom("public.pupils as p")
      .where("p.user_id", "=", userId)
      .executeTakeFirstOrThrow(() => new NotFoundException("Pupil not found"));

    const updated = await db
      .updateTable("public.pupils as p")
      .set(updatePupilProfileDto)
      .where("p.user_id", "=", userId)
      .returningAll()
      .execute();

    return { message: "Pupil profile successfully updated", data: updated };
  }

  async getGlobalPupilLeaderboard() {
    const db = this.dbService.database;
    const leaderboard = await db
      .selectFrom("public.pupil_leaderboard")
      .select(["pupil_id", "level", "recorded_at"])
      .orderBy("level", "desc")
      .limit(10)
      .execute();

    return {
      message: "Global pupil leaderboard successfully fetched",
      data: leaderboard,
    };
  }

  async getPupilByUsername(username: string) {
    const db = this.dbService.database;
    const result = await db
      .selectFrom("auth.users as u")
      .innerJoin("public.pupils as p", "p.user_id", "u.id")
      .where("u.username", "=", username)
      .select([
        "u.id as user_id",
        "u.first_name",
        "u.last_name",
        "u.avatar",
        "u.username",
        "p.id as pupil_id",
        "p.age",
        "p.grade_level",
        "p.level",
      ])
      .executeTakeFirstOrThrow(() => new NotFoundException("Pupil not found"));

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
      message: "Pupil successfully fetched",
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

  async getPupilLeaderBoardByPupilId(pupilId: string) {
    const db = this.dbService.database;

    const leaderboard = await db
      .selectFrom("public.pupil_leaderboard")
      .selectAll()
      .where("pupil_id", "=", pupilId)
      .orderBy("level", "desc")
      .execute();

    return {
      message: "successfully fetched pupil leaderboard",
      data: leaderboard,
    };
  }
}
