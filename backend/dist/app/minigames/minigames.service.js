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
exports.MinigamesService = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const public_schema_1 = require("../../database/schemas/public.schema");
const achievements_service_1 = require("../achievements/achievements.service");
const reading_materials_service_1 = require("../reading-materials/reading-materials.service");
const class_transformer_1 = require("class-transformer");
let MinigamesService = class MinigamesService {
    constructor(db, achievementService, readingMaterialService) {
        this.db = db;
        this.achievementService = achievementService;
        this.readingMaterialService = readingMaterialService;
    }
    async getAssignedMinigamesBySessionID(readingSessionId) {
        return await this.db
            .selectFrom('public.minigames as m')
            .leftJoin('public.minigame_logs as ml', 'ml.minigame_id', 'm.id')
            .leftJoin('public.reading_sessions as rs', 'rs.id', 'ml.reading_session_id')
            .where('rs.id', '=', readingSessionId)
            .selectAll('m')
            .orderBy('m.part_num')
            .execute();
    }
    async createMinigame(minigameType, request) {
        const metaDataObj = (0, class_transformer_1.instanceToPlain)(request);
        const metaData = JSON.stringify(metaDataObj, null, 2);
        const maxScore = this.getMaxScore(minigameType, request);
        const minigame = await this.db
            .insertInto('public.minigames')
            .values({
            reading_material_id: request.reading_material_id,
            minigame_type: minigameType,
            part_num: request.part_num,
            max_score: maxScore,
            metadata: metaData,
        })
            .returningAll()
            .executeTakeFirst();
        if (!minigame) {
            throw new Error('Error creating minigame.');
        }
        return minigame;
    }
    getMaxScore(minigameType, request) {
        switch (minigameType) {
            case public_schema_1.MinigameType.Choices:
            case public_schema_1.MinigameType.SentenceRearrangement:
                return 1;
            case public_schema_1.MinigameType.WordsFromLetters:
                const wordRequest = request;
                return wordRequest.words.length;
        }
    }
    async createMinigamesCompletion(readingSessionID, userId) {
        const readingSession = await this.db
            .selectFrom('public.reading_sessions as rs')
            .innerJoin('public.reading_materials as rm', 'rm.id', 'rs.reading_material_id')
            .where('rs.id', '=', readingSessionID)
            .select(['rs.pupil_id', 'rs.reading_material_id', 'rm.difficulty'])
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Reading session not found'));
        const logs = await this.db
            .selectFrom('public.minigame_logs as ml')
            .innerJoin('public.minigames as m', 'm.id', 'ml.minigame_id')
            .where('reading_session_id', '=', readingSessionID)
            .select(['ml.result', 'm.max_score'])
            .execute();
        if (logs.length === 0) {
            throw new common_1.NotFoundException('No minigame logs found for this reading session');
        }
        let totalScore = 0;
        let maxScore = 0;
        logs.forEach(log => {
            let score = 0;
            if (typeof log.result === 'string') {
                try {
                    const parsed = JSON.parse(log.result);
                    score = typeof parsed === 'number' ? parsed : (parsed?.score ?? 0);
                }
                catch {
                    score = Number(log.result) || 0;
                }
            }
            else if (typeof log.result === 'number') {
                score = log.result;
            }
            totalScore += score || 0;
            maxScore += log.max_score || 0;
        });
        let scorePercent = totalScore / maxScore;
        let minigamePerformanceMultiplier = 0;
        if (scorePercent == 1)
            minigamePerformanceMultiplier = 1.5;
        else if (scorePercent >= 0.8)
            minigamePerformanceMultiplier = 1.25;
        else if (scorePercent >= 0.6)
            minigamePerformanceMultiplier = 1;
        else if (scorePercent < 0.4)
            minigamePerformanceMultiplier = 0.75;
        else if (scorePercent < 0.2)
            minigamePerformanceMultiplier = 0.5;
        else if (scorePercent < 0.05)
            minigamePerformanceMultiplier = 0.25;
        else if (scorePercent >= 0)
            minigamePerformanceMultiplier = 0.1;
        let basePoints = 0;
        if (readingSession.difficulty >= 90)
            basePoints = 10;
        else if (readingSession.difficulty >= 80)
            basePoints = 15;
        else if (readingSession.difficulty >= 70)
            basePoints = 20;
        else if (readingSession.difficulty >= 60)
            basePoints = 30;
        else if (readingSession.difficulty >= 50)
            basePoints = 45;
        else if (readingSession.difficulty >= 30)
            basePoints = 60;
        else if (readingSession.difficulty >= 10)
            basePoints = 80;
        else if (readingSession.difficulty >= 0)
            basePoints = 100;
        const readingSessions = await this.db
            .selectFrom('public.reading_sessions')
            .where('reading_material_id', '=', readingSession.reading_material_id)
            .select(eb => eb.fn.count('id').as('count'))
            .executeTakeFirst();
        const readingSessionsCount = readingSessions.count;
        let numSessionsMultiplier = 0;
        if (readingSessionsCount > 4)
            numSessionsMultiplier = 0.1;
        else if (readingSessionsCount == 3)
            numSessionsMultiplier = 0.25;
        else if (readingSessionsCount == 2)
            numSessionsMultiplier = 0.5;
        else if (readingSessionsCount == 1)
            numSessionsMultiplier = 1;
        const finalScore = basePoints * numSessionsMultiplier +
            totalScore * minigamePerformanceMultiplier;
        const updatedPupil = await this.db
            .updateTable('public.pupils')
            .set({
            level: (0, kysely_1.sql) `level + ${Math.floor(finalScore)}`,
        })
            .where('id', '=', readingSession.pupil_id)
            .returning(['level'])
            .executeTakeFirst();
        const newAchievements = await this.achievementService.addBooksReadAchievement(readingSession.pupil_id);
        const newRecommendations = await this.readingMaterialService.getRecommendedReadingMaterials(userId);
        return {
            achievements: newAchievements,
            recommendations: newRecommendations,
            level: updatedPupil.level,
        };
    }
    async getRandomMinigamesBySessionID(readingSessionID) {
        const readingSession = await this.db
            .selectFrom('public.reading_sessions')
            .selectAll()
            .where('id', '=', readingSessionID)
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Reading session not found'));
        const { reading_material_id: readingMaterialID } = readingSession;
        let randomMinigames = await this.db
            .selectFrom('public.minigames as m')
            .where('m.reading_material_id', '=', readingMaterialID)
            .selectAll('m')
            .orderBy((0, kysely_1.sql) `random()`)
            .execute();
        randomMinigames = this.pickMinigamesNoConsecutiveSameType(randomMinigames);
        await this.createMinigameLogs(randomMinigames, readingSession);
        return randomMinigames;
    }
    async getRandomMinigamesByMaterialID(readingMaterialID) {
        let randomMinigames = await this.db
            .selectFrom('public.minigames as m')
            .where('m.reading_material_id', '=', readingMaterialID)
            .selectAll('m')
            .orderBy('m.part_num')
            .execute();
        randomMinigames = this.pickMinigamesNoConsecutiveSameType(randomMinigames);
        return randomMinigames;
    }
    async createMinigameLogs(minigames, readingSession) {
        let minigameLogs = [];
        for (const m of minigames) {
            minigameLogs.push({
                reading_session_id: readingSession.id,
                minigame_id: m.id,
            });
        }
        minigameLogs = await this.db
            .insertInto('public.minigame_logs')
            .values(minigameLogs)
            .returningAll()
            .execute();
        return minigameLogs;
    }
    pickMinigamesNoConsecutiveSameType(allMinigames) {
        const grouped = {};
        for (const m of allMinigames) {
            if (!grouped[m.part_num])
                grouped[m.part_num] = [];
            grouped[m.part_num].push(m);
        }
        const result = [];
        let prevType;
        const partNums = Object.keys(grouped)
            .map(Number)
            .sort((a, b) => a - b);
        for (const part of partNums) {
            const options = grouped[part];
            let candidates = options.filter(o => o.minigame_type !== prevType);
            if (candidates.length === 0) {
                candidates = options;
            }
            const choice = candidates[Math.floor(Math.random() * candidates.length)];
            result.push(choice);
            prevType = choice.minigame_type;
        }
        return result;
    }
    async getWordsFromLettersMinigame(readingMaterialID) {
        return await this.db
            .selectFrom('public.minigames as m')
            .where('reading_material_id', '=', readingMaterialID)
            .where('minigame_type', '=', 2)
            .selectAll('m')
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('WordsFromLetters minigame not found'));
    }
    async createMinigameLog(minigameType, minigameLogDto) {
        return await this.db
            .insertInto('public.minigame_logs')
            .values({
            minigame_id: minigameLogDto.minigame_id,
            reading_session_id: minigameLogDto.reading_session_id,
            result: minigameLogDto.result,
        })
            .returningAll()
            .executeTakeFirst();
    }
    async updateMinigameLog(minigameType, minigameLogDto) {
        let minigamelog = await this.db
            .selectFrom('public.minigame_logs as ml')
            .where('ml.reading_session_id', '=', minigameLogDto.reading_session_id)
            .where('ml.minigame_id', '=', minigameLogDto.minigame_id)
            .selectAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Minigame log not found.'));
        minigamelog.result = minigameLogDto.result;
        minigamelog = await this.db
            .updateTable('public.minigame_logs as ml')
            .set(minigamelog)
            .where('ml.reading_session_id', '=', minigameLogDto.reading_session_id)
            .where('ml.minigame_id', '=', minigameLogDto.minigame_id)
            .returningAll()
            .executeTakeFirstOrThrow(() => new Error('Updating minigame log failed.'));
        return minigamelog;
    }
    async getLogsByReadingSessionID(readingSessionID) {
        const logs = await this.db
            .selectFrom('public.minigame_logs')
            .where('reading_session_id', '=', readingSessionID)
            .selectAll()
            .execute();
        return logs;
    }
};
exports.MinigamesService = MinigamesService;
exports.MinigamesService = MinigamesService = __decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [kysely_1.Kysely,
        achievements_service_1.AchievementsService,
        reading_materials_service_1.ReadingMaterialsService])
], MinigamesService);
//# sourceMappingURL=minigames.service.js.map