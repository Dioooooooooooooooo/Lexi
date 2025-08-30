import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateActivityLogDto } from "./dto/create-activity-log.dto";
import { UpdateActivityLogDto } from "./dto/update-activity-log.dto";
import { Kysely } from "kysely";
import { DB } from "@/database/db";
import { NewActivityLog } from "@/database/schemas";
import { JwtAccessTokenPayload } from "@/common/types/jwt.types";
import { getCurrentRequest } from "@/common/utils/request-context";
import { ActivityService } from "../activity/activity.service";

@Injectable()
export class ActivityLogsService {
  constructor(
    @Inject("DATABASE") private readonly db: Kysely<DB>,
    private activityService: ActivityService,
  ) {}
  async create(createActivityLogDto: CreateActivityLogDto, activityId: string) {
    const activityLog: NewActivityLog = {
      activity_id: activityId,
      ...createActivityLogDto,
      completed_at: new Date(),
    };

    const data = await this.db
      .insertInto("public.activity_logs")
      .values(activityLog)
      .returningAll()
      .executeTakeFirst();

    return data;
  }

  async findOne(activityId: string) {
    const data = await this.db
      .selectFrom("public.activity_logs")
      .where("id", "=", activityId)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Activity with id ${activityId} not found`),
      );

    return data;
  }

  async findAll(classroomId: string) {
    const activitiesClassroom =
      await this.activityService.findAllByClassroomId(classroomId);

    const activityIds = activitiesClassroom.map(a => a.id);

    if (activityIds.length === 0) {
      return []; // no activities in this classroom
    }

    const data = await this.db
      .selectFrom("public.activity_logs")
      .selectAll()
      .where("activity_id", "in", activityIds)
      .execute();

    return data;
  }

  update(id: number, updateActivityLogDto: UpdateActivityLogDto) {
    return `This action updates a #${id} activityLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} activityLog`;
  }
}
