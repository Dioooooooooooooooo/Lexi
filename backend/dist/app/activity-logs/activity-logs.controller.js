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
exports.ActivityLogsController = void 0;
const common_1 = require("@nestjs/common");
const activity_logs_service_1 = require("./activity-logs.service");
const create_activity_log_dto_1 = require("./dto/create-activity-log.dto");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const role_guard_1 = require("../auth/role-guard");
const dto_1 = require("../../common/dto");
let ActivityLogsController = class ActivityLogsController {
    constructor(activityLogsService) {
        this.activityLogsService = activityLogsService;
    }
    async create(activityId, createActivityLogDto) {
        const data = await this.activityLogsService.create(createActivityLogDto, activityId);
        return { message: 'Added Reading Material Log successfully', data };
    }
    async findOne(activityId) {
        const data = await this.activityLogsService.findOne(activityId);
        return {
            message: 'Activity logs for activity fetched successfully',
            data,
        };
    }
    async findAll(activityId, classroomId) {
        const data = await this.activityLogsService.findAll(classroomId);
        return {
            message: 'Activity logs for classroom fetched successfully',
            data,
        };
    }
};
exports.ActivityLogsController = ActivityLogsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create Activity Log' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Activity Log created successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('activityId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_activity_log_dto_1.CreateActivityLogDto]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get an Activity's Activity Logs" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Activity logs for activity fetched successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('activityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('classroom/:classroomId/activity-logs'),
    (0, swagger_1.ApiOperation)({ summary: "Get all Classroom Acitivies' Activity Log" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Activity logs for classroom fetched successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('activityId')),
    __param(1, (0, common_1.Param)('classroomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "findAll", null);
exports.ActivityLogsController = ActivityLogsController = __decorate([
    (0, swagger_1.ApiTags)('ActivityLogs'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), role_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, roles_decorator_1.Roles)(['Teacher']),
    (0, common_1.Controller)('classroom/activity-logs/:activityId'),
    __metadata("design:paramtypes", [activity_logs_service_1.ActivityLogsService])
], ActivityLogsController);
//# sourceMappingURL=activity-logs.controller.js.map