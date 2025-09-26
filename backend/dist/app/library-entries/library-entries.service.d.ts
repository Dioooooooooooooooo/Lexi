import { Kysely } from 'kysely';
import { DB } from '@/database/db';
export declare class LibraryEntriesService {
    private readonly db;
    constructor(db: Kysely<DB>);
    create(readingMaterialId: string): Promise<{
        created_at: Date;
        id: string;
        reading_material_id: string;
        user_id: string;
    }>;
    findAll(): Promise<{
        created_at: Date;
        id: string;
        author: string;
        content: string;
        cover: string;
        description: string;
        difficulty: number;
        grade_level: number;
        is_deped: boolean;
        title: string;
        updated_at: Date;
    }[]>;
    remove(readingMaterialId: string): Promise<void>;
}
