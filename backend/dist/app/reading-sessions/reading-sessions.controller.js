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
exports.ReadingSessionsController = void 0;
const common_1 = require("@nestjs/common");
const reading_sessions_service_1 = require("./reading-sessions.service");
const create_reading_session_dto_1 = require("./dto/create-reading-session.dto");
const update_reading_session_dto_1 = require("./dto/update-reading-session.dto");
const role_guard_1 = require("../auth/role-guard");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../common/dto");
let ReadingSessionsController = class ReadingSessionsController {
    constructor(readingSessionsService) {
        this.readingSessionsService = readingSessionsService;
    }
    async create(createReadingSessionDto) {
        const newSession = await this.readingSessionsService.create(createReadingSessionDto);
        return {
            message: 'Reading session created successfully',
            data: newSession,
        };
    }
    async findAll() {
        const readingSessions = await this.readingSessionsService.findAll();
        return {
            message: 'Reading sessions fetched successfully',
            data: readingSessions,
        };
    }
    async findOne(id) {
        const readingSession = await this.readingSessionsService.findOne(id);
        return {
            message: 'Reading session fetched successfully',
            data: readingSession,
        };
    }
    async update(id, updateReadingSessionDto) {
        const updatedReadingSession = await this.readingSessionsService.update(id, updateReadingSessionDto);
        return {
            message: 'Reading session updated successfully',
            data: updatedReadingSession,
        };
    }
    async remove(id) {
        const deletedReadingSession = await this.readingSessionsService.remove(id);
        return {
            message: 'Reading session updated successfully',
            data: deletedReadingSession,
        };
    }
};
exports.ReadingSessionsController = ReadingSessionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a reading session',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Reading session created successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reading_session_dto_1.CreateReadingSessionDto]),
    __metadata("design:returntype", Promise)
], ReadingSessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all reading sessions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reading sessions fetched successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReadingSessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a reading session by id',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reading session fetched successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReadingSessionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a reading session by id',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reading session updated successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reading_session_dto_1.UpdateReadingSessionDto]),
    __metadata("design:returntype", Promise)
], ReadingSessionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a reading session by id',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reading session deleted successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReadingSessionsController.prototype, "remove", null);
exports.ReadingSessionsController = ReadingSessionsController = __decorate([
    (0, common_1.Controller)('reading-sessions'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), role_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [reading_sessions_service_1.ReadingSessionsService])
], ReadingSessionsController);
//# sourceMappingURL=reading-sessions.controller.js.map