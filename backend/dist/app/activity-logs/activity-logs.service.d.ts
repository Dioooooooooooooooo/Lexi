import { CreateActivityLogDto } from "./dto/create-activity-log.dto";
import { UpdateActivityLogDto } from "./dto/update-activity-log.dto";
import { Kysely } from "kysely";
import { DB } from "@/database/db";
import { ActivityService } from "../activity/activity.service";
export declare class ActivityLogsService {
    private readonly db;
    private activityService;
    constructor(db: Kysely<DB>, activityService: ActivityService);
    create(createActivityLogDto: CreateActivityLogDto, activityId: string): Promise<{
        id: string;
        completed_at: Date;
        activity_id: string;
        minigame_log_id: string;
    }>;
    findOne(activityId: string): Promise<{
        id: string;
        completed_at: Date;
        activity_id: string;
        minigame_log_id: string;
    }>;
    findAll(classroomId: string): Promise<{
        id: string;
        completed_at: Date;
        activity_id: string;
        minigame_log_id: string;
    }[]>;
    update(id: number, updateActivityLogDto: UpdateActivityLogDto): string;
    remove(id: number): string;
}
