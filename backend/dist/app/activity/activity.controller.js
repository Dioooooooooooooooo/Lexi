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
exports.ActivityController = void 0;
const common_1 = require("@nestjs/common");
const create_activity_dto_1 = require("./dto/create-activity.dto");
const dto_1 = require("../../common/dto");
const activity_service_1 = require("./activity.service");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const role_guard_1 = require("../auth/role-guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const update_activity_dto_1 = require("./dto/update-activity.dto");
let ActivityController = class ActivityController {
    constructor(activityService) {
        this.activityService = activityService;
    }
    async create(classroomId, createActivityDTO) {
        const data = await this.activityService.create(createActivityDTO, classroomId);
        return { message: 'Activity created', data };
    }
    async findOne(classroomId, activityId) {
        const data = await this.activityService.findOne(activityId);
        return { message: 'Activity successfully fetched', data };
    }
    async findAllByClassroomId(classroomId) {
        const data = await this.activityService.findAllByClassroomId(classroomId);
        return { message: 'Activies of classroom successfull fetched', data };
    }
    async update(classroomId, activityId, updateActivityDTO) {
        const data = await this.activityService.update(activityId, updateActivityDTO);
        return { message: 'Activity successfully updated', data };
    }
    async remove(classroomId, activityId) {
        const data = await this.activityService.remove(activityId);
        return { message: 'Activity successfully deleted', data };
    }
};
exports.ActivityController = ActivityController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create Activity',
    }),
    (0, roles_decorator_1.Roles)(['Teacher']),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Activity created successfully',
        type: dto_1.SuccessResponseDto,
    }),
    (0, swagger_1.ApiParam)({ name: 'classroomId', required: true, type: String }),
    __param(0, (0, common_1.Param)('classroomId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_activity_dto_1.CreateActivityDTO]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':activityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Activity by id' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Activity fetched successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('classroomId')),
    __param(1, (0, common_1.Param)('activityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all Activities by Classroom' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Activities of classroom fetched successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('classroomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "findAllByClassroomId", null);
__decorate([
    (0, common_1.Patch)(':activityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Activity' }),
    (0, roles_decorator_1.Roles)(['Teacher']),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Activity updated successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('classroomId')),
    __param(1, (0, common_1.Param)('activityId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_activity_dto_1.UpdateActivityDTO]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':activityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Activity' }),
    (0, roles_decorator_1.Roles)(['Teacher']),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Activity deleted successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('classroomId')),
    __param(1, (0, common_1.Param)('activityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "remove", null);
exports.ActivityController = ActivityController = __decorate([
    (0, swagger_1.ApiTags)('Activities'),
    (0, common_1.Controller)('classrooms/:classroomId/activity'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), role_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [activity_service_1.ActivityService])
], ActivityController);
//# sourceMappingURL=activity.controller.js.map