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
exports.PupilsController = void 0;
const common_1 = require("@nestjs/common");
const pupils_service_1 = require("./pupils.service");
const update_pupil_profile_dto_1 = require("./dto/update-pupil-profile.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../common/dto");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const role_guard_1 = require("../auth/role-guard");
let PupilsController = class PupilsController {
    constructor(pupilsService) {
        this.pupilsService = pupilsService;
    }
    async getPupilProfile(req) {
        const data = await this.pupilsService.getPupilProfile(req.user.id);
        return { message: "Pupil profile successfully fetched", data };
    }
    async updatePupilProfile(req, updatePupilDto) {
        const data = await this.pupilsService.updatePupilProfile(req.user.id, updatePupilDto);
        return { message: "Pupil profile successfully updated", data };
    }
    async getPupilByUsername(username) {
        const data = await this.pupilsService.getPupilByUsername(username);
        return {
            message: "successfully fetched pupil leaderboard",
            data,
        };
    }
    async getGlobalPupilLeaderboard() {
        const data = await this.pupilsService.getGlobalPupilLeaderboard();
        return {
            message: "Global pupil leaderboard successfully fetched",
            data,
        };
    }
    async getPupilLeaderBoardByPupilId(pupilId) {
        const data = await this.pupilsService.getPupilLeaderBoardByPupilId(pupilId);
        return {
            message: "Pupil successfully fetched",
            data,
        };
    }
};
exports.PupilsController = PupilsController;
__decorate([
    (0, common_1.Get)("me"),
    (0, swagger_1.ApiOperation)({
        summary: "Get user pupil profile",
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Pupil profile successfully fetched",
        type: dto_1.SuccessResponseDto,
        example: {
            message: "Pupil profile successfully fetched",
            data: {
                age: 10,
                grade_level: 6,
                level: 20,
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Invalid credentials",
        type: dto_1.ErrorResponseDto,
        example: {
            message: "Invalid credentials",
            error: "Unauthorized",
        },
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PupilsController.prototype, "getPupilProfile", null);
__decorate([
    (0, common_1.Patch)("me"),
    (0, swagger_1.ApiOperation)({
        summary: "Update user pupil profile",
    }),
    (0, swagger_1.ApiBody)({
        type: update_pupil_profile_dto_1.UpdatePupilProfileDto,
        description: "Pupil profile update data",
        examples: {
            example1: {
                summary: "Example update",
                description: "A sample pupil profile update",
                value: {
                    age: 12,
                    grade_level: 7,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Pupil profile successfully updated",
        type: dto_1.SuccessResponseDto,
        example: {
            message: "Pupil profile successfully updated",
            data: {
                age: 10,
                grade_level: 6,
                level: 20,
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Invalid credentials",
        type: dto_1.ErrorResponseDto,
        example: {
            message: "Invalid credentials",
            error: "Unauthorized",
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_pupil_profile_dto_1.UpdatePupilProfileDto]),
    __metadata("design:returntype", Promise)
], PupilsController.prototype, "updatePupilProfile", null);
__decorate([
    (0, common_1.Get)(":username"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, swagger_1.ApiOperation)({
        summary: "Get public pupil profile",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Pupil profile successfully fetched",
        type: dto_1.SuccessResponseDto,
        example: {
            message: "Profile successfully fetched",
            data: {
                user: {
                    id: "420eafa8-5fb9-430d-bdd5-04806c52973c",
                    first_name: "John",
                    last_name: "Doe",
                    avatar: "https://example.com",
                    username: "johndoes",
                },
                pupil: {
                    id: "dfc1c188-409c-4eeb-995f-2836e84f2132",
                    age: 12,
                    grade_level: 6,
                    level: 30,
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Invalid credentials",
        type: dto_1.ErrorResponseDto,
        example: {
            message: "Invalid credentials",
            error: "Unauthorized",
        },
    }),
    __param(0, (0, common_1.Param)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PupilsController.prototype, "getPupilByUsername", null);
__decorate([
    (0, common_1.Get)("leaderboard"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, swagger_1.ApiOperation)({
        summary: "Get global pupil leaderboard",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Global pupil leaderboard successfully fetched",
        type: dto_1.SuccessResponseDto,
        example: {
            message: "Global pupil leaderboard successfully fetched",
            data: {},
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Invalid credentials",
        type: dto_1.ErrorResponseDto,
        example: {
            message: "Invalid credentials",
            error: "Unauthorized",
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PupilsController.prototype, "getGlobalPupilLeaderboard", null);
__decorate([
    (0, common_1.Get)("leaderboard/:pupilId"),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Pupil leaderboard successfully fetched",
        type: dto_1.SuccessResponseDto,
        example: {
            message: "Global pupil leaderboard successfully fetched",
            data: {},
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Invalid credentials",
        type: dto_1.ErrorResponseDto,
        example: {
            message: "Invalid credentials",
            error: "Unauthorized",
        },
    }),
    __param(0, (0, common_1.Param)('pupilId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PupilsController.prototype, "getPupilLeaderBoardByPupilId", null);
exports.PupilsController = PupilsController = __decorate([
    (0, common_1.Controller)("pupils"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), role_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, roles_decorator_1.Roles)(["Pupil"]),
    __metadata("design:paramtypes", [pupils_service_1.PupilsService])
], PupilsController);
//# sourceMappingURL=pupils.controller.js.map