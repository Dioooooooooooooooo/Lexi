import { Kysely } from 'kysely';
import { DB } from '@/database/db';
export declare class LibraryEntriesService {
    private readonly db;
    constructor(db: Kysely<DB>);
    create(readingMaterialId: string): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        reading_material_id: string;
    }>;
    findAll(): Promise<{
        created_at: Date;
        id: string;
        grade_level: number;
        updated_at: Date;
        description: string;
        author: string;
        content: string;
        cover: string;
        difficulty: number;
        is_deped: boolean;
        title: string;
    }[]>;
    remove(readingMaterialId: string): Promise<void>;
}
