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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const pupils_service_1 = require("../pupils/pupils.service");
const achievements_service_1 = require("../achievements/achievements.service");
let UserService = class UserService {
    constructor(db, pupilService, achievementService) {
        this.db = db;
        this.pupilService = pupilService;
        this.achievementService = achievementService;
    }
    async updateLoginStreak(user_id) {
        const pupil = await this.pupilService.getPupilProfile(user_id);
        let loginStreak = await this.db
            .selectFrom('authentication.login_streaks')
            .where('user_id', '=', user_id)
            .selectAll()
            .executeTakeFirst();
        if (!loginStreak) {
            loginStreak = await this.db
                .insertInto('authentication.login_streaks')
                .values({
                user_id: user_id,
                current_streak: 1,
                longest_streak: 1,
                last_login_date: new Date(),
            })
                .returningAll()
                .executeTakeFirst();
        }
        else {
            const daysSinceLastLogin = Math.floor((new Date().getTime() -
                new Date(loginStreak.last_login_date).getTime()) /
                (1000 * 60 * 60 * 24));
            let newCurrentStreak = loginStreak.current_streak;
            let newLongestStreak = loginStreak.longest_streak;
            if (daysSinceLastLogin === 1) {
                newCurrentStreak += 1;
                if (newCurrentStreak > newLongestStreak) {
                    newLongestStreak = newCurrentStreak;
                }
            }
            else if (daysSinceLastLogin > 1) {
                newCurrentStreak = 1;
            }
            else {
                return loginStreak;
            }
            loginStreak = await this.db
                .updateTable('authentication.login_streaks')
                .set({
                current_streak: newCurrentStreak,
                longest_streak: newLongestStreak,
                last_login_date: new Date(),
            })
                .where('id', '=', loginStreak.id)
                .returningAll()
                .executeTakeFirst();
        }
        await this.achievementService.addLoginAchievement(pupil.id);
        return loginStreak;
    }
    async getLoginStreak(user_id) {
        const loginStreak = await this.db
            .selectFrom('authentication.login_streaks')
            .where('user_id', '=', user_id)
            .selectAll()
            .executeTakeFirst();
        if (!loginStreak) {
            throw new common_1.NotFoundException('Login streak not found');
        }
        return loginStreak;
    }
    async searchUsersByRole(query, role) {
        const usersInRole = await this.getUsersByRole(role);
        query = query.toLowerCase();
        const filteredUsers = usersInRole.filter(user => {
            const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
            return (user.first_name.toLowerCase().includes(query) ||
                user.last_name.toLowerCase().includes(query) ||
                fullName.includes(query) ||
                user.email.toLowerCase().includes(query));
        });
        return filteredUsers;
    }
    async getUsersByRole(role) {
        const users = await this.db
            .selectFrom('authentication.users as u')
            .leftJoin('authentication.user_roles as ur', 'u.id', 'ur.user_id')
            .leftJoin('authentication.roles as r', 'ur.role_id', 'r.id')
            .where('r.name', '=', role)
            .where('u.is_deleted', '=', false)
            .select([
            'u.id',
            'u.email',
            'u.first_name',
            'u.last_name',
            'u.created_at',
            'u.updated_at',
            (0, kysely_1.sql) `r.name`.as('role'),
        ])
            .execute();
        return users;
    }
    async createSession(user_id) {
        const newSession = await this.db
            .insertInto('authentication.sessions')
            .values({
            user_id: user_id,
            created_at: new Date(),
            duration: 0,
        })
            .returningAll()
            .executeTakeFirst();
        await this.updateLoginStreak(user_id);
        return newSession;
    }
    async endSession(id, sessionId) {
        const session = await this.db
            .selectFrom('authentication.sessions')
            .where('id', '=', sessionId)
            .selectAll()
            .executeTakeFirstOrThrow(() => {
            throw new common_1.NotFoundException('Session not found.');
        });
        if (session.end_at) {
            throw new common_1.BadRequestException('Session already ended.');
        }
        const durationOfSession = Math.floor((new Date().getTime() - new Date(session.created_at).getTime()) /
            (1000 * 60));
        const endedSession = await this.db
            .updateTable('authentication.sessions')
            .set({
            duration: durationOfSession,
            end_at: new Date(),
        })
            .where('id', '=', sessionId)
            .returningAll()
            .executeTakeFirst();
        return endedSession;
    }
    async getTotalSessions(user_id) {
        const session = await this.db
            .selectFrom('authentication.sessions')
            .where('user_id', '=', user_id)
            .select((0, kysely_1.sql) `Sum(duration)`.as('number'))
            .executeTakeFirst();
        return session;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [kysely_1.Kysely,
        pupils_service_1.PupilsService,
        achievements_service_1.AchievementsService])
], UserService);
//# sourceMappingURL=user.service.js.map