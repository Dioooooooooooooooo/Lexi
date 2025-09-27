import { CreateGenreDto } from "./dto/create-genre.dto";
import { Kysely } from "kysely";
import { DB } from "@/database/db";
export declare class GenresService {
    private readonly db;
    constructor(db: Kysely<DB>);
    create(createGenreDto: CreateGenreDto): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            name: string;
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: {
            created_at: Date;
            id: string;
            name: string;
        }[];
    }>;
    createReadingMaterialGenres(readingMaterialId: string, genreNames: string[]): Promise<import("kysely").InsertResult[]>;
}
