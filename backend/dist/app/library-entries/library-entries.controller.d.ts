import { LibraryEntriesService } from './library-entries.service';
export declare class LibraryEntriesController {
    private readonly libraryEntriesService;
    constructor(libraryEntriesService: LibraryEntriesService);
    create(readingMaterialId: string): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            user_id: string;
            reading_material_id: string;
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: {
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
        }[];
    }>;
    remove(readingMaterialId: string): Promise<{
        message: string;
    }>;
}
