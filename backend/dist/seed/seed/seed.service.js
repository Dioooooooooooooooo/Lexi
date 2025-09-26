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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const readibility_service_1 = require("../../app/reading-materials/readibility.service");
const schemas_1 = require("../../database/schemas");
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const achievements_json_1 = __importDefault(require("../data/achievements.json"));
const all_complete_data_json_1 = __importDefault(require("../data/all_complete_data.json"));
const Genres = new Set([
    'Adventure',
    'Romance',
    'Drama',
    'Comedy',
    'Fantasy',
    'Horror',
    'Mystery',
    'Science Fiction',
    'History',
    'Coming of Age',
    'Non-Fiction',
    'Fiction',
    'Passage',
    'Animal',
    'Poetry',
    'Educational',
]);
let SeedService = class SeedService {
    constructor(db, readabilityService) {
        this.db = db;
        this.readabilityService = readabilityService;
    }
    async run() {
        this.ReadingContentSeed();
        this.AchievementSeed();
    }
    async isTableEmpty(table) {
        const exist = await this.db
            .selectFrom(table)
            .select('id')
            .limit(1)
            .executeTakeFirst();
        console.log(table, 'is empty?', !exist);
        return !exist;
    }
    async ReadingContentSeed() {
        const isEmpty = await this.isTableEmpty('public.reading_materials');
        if (!isEmpty)
            return;
        const genreIdMap = new Map();
        for (const gen of Genres) {
            const genre = await this.db
                .selectFrom('public.genres')
                .select(['id', 'name'])
                .where('name', '=', gen)
                .executeTakeFirst();
            if (genre) {
                genreIdMap.set(genre.name, genre.id);
            }
            else {
                const existing = await this.db
                    .insertInto('public.genres')
                    .values({ name: gen, created_at: new Date() })
                    .returning(['id', 'name'])
                    .executeTakeFirst();
                if (existing)
                    genreIdMap.set(existing.name, existing.id);
            }
        }
        console.log('Genres Seeding Finished');
        for (const material of all_complete_data_json_1.default) {
            const readingMat = await this.db
                .insertInto('public.reading_materials')
                .values({
                author: material.author,
                title: material.title,
                description: material.description,
                grade_level: material.grade_level,
                difficulty: this.readabilityService.calculateFleschScore(material.passage),
                cover: material.cover,
                content: material.passage,
                is_deped: true,
                created_at: new Date(),
            })
                .returning('id')
                .executeTakeFirstOrThrow();
            const readingMatId = readingMat.id;
            for (const genreName of material.genre) {
                const genreId = genreIdMap.get(genreName);
                if (genreId) {
                    await this.db
                        .insertInto('public.reading_material_genres')
                        .values({ reading_material_id: readingMatId, genre_id: genreId })
                        .execute();
                }
            }
            const wordsFromLetters = this.CreateMinigamesList(material.minigames.WordsFromLetters, schemas_1.MinigameType.WordsFromLetters, readingMatId);
            let sentenceRearrangement = [];
            if (material.minigames.SentenceRearrangement) {
                sentenceRearrangement = this.CreateMinigamesList(material.minigames.SentenceRearrangement, schemas_1.MinigameType.SentenceRearrangement, readingMatId);
            }
            let choices = [];
            if (material.minigames.Choices) {
                choices = this.CreateMinigamesList(material.minigames.Choices, schemas_1.MinigameType.Choices, readingMatId);
            }
            const mgcount = await this.db
                .insertInto('public.minigames')
                .values([...wordsFromLetters, ...sentenceRearrangement, ...choices])
                .returning('id')
                .execute();
            console.log(`Successfully created RM: ${material.title} with minigames: ${mgcount.length}`);
        }
        console.log('Reading Materials Seeding Finished');
    }
    CreateMinigamesList(items, minigameType, readingMaterialID) {
        const maxScores = this.getMaxScore(minigameType, items);
        return items.map((minigame, index) => {
            const { part_num, ...rest } = minigame;
            return {
                reading_material_id: readingMaterialID,
                minigame_type: minigameType,
                part_num: part_num,
                max_score: maxScores[index],
                metadata: JSON.stringify(rest),
            };
        });
    }
    getMaxScore(minigameType, items) {
        const maxScores = [];
        items.forEach(minigame => {
            let score = 0;
            switch (minigameType) {
                case schemas_1.MinigameType.Choices:
                case schemas_1.MinigameType.SentenceRearrangement:
                    score = 1;
                    break;
                case schemas_1.MinigameType.WordsFromLetters:
                    const wfl = minigame;
                    score = wfl.words.length;
                    break;
            }
            maxScores.push(score);
        });
        return maxScores;
    }
    async AchievementSeed() {
        const isEmpty = await this.isTableEmpty('public.achievements');
        if (!isEmpty)
            return;
        for (const achieve of achievements_json_1.default) {
            await this.db
                .insertInto('public.achievements')
                .values({
                name: achieve.Name,
                description: achieve.Description,
                badge: achieve.Badge,
                created_at: new Date(),
            })
                .execute();
        }
        console.log('Achievements Seeding Finished');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [kysely_1.Kysely,
        readibility_service_1.ReadabilityService])
], SeedService);
//# sourceMappingURL=seed.service.js.map