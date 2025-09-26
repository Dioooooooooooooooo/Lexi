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
exports.AchievementsService = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
let AchievementsService = class AchievementsService {
    constructor(db) {
        this.db = db;
    }
    async create(createAchievementDto) {
        const newAchievement = {
            name: createAchievementDto.name,
            description: createAchievementDto.description,
            badge: createAchievementDto.badge || null,
            created_at: new Date(),
        };
        const achievement = await this.db
            .insertInto('public.achievements')
            .values(newAchievement)
            .returningAll()
            .executeTakeFirst();
        return achievement;
    }
    async findAll() {
        return await this.db
            .selectFrom('public.achievements')
            .selectAll()
            .execute();
    }
    async findOne(id) {
        return await this.db
            .selectFrom('public.achievements')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Achievement with id ${id} not found`));
    }
    async update(id, updateAchievementDto) {
        const achievement = await this.db
            .updateTable('public.achievements')
            .set(updateAchievementDto)
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Achievement with id ${id} not found`));
        return achievement;
    }
    async remove(id) {
        const achievement = await this.db
            .deleteFrom('public.achievements')
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Achievement with id ${id} not found`));
        return achievement;
    }
    async getUserAchievements(pupilId) {
        return await this.db
            .selectFrom('public.pupil_achievements as pa')
            .innerJoin('public.achievements', 'public.achievements.id', 'pa.achievement_id')
            .where('pa.pupil_id', '=', pupilId)
            .select([
            'public.achievements.id',
            'public.achievements.name',
            'public.achievements.description',
            'public.achievements.badge',
            'public.achievements.created_at',
        ])
            .execute();
    }
    async awardAchievementToUser(pupilId, achievementId) {
        await this.findOne(achievementId);
        const existingAward = await this.db
            .selectFrom('public.pupil_achievements')
            .where('pupil_id', '=', pupilId)
            .where('achievement_id', '=', achievementId)
            .selectAll()
            .executeTakeFirst();
        if (existingAward) {
            throw new common_1.NotFoundException(`User already has this achievement`);
        }
        const newPupilAchievement = {
            pupil_id: pupilId,
            achievement_id: achievementId,
        };
        return await this.db
            .insertInto('public.pupil_achievements')
            .values(newPupilAchievement)
            .returningAll()
            .executeTakeFirst();
    }
    async awardAchievementByName(pupilId, achievementName) {
        const achievement = await this.db
            .selectFrom('public.achievements')
            .where('name', '=', achievementName)
            .selectAll()
            .executeTakeFirst();
        if (!achievement) {
            throw new common_1.NotFoundException(`Achievement with name '${achievementName}' not found`);
        }
        return await this.awardAchievementToUser(pupilId, achievement.id);
    }
    async hasAchievement(pupilId, achievementName) {
        return ((await this.db
            .selectFrom('public.pupil_achievements')
            .innerJoin('public.achievements', 'public.achievements.id', 'public.pupil_achievements.achievement_id')
            .where('public.pupil_achievements.pupil_id', '=', pupilId)
            .where('public.achievements.name', '=', achievementName)
            .selectAll()
            .executeTakeFirst()) || null);
    }
    async addLoginAchievement(pupilId) {
        const achievementMilestones = new Map([
            [3, 'Getting Started'],
            [7, 'One Week Wonder'],
            [14, 'Consistency Champ'],
            [30, 'Committed Learner'],
            [180, 'Half-Year Hero'],
        ]);
        const pupil = await this.db
            .selectFrom('public.pupils')
            .where('id', '=', pupilId)
            .select('user_id')
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Pupil ${pupilId} not found.`));
        const streak = await this.db
            .selectFrom('authentication.login_streaks as ls')
            .where('ls.user_id', '=', pupil.user_id)
            .select('ls.longest_streak')
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Login streak for pupil ${pupilId} not available.`));
        const longestStreak = streak.longest_streak;
        const addedAchievements = [];
        for (const [milestone, achievementName] of achievementMilestones) {
            if (longestStreak >= milestone) {
                const existing = await this.hasAchievement(pupilId, achievementName);
                if (!existing) {
                    const achievement = await this.db
                        .selectFrom('public.achievements')
                        .where('name', '=', achievementName)
                        .selectAll()
                        .executeTakeFirst();
                    if (achievement) {
                        const pupilAchievement = await this.awardAchievementToUser(pupilId, achievement.id);
                        addedAchievements.push(pupilAchievement);
                    }
                }
            }
        }
        return addedAchievements;
    }
    async addBooksReadAchievement(pupilId) {
        const achievementMilestones = new Map([
            [3, 'Page Turner'],
            [5, 'Avid Reader'],
            [10, 'Story Seeker'],
            [20, 'Book Explorer'],
            [30, 'Book Master'],
        ]);
        const booksRead = await this.db
            .selectFrom('public.reading_sessions')
            .where('pupil_id', '=', pupilId)
            .where('completion_percentage', '=', 100)
            .select('reading_material_id')
            .distinct()
            .execute();
        const booksReadCount = booksRead.length;
        const addedAchievements = [];
        for (const [milestone, achievementName] of achievementMilestones) {
            if (booksReadCount >= milestone) {
                const existing = await this.hasAchievement(pupilId, achievementName);
                if (!existing) {
                    const achievement = await this.db
                        .selectFrom('public.achievements')
                        .where('name', '=', achievementName)
                        .selectAll()
                        .executeTakeFirst();
                    if (achievement) {
                        const pupilAchievement = await this.awardAchievementToUser(pupilId, achievement.id);
                        addedAchievements.push(pupilAchievement);
                    }
                }
            }
        }
        return addedAchievements;
    }
    async removePupilAchievement(pupilId, achievementId) {
        const deletedAchievement = await this.db
            .deleteFrom('public.pupil_achievements')
            .where('pupil_id', '=', pupilId)
            .where('achievement_id', '=', achievementId)
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Achievement not found for this pupil or already removed`));
        return deletedAchievement;
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [kysely_1.Kysely])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map