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
exports.AchievementsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../common/dto");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const role_guard_1 = require("../auth/role-guard");
const pupils_service_1 = require("../pupils/pupils.service");
const achievements_service_1 = require("./achievements.service");
let AchievementsController = class AchievementsController {
    constructor(achievementsService, pupilsService) {
        this.achievementsService = achievementsService;
        this.pupilsService = pupilsService;
    }
    async getPupilAchievements(req) {
        if (req.user.role !== 'Pupil') {
            return { message: 'User achievements successfully fetched', data: [] };
        }
        const pupil = await this.pupilsService.getPupilProfile(req.user.id);
        const data = await this.achievementsService.getUserAchievements(pupil.id);
        return { message: 'Successfully fetched pupil achievement', data };
    }
    async addPupilAchievement(pupilId, achievementName) {
        const data = await this.achievementsService.awardAchievementByName(pupilId, achievementName);
        return { message: 'Successfully added pupil achievement.', data };
    }
    async getPupilAchievementsById(pupilId) {
        const data = await this.achievementsService.getUserAchievements(pupilId);
        return { message: 'Successfully fetched pupil achievements', data };
    }
    async removePupilAchievement(pupilId, achievementId) {
        const data = await this.achievementsService.removePupilAchievement(pupilId, achievementId);
        return { message: 'Achievement removed from pupil successfully', data };
    }
    async remove(id) {
        const data = await this.achievementsService.remove(id);
        return { message: 'Achievement successfully deleted', data };
    }
};
exports.AchievementsController = AchievementsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get pupil achievements',
    }),
    (0, roles_decorator_1.Roles)(['Pupil']),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pupil achievements fetched successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getPupilAchievements", null);
__decorate([
    (0, common_1.Post)('pupil/:pupilId/achievement/:achievementName'),
    (0, swagger_1.ApiOperation)({
        summary: 'Add pupil achievement',
    }),
    (0, roles_decorator_1.Roles)(['Teacher']),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Pupil achievement added successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('pupilId')),
    __param(1, (0, common_1.Param)('achievementName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "addPupilAchievement", null);
__decorate([
    (0, common_1.Get)('pupils/:pupilId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get achievements for specific pupil (admin/testing)',
    }),
    (0, roles_decorator_1.Roles)(['Teacher', 'Pupil']),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pupil achievements fetched successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('pupilId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getPupilAchievementsById", null);
__decorate([
    (0, common_1.Delete)('pupils/:pupilId/achievements/:achievementId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove specific achievement from specific pupil',
    }),
    (0, roles_decorator_1.Roles)(['Teacher']),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Achievement removed from pupil successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('pupilId')),
    __param(1, (0, common_1.Param)('achievementId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "removePupilAchievement", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete achievement by id (safety measure)',
    }),
    (0, roles_decorator_1.Roles)(['Teacher', 'Pupil']),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Achievement deleted successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "remove", null);
exports.AchievementsController = AchievementsController = __decorate([
    (0, common_1.Controller)('achievements'),
    (0, swagger_1.ApiTags)('Achievements'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), role_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [achievements_service_1.AchievementsService,
        pupils_service_1.PupilsService])
], AchievementsController);
//# sourceMappingURL=achievements.controller.js.map