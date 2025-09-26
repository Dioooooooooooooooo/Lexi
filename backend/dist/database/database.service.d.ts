import { Kysely } from "kysely";
import { DB } from "./db";
export declare class DatabaseService {
    private readonly db;
    constructor(db: Kysely<DB>);
    testConnection(): Promise<{
        status: string;
        message: string;
    }>;
}
