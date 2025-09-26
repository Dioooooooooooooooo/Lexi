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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../common/dto");
const role_guard_1 = require("../auth/role-guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async updateLoginStreak(req) {
        const loginStreak = await this.userService.updateLoginStreak(req.user.id);
        return { message: 'Login streak updated successfully', data: loginStreak };
    }
    async getLoginStreak(req) {
        const loginStreak = await this.userService.getLoginStreak(req.user.id);
        return { message: 'Login streak fetched successfully', data: loginStreak };
    }
    async createSession(req) {
        const session = await this.userService.createSession(req.user.id);
        return { message: 'Session created successfully', data: session };
    }
    async endSession(req, sessionId) {
        const session = await this.userService.endSession(req.user.id, sessionId);
        return { message: 'Session ended successfully', data: session };
    }
    async getTotalSessions(req) {
        const session = await this.userService.getTotalSessions(req.user.id);
        return { message: 'Total sessions fetched successfully', data: session };
    }
    async searchUsers(query, role) {
        if (!query || query.trim() === '') {
            throw new common_1.BadRequestException('Search query cannot be empty.');
        }
        if (!role || role.trim() === '') {
            throw new common_1.BadRequestException('Role cannot be empty.');
        }
        const users = await this.userService.searchUsersByRole(query, role);
        if (!users || users.length === 0) {
            return { message: 'No users found.', data: [] };
        }
        return { message: 'Users fetched successfully.', data: users };
    }
};
exports.UserController = UserController;
__decorate([
    (0, roles_decorator_1.Roles)(['Pupil']),
    (0, common_1.Put)('me/streak'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user login streak',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login streak updated successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateLoginStreak", null);
__decorate([
    (0, roles_decorator_1.Roles)(['Pupil']),
    (0, common_1.Get)('me/streak'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user login streak',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login streak fetched successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getLoginStreak", null);
__decorate([
    (0, common_1.Post)('me/sessions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new user session',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Session created successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createSession", null);
__decorate([
    (0, common_1.Put)('me/sessions/:sessionId'),
    (0, swagger_1.ApiOperation)({
        summary: 'End a user session',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Session ended successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "endSession", null);
__decorate([
    (0, common_1.Get)('me/sessions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get total user sessions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Total sessions fetched successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTotalSessions", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({
        summary: 'Search users by name and role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Users fetched successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchUsers", null);
exports.UserController = UserController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), role_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map