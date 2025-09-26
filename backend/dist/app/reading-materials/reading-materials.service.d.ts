import { CreateReadingMaterialDto } from './dto/create-reading-material.dto';
import { Kysely } from 'kysely';
import { DB } from '@/database/db';
import { GenresService } from '../genres/genres.service';
import { ReadabilityService } from './readibility.service';
import { ReadingMaterialWithGenres } from './reading-materials.controller';
export declare class ReadingMaterialsService {
    private readonly db;
    private genreService;
    private readabilityService;
    constructor(db: Kysely<DB>, genreService: GenresService, readabilityService: ReadabilityService);
    create(createReadingMaterialDto: CreateReadingMaterialDto): Promise<ReadingMaterialWithGenres>;
    findAll(): Promise<ReadingMaterialWithGenres[]>;
    findOne(id: string): Promise<ReadingMaterialWithGenres>;
    getRecommendedReadingMaterials(userId: string): Promise<ReadingMaterialWithGenres[]>;
}
