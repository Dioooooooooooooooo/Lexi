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
exports.PupilsService = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
let PupilsService = class PupilsService {
    constructor(db) {
        this.db = db;
    }
    async getPupilProfile(userId) {
        return await this.db
            .selectFrom('public.pupils as p')
            .where('p.user_id', '=', userId)
            .selectAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Pupil not found'));
    }
    async updatePupilProfile(userId, updatePupilProfileDto) {
        return await this.db
            .updateTable('public.pupils as p')
            .set(updatePupilProfileDto)
            .where('p.user_id', '=', userId)
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Pupil not found'));
    }
    async getPupilByUsername(username) {
        const result = await this.db
            .selectFrom('authentication.users as u')
            .innerJoin('public.pupils as p', 'p.user_id', 'u.id')
            .where('u.username', '=', username)
            .where('u.is_deleted', '=', false)
            .select([
            'u.id as user_id',
            'u.first_name',
            'u.last_name',
            'u.avatar',
            'u.username',
            'p.id as pupil_id',
            'p.age',
            'p.grade_level',
            'p.level',
        ])
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Pupil not found'));
        const { user_id, first_name, last_name, avatar, username: uname, pupil_id, age, grade_level, level, } = result;
        return {
            message: 'Pupil successfully fetched',
            data: {
                user: {
                    id: user_id,
                    first_name,
                    last_name,
                    avatar,
                    username: uname,
                },
                pupil: {
                    id: pupil_id,
                    age,
                    grade_level,
                    level,
                },
            },
        };
    }
    async getGlobalPupilLeaderboard() {
        return await this.db
            .selectFrom('public.pupil_leaderboard')
            .selectAll()
            .orderBy('level', 'desc')
            .limit(10)
            .execute();
    }
    async getPupilLeaderBoardByPupilId(pupilId) {
        return await this.db
            .selectFrom('public.pupil_leaderboard')
            .selectAll()
            .where('pupil_id', '=', pupilId)
            .orderBy('level', 'desc')
            .execute();
    }
};
exports.PupilsService = PupilsService;
exports.PupilsService = PupilsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [kysely_1.Kysely])
], PupilsService);
//# sourceMappingURL=pupils.service.js.map