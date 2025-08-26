import { DB } from "@/database/db";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Kysely } from "kysely";
import { CreateActivityDTO } from "./dto/create-activity.dto";
import { Activity, NewActivity } from "@/database/schemas";
import { getCurrentRequest } from "@/common/utils/request-context";
import { JwtAccessTokenPayload } from "@/common/types/jwt.types";
import { ClassroomsService } from "../classrooms/classrooms.service";
import { UpdateActivityDTO } from "./dto/update-activity.dto";

@Injectable()
export class ActivityService {
  constructor(
    @Inject("DATABASE") private readonly db: Kysely<DB>,
    private classroomService: ClassroomsService,
  ) {}

  async create(
    createActivityDTO: CreateActivityDTO,
    classroomId: string,
  ): Promise<Activity> {
    const newActivity: NewActivity = {
      ...createActivityDTO,
      classroom_id: classroomId,
    };

    const activity = await this.db
      .insertInto("public.activities")
      .values(newActivity)
      .returningAll()
      .executeTakeFirst();

    return activity;
  }

  async findAllByClassroomId(classroomId: string): Promise<Activity[]> {
    const activities = await this.db
      .selectFrom("public.activities")
      .where("classroom_id", "=", classroomId)
      .selectAll()
      .execute();
    return activities;
  }

  async findOne(activityId: string): Promise<Activity> {
    const activity = await this.db
      .selectFrom("public.activities as a")
      .where("a.id", "=", activityId)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Activity with id ${activityId} not found`),
      );

    return activity;
  }

  async update(
    activityId: string,
    updateActivityDTO: UpdateActivityDTO,
  ): Promise<Activity> {
    const req = getCurrentRequest();
    const user: JwtAccessTokenPayload = req["user"];

    // TODO: dili ba weird nga basta teacher lng jd sya, makaedit dayun syas activity?
    // or not a problem nlng, basta ma likay sa front?

    // const teacherClassroom = this.classroomService.findOne(classroomId);
    // const teacher = (await teacherClassroom).teacher_id;

    const activity = await this.db
      .updateTable("public.activities as a")
      .set(updateActivityDTO)
      .where("a.id", "=", activityId)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Activity with ${activityId} not found`),
      );

    return activity;
  }

  async remove(activityId: string): Promise<Activity> {
    const activity = await this.db
      .deleteFrom("public.activities")
      .where("id", "=", activityId)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new NotFoundException(`Activity with ${activityId} not found`),
      );

    return activity;
  }
}
