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
exports.ReadingSessionsService = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const request_context_1 = require("../../common/utils/request-context");
const minigames_service_1 = require("../minigames/minigames.service");
let ReadingSessionsService = class ReadingSessionsService {
    constructor(db, minigamesService) {
        this.db = db;
        this.minigamesService = minigamesService;
    }
    async create(createReadingSessionDto) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        const newReadingSession = {
            ...createReadingSessionDto,
            user_id: user.id,
            started_at: new Date(),
        };
        if (user.role === 'Pupil') {
            newReadingSession.pupil_id = user.pupil.id;
        }
        const readingSession = await this.db
            .insertInto('public.reading_sessions')
            .values(newReadingSession)
            .returningAll()
            .executeTakeFirst();
        var minigames = [];
        minigames = await this.minigamesService.getRandomMinigamesBySessionID(readingSession.id);
        return { ...readingSession, minigames: minigames };
    }
    async findAll() {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        return await this.db
            .selectFrom('public.reading_sessions')
            .where('user_id', '=', user.id)
            .selectAll()
            .execute();
    }
    async findOne(id) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        const readingSession = await this.db
            .selectFrom('public.reading_sessions as rs')
            .selectAll()
            .where('rs.user_id', '=', user.id)
            .where('rs.id', '=', id)
            .groupBy('rs.id')
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Reading session with id ${id} not found`));
        const logs = await this.db
            .selectFrom('public.minigame_logs as ml')
            .where('ml.reading_session_id', '=', id)
            .select(['id', 'minigame_id', 'result'])
            .execute();
        const minigameIds = logs.map(l => l.minigame_id);
        const minigames = await this.db
            .selectFrom('public.minigames')
            .where('id', 'in', minigameIds)
            .orderBy('part_num')
            .selectAll()
            .execute();
        return { ...readingSession, minigame_logs: logs, minigames: minigames };
    }
    async update(id, updateReadingSessionDto) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        return await this.db
            .updateTable('public.reading_sessions')
            .set(updateReadingSessionDto)
            .where('id', '=', id)
            .where('user_id', '=', user.id)
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Reading session with id ${id} not found`));
    }
    async remove(id) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        return await this.db
            .deleteFrom('public.reading_sessions')
            .where('id', '=', id)
            .where('user_id', '=', user.id)
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Reading session with id ${id} not found`));
    }
};
exports.ReadingSessionsService = ReadingSessionsService;
exports.ReadingSessionsService = ReadingSessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [kysely_1.Kysely,
        minigames_service_1.MinigamesService])
], ReadingSessionsService);
//# sourceMappingURL=reading-sessions.service.js.map