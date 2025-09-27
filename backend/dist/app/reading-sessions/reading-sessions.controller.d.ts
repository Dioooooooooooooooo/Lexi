import { ReadingSessionsService } from './reading-sessions.service';
import { CreateReadingSessionDto } from './dto/create-reading-session.dto';
import { UpdateReadingSessionDto } from './dto/update-reading-session.dto';
export declare class ReadingSessionsController {
    private readonly readingSessionsService;
    constructor(readingSessionsService: ReadingSessionsService);
    create(createReadingSessionDto: CreateReadingSessionDto): Promise<{
        message: string;
        data: {
            minigames: any[];
            created_at: Date;
            id: string;
            reading_material_id: string;
            user_id: string;
            updated_at: Date;
            pupil_id: string;
            completed_at: Date;
            completion_percentage: number;
            started_at: Date;
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            reading_material_id: string;
            user_id: string;
            updated_at: Date;
            pupil_id: string;
            completed_at: Date;
            completion_percentage: number;
            started_at: Date;
        }[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: {
            minigame_logs: {
                id: string;
                minigame_id: string;
                result: string;
            }[];
            minigames: {
                created_at: Date;
                id: string;
                reading_material_id: string;
                max_score: number;
                metadata: string;
                minigame_type: number;
                part_num: number;
            }[];
            created_at: Date;
            id: string;
            reading_material_id: string;
            user_id: string;
            updated_at: Date;
            pupil_id: string;
            completed_at: Date;
            completion_percentage: number;
            started_at: Date;
        };
    }>;
    update(id: string, updateReadingSessionDto: UpdateReadingSessionDto): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            reading_material_id: string;
            user_id: string;
            updated_at: Date;
            pupil_id: string;
            completed_at: Date;
            completion_percentage: number;
            started_at: Date;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            reading_material_id: string;
            user_id: string;
            updated_at: Date;
            pupil_id: string;
            completed_at: Date;
            completion_percentage: number;
            started_at: Date;
        };
    }>;
}
