import { LibraryEntriesService } from './library-entries.service';
export declare class LibraryEntriesController {
    private readonly libraryEntriesService;
    constructor(libraryEntriesService: LibraryEntriesService);
    create(readingMaterialId: string): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            reading_material_id: string;
            user_id: string;
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: {
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
        }[];
    }>;
    remove(readingMaterialId: string): Promise<{
        message: string;
    }>;
}
