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
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
const request_context_1 = require("../../common/utils/request-context");
const classrooms_service_1 = require("../classrooms/classrooms.service");
let ActivityService = class ActivityService {
    constructor(db, classroomService) {
        this.db = db;
        this.classroomService = classroomService;
    }
    async create(createActivityDTO, classroomId) {
        const newActivity = {
            ...createActivityDTO,
            classroom_id: classroomId,
        };
        const activity = await this.db
            .insertInto("public.activities")
            .values(newActivity)
            .returningAll()
            .executeTakeFirst();
        return activity;
    }
    async findAllByClassroomId(classroomId) {
        const activities = await this.db
            .selectFrom("public.activities")
            .where("classroom_id", "=", classroomId)
            .selectAll()
            .execute();
        return activities;
    }
    async findOne(activityId) {
        const activity = await this.db
            .selectFrom("public.activities as a")
            .where("a.id", "=", activityId)
            .selectAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Activity with id ${activityId} not found`));
        return activity;
    }
    async update(activityId, updateActivityDTO) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req["user"];
        const activity = await this.db
            .updateTable("public.activities as a")
            .set(updateActivityDTO)
            .where("a.id", "=", activityId)
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Activity with ${activityId} not found`));
        return activity;
    }
    async remove(activityId) {
        const activity = await this.db
            .deleteFrom("public.activities")
            .where("id", "=", activityId)
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException(`Activity with ${activityId} not found`));
        return activity;
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DATABASE")),
    __metadata("design:paramtypes", [kysely_1.Kysely,
        classrooms_service_1.ClassroomsService])
], ActivityService);
//# sourceMappingURL=activity.service.js.map