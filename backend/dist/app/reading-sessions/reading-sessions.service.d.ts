import { CreateReadingSessionDto } from './dto/create-reading-session.dto';
import { UpdateReadingSessionDto } from './dto/update-reading-session.dto';
import { Kysely } from 'kysely';
import { DB } from '@/database/db';
import { MinigamesService } from '../minigames/minigames.service';
export declare class ReadingSessionsService {
    private readonly db;
    private readonly minigamesService;
    constructor(db: Kysely<DB>, minigamesService: MinigamesService);
    create(createReadingSessionDto: CreateReadingSessionDto): Promise<{
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
    }>;
    findAll(): Promise<{
        created_at: Date;
        id: string;
        reading_material_id: string;
        user_id: string;
        updated_at: Date;
        pupil_id: string;
        completed_at: Date;
        completion_percentage: number;
        started_at: Date;
    }[]>;
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, updateReadingSessionDto: UpdateReadingSessionDto): Promise<{
        created_at: Date;
        id: string;
        reading_material_id: string;
        user_id: string;
        updated_at: Date;
        pupil_id: string;
        completed_at: Date;
        completion_percentage: number;
        started_at: Date;
    }>;
    remove(id: string): Promise<{
        created_at: Date;
        id: string;
        reading_material_id: string;
        user_id: string;
        updated_at: Date;
        pupil_id: string;
        completed_at: Date;
        completion_percentage: number;
        started_at: Date;
    }>;
}
