import { ReadabilityService } from '@/app/reading-materials/readibility.service';
import { DB } from '@/database/db';
import { MinigameType } from '@/database/schemas';
import { Kysely } from 'kysely';
export declare class SeedService {
    private readonly db;
    private readabilityService;
    constructor(db: Kysely<DB>, readabilityService: ReadabilityService);
    run(): Promise<void>;
    isTableEmpty(table: any): Promise<boolean>;
    ReadingContentSeed(): Promise<void>;
    CreateMinigamesList(items: object[], minigameType: MinigameType, readingMaterialID: string): {
        reading_material_id: string;
        minigame_type: MinigameType;
        part_num: any;
        max_score: number;
        metadata: string;
    }[];
    getMaxScore(minigameType: MinigameType, items: object[]): number[];
    AchievementSeed(): Promise<void>;
}
