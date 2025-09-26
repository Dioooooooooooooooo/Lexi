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
exports.ActivityLogsService = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const activity_service_1 = require("../activity/activity.service");
let ActivityLogsService = class ActivityLogsService {
    constructor(db, activityService) {
        this.db = db;
        this.activityService = activityService;
    }
    async create(createActivityLogDto, activityId) {
        const activityLog = {
            activity_id: activityId,
            ...createActivityLogDto,
            completed_at: new Date(),
        };
        const data = await this.db
            .insertInto("public.activity_logs")
            .values(activityLog)
            .returningAll()
            .executeTakeFirst();
        return data;
    }
    async findOne(activityId) {
        const data = await this.db
            .selectFrom("public.activity_logs")
            .where("id", "=", activityId)
            .selectAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Activity with id ${activityId} not found`));
        return data;
    }
    async findAll(classroomId) {
        const activitiesClassroom = await this.activityService.findAllByClassroomId(classroomId);
        const activityIds = activitiesClassroom.map(a => a.id);
        if (activityIds.length === 0) {
            return [];
        }
        const data = await this.db
            .selectFrom("public.activity_logs")
            .selectAll()
            .where("activity_id", "in", activityIds)
            .execute();
        return data;
    }
    update(id, updateActivityLogDto) {
        return `This action updates a #${id} activityLog`;
    }
    remove(id) {
        return `This action removes a #${id} activityLog`;
    }
};
exports.ActivityLogsService = ActivityLogsService;
exports.ActivityLogsService = ActivityLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DATABASE")),
    __metadata("design:paramtypes", [kysely_1.Kysely,
        activity_service_1.ActivityService])
], ActivityLogsService);
//# sourceMappingURL=activity-logs.service.js.map