import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
export declare class ActivityLogsController {
    private readonly activityLogsService;
    constructor(activityLogsService: ActivityLogsService);
    create(activityId: string, createActivityLogDto: CreateActivityLogDto): Promise<{
        message: string;
        data: {
            id: string;
            completed_at: Date;
            activity_id: string;
            minigame_log_id: string;
        };
    }>;
    findOne(activityId: string): Promise<{
        message: string;
        data: {
            id: string;
            completed_at: Date;
            activity_id: string;
            minigame_log_id: string;
        };
    }>;
    findAll(activityId: string, classroomId: string): Promise<{
        message: string;
        data: {
            id: string;
            completed_at: Date;
            activity_id: string;
            minigame_log_id: string;
        }[];
    }>;
}
