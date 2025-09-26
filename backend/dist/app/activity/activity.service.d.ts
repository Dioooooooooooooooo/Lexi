import { DB } from "@/database/db";
import { Kysely } from "kysely";
import { CreateActivityDTO } from "./dto/create-activity.dto";
import { Activity } from "@/database/schemas";
import { ClassroomsService } from "../classrooms/classrooms.service";
import { UpdateActivityDTO } from "./dto/update-activity.dto";
export declare class ActivityService {
    private readonly db;
    private classroomService;
    constructor(db: Kysely<DB>, classroomService: ClassroomsService);
    create(createActivityDTO: CreateActivityDTO, classroomId: string): Promise<Activity>;
    findAllByClassroomId(classroomId: string): Promise<Activity[]>;
    findOne(activityId: string): Promise<Activity>;
    update(activityId: string, updateActivityDTO: UpdateActivityDTO): Promise<Activity>;
    remove(activityId: string): Promise<Activity>;
}
