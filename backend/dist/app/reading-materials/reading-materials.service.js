"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingMaterialsService = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const genres_service_1 = require("../genres/genres.service");
const readibility_service_1 = require("./readibility.service");
let ReadingMaterialsService = class ReadingMaterialsService {
    constructor(db, genreService, readabilityService) {
        this.db = db;
        this.genreService = genreService;
        this.readabilityService = readabilityService;
    }
    async create(createReadingMaterialDto) {
        const readingMaterial = await this.db
            .insertInto('public.reading_materials')
            .values({
            author: createReadingMaterialDto.author,
            title: createReadingMaterialDto.title,
            description: createReadingMaterialDto.description,
            content: createReadingMaterialDto.content,
            difficulty: await this.readabilityService.calculateFleschScore(createReadingMaterialDto.content),
            is_deped: createReadingMaterialDto.is_deped,
            cover: createReadingMaterialDto.cover,
            grade_level: createReadingMaterialDto.grade_level,
        })
            .returningAll()
            .executeTakeFirst();
        if (!readingMaterial) {
            throw new Error('Failed to create reading material');
        }
        await this.genreService.createReadingMaterialGenres(readingMaterial.id, createReadingMaterialDto.genres);
        return { ...readingMaterial, genres: createReadingMaterialDto.genres };
    }
    async findAll() {
        const readingMaterials = await this.db
            .selectFrom('public.reading_materials as rm')
            .selectAll()
            .execute();
        const readingMaterialsWithGenres = await Promise.all(readingMaterials.map(async (material) => {
            const genres = await this.db
                .selectFrom('public.reading_material_genres as rmg')
                .innerJoin('public.genres as g', 'g.id', 'rmg.genre_id')
                .where('rmg.reading_material_id', '=', material.id)
                .select(['g.name'])
                .execute();
            return {
                ...material,
                genres: genres.map(genre => genre.name),
            };
        }));
        return readingMaterialsWithGenres;
    }
    async findOne(id) {
        const readingMaterial = await this.db
            .selectFrom('public.reading_materials as rm')
            .where('rm.id', '=', id)
            .selectAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Reading material with ID ${id} not found`));
        const genres = await this.db
            .selectFrom('public.reading_material_genres as rmg')
            .innerJoin('public.genres as g', 'g.id', 'rmg.genre_id')
            .where('rmg.reading_material_id', '=', id)
            .select(['g.name'])
            .execute();
        return { ...readingMaterial, genres: genres.map(genre => genre.name) };
    }
    async getRecommendedReadingMaterials(userId) {
        const pupil = await this.db
            .selectFrom('public.pupils')
            .where('user_id', '=', userId)
            .selectAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Pupil ${userId} not found`));
        const completedSessions = await this.db
            .selectFrom('public.reading_sessions as rs')
            .innerJoin('public.reading_materials as rm', 'rm.id', 'rs.reading_material_id')
            .leftJoin('public.reading_material_genres as rmg', 'rmg.reading_material_id', 'rm.id')
            .leftJoin('public.genres as g', 'g.id', 'rmg.genre_id')
            .where('rs.id', '=', pupil.id)
            .where('rs.completion_percentage', '>=', 80)
            .select([
            'rs.id as session_id',
            'rs.completion_percentage',
            'rm.id as reading_material_id',
            'rm.title',
            'rm.difficulty',
            (0, kysely_1.sql) `coalesce(json_agg(g.name) filter (where g.name is not null), '[]')`.as('genres'),
            (0, kysely_1.sql) `coalesce(json_agg(g.id), '[]')`.as('genreIds'),
        ])
            .groupBy(['rs.id', 'rm.id'])
            .execute();
        if (!completedSessions || completedSessions.length === 0) {
            return await this.db
                .selectFrom('public.reading_materials as rm')
                .innerJoin('public.reading_material_genres as rmg', 'rmg.reading_material_id', 'rm.id')
                .leftJoin('public.genres as g', 'g.id', 'rmg.genre_id')
                .selectAll('rm')
                .select([(0, kysely_1.sql) `array_agg(g.name)`.as('genres')])
                .groupBy(['rm.id'])
                .orderBy((0, kysely_1.sql) `RANDOM()`)
                .limit(3)
                .execute();
        }
        const completedMaterialIds = completedSessions.map(rs => rs.reading_material_id);
        const avgDifficulty = completedSessions.reduce((sum, c) => sum + c.difficulty, 0) /
            completedSessions.length;
        const genreCount = {};
        for (const c of completedSessions) {
            for (const g of c.genreIds ?? []) {
                genreCount[g] = (genreCount[g] ?? 0) + 1;
            }
        }
        const favoriteGenreIds = Object.entries(genreCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([id]) => id);
        const recommended = await this.db
            .selectFrom('public.reading_materials as rm')
            .innerJoin('public.reading_material_genres as rmg', 'rmg.reading_material_id', 'rm.id')
            .leftJoin('public.genres as g', 'g.id', 'rmg.genre_id')
            .where('rm.id', 'not in', completedMaterialIds)
            .where((0, kysely_1.sql) `abs(rm.difficulty - ${avgDifficulty}) <= 10`)
            .groupBy('rm.id')
            .selectAll('rm')
            .select([(0, kysely_1.sql) `array_agg(g.name)`.as('genres')])
            .limit(3)
            .execute();
        return recommended;
    }
};
exports.ReadingMaterialsService = ReadingMaterialsService;
exports.ReadingMaterialsService = ReadingMaterialsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [kysely_1.Kysely,
        genres_service_1.GenresService,
        readibility_service_1.ReadabilityService])
], ReadingMaterialsService);
//# sourceMappingURL=reading-materials.service.js.map