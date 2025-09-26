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
exports.MinigamesController = void 0;
const common_1 = require("@nestjs/common");
const minigames_service_1 = require("./minigames.service");
const create_minigame_dto_1 = require("./dto/create-minigame.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const schemas_1 = require("../../database/schemas");
const create_minigame_log_dto_1 = require("./dto/create-minigame-log.dto");
const dto_1 = require("../../common/dto");
const role_guard_1 = require("../auth/role-guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const update_minigame_log_dto_1 = require("./dto/update-minigame-log.dto");
let MinigamesController = class MinigamesController {
    constructor(minigamesService) {
        this.minigamesService = minigamesService;
    }
    async createWFLMinigame(request) {
        const minigame = await this.minigamesService.createMinigame(schemas_1.MinigameType.WordsFromLetters, request);
        return {
            message: 'Words from letters successfully created.',
            data: minigame,
        };
    }
    async createChoicesMinigame(request) {
        const minigame = await this.minigamesService.createMinigame(schemas_1.MinigameType.Choices, request);
        return {
            message: 'Choices successfully created.',
            data: minigame,
        };
    }
    async createSRMinigame(request) {
        const minigame = await this.minigamesService.createMinigame(schemas_1.MinigameType.SentenceRearrangement, request);
        return {
            message: 'Sentence Rearrangement successfully created.',
            data: minigame,
        };
    }
    async findMinigamesByMaterialID(readingMaterialID) {
        const randomMinigames = await this.minigamesService.getRandomMinigamesByMaterialID(readingMaterialID);
        return {
            message: 'Random minigames successfully fetched',
            data: randomMinigames,
        };
    }
    async findMinigamelogsByReadingSessionID(readingSessionId) {
        const minigameLogs = await this.minigamesService.getLogsByReadingSessionID(readingSessionId);
        return {
            message: 'Minigame logs for reading session successfully fetched.',
            data: minigameLogs,
        };
    }
    async createSentenceRearrangementLog(minigameLogDto) {
        const minigamelog = await this.minigamesService.createMinigameLog(schemas_1.MinigameType.SentenceRearrangement, minigameLogDto);
        return {
            message: 'Sentence Rearrangement Log successfully created.',
            data: minigamelog,
        };
    }
    async updateSentenceRearrangementLog(minigameLogDto) {
        const minigamelog = await this.minigamesService.updateMinigameLog(schemas_1.MinigameType.SentenceRearrangement, minigameLogDto);
        return {
            message: 'Sentence Rearrangement Log updated successfully.',
            data: minigamelog,
        };
    }
    async createChoicesLog(minigameLogDto) {
        const minigamelog = await this.minigamesService.createMinigameLog(schemas_1.MinigameType.Choices, minigameLogDto);
        return {
            message: 'Choices log successfully created.',
            data: minigamelog,
        };
    }
    async updateChoicesLog(minigameLogDto) {
        const minigamelog = await this.minigamesService.updateMinigameLog(schemas_1.MinigameType.Choices, minigameLogDto);
        return {
            message: 'Choices Log updated successfully.',
            data: minigamelog,
        };
    }
    async createWordsFromLettersLog(minigameLogDto) {
        const minigamelog = await this.minigamesService.createMinigameLog(schemas_1.MinigameType.WordsFromLetters, minigameLogDto);
        return {
            message: 'Words From Letters log successfully created.',
            data: minigamelog,
        };
    }
    async updateWordsFromLettersLog(minigameLogDto) {
        const minigamelog = await this.minigamesService.updateMinigameLog(schemas_1.MinigameType.WordsFromLetters, minigameLogDto);
        return {
            message: 'WordsFromLetters Log updated successfully.',
            data: minigamelog,
        };
    }
    async findMinigamesBySessionID(readingSessionID) {
        const minigames = await this.minigamesService.getAssignedMinigamesBySessionID(readingSessionID);
        return {
            message: 'Minigames successfully fetched',
            data: minigames,
        };
    }
    async findRandomMinigamesBySessionID(readingSessionID) {
        const minigames = await this.minigamesService.getRandomMinigamesBySessionID(readingSessionID);
        return {
            message: 'Minigames successfully fetched',
            data: minigames,
        };
    }
    async findWordsFromLettersMinigame(readingMaterialID) {
        const minigame = await this.minigamesService.getWordsFromLettersMinigame(readingMaterialID);
        return {
            message: 'Words from Letters successfully fetched',
            data: minigame,
        };
    }
    async getMinigamesCompletion(readingSessionID, req) {
        console.log('recommendations for user:', req.user.id);
        const sessionComplete = await this.minigamesService.createMinigamesCompletion(readingSessionID, req.user.id);
        return {
            message: 'Reading session successfully completed.',
            data: sessionComplete,
        };
    }
};
exports.MinigamesController = MinigamesController;
__decorate([
    (0, roles_decorator_1.Roles)(['Teacher']),
    (0, common_1.Post)('wordsFromLetters'),
    (0, swagger_1.ApiOperation)({ summary: 'Create WFL minigame' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Words From Letters minigame created successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_minigame_dto_1.CreateWordsFromLettersGame]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "createWFLMinigame", null);
__decorate([
    (0, roles_decorator_1.Roles)(['Teacher']),
    (0, common_1.Post)('choices'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Choices minigame' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Choices minigame created successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_minigame_dto_1.CreateChoicesGame]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "createChoicesMinigame", null);
__decorate([
    (0, roles_decorator_1.Roles)(['Teacher']),
    (0, common_1.Post)('sentenceRearrangement'),
    (0, swagger_1.ApiOperation)({ summary: 'Create SR minigame' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Sentence Rearrangement minigame created successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_minigame_dto_1.CreateSentenceRearrangementGame]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "createSRMinigame", null);
__decorate([
    (0, common_1.Get)('readingmaterials/:readingMaterialID/random'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get 3 random minigames for a specific reading material',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Random minigames fetched successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Param)('readingMaterialID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "findMinigamesByMaterialID", null);
__decorate([
    (0, common_1.Get)('logs/:readingSessionID'),
    (0, swagger_1.ApiOperation)({ summary: 'Get minigame logs for session id' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Minigame logs successfully fetched.',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Param)('readingSessionID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "findMinigamelogsByReadingSessionID", null);
__decorate([
    (0, common_1.Post)('logs/SentenceRearrangement'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a log for SentenceRearrangement minigame',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Sentence Rearrangement Log created successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_minigame_log_dto_1.CreateMinigameLogDto]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "createSentenceRearrangementLog", null);
__decorate([
    (0, common_1.Patch)('logs/SentenceRearrangement'),
    (0, swagger_1.ApiOperation)({ summary: 'Update log for SentenceRearrangement' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sentence Rearrangement Log updated successfully.',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_minigame_log_dto_1.UpdateMinigameLogDto]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "updateSentenceRearrangementLog", null);
__decorate([
    (0, common_1.Post)('logs/Choices'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a log for Choices minigame',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Choices log created successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_minigame_log_dto_1.CreateMinigameLogDto]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "createChoicesLog", null);
__decorate([
    (0, common_1.Patch)('logs/Choices'),
    (0, swagger_1.ApiOperation)({ summary: 'Update log for Choices' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Choices Log updated successfully.',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_minigame_log_dto_1.UpdateMinigameLogDto]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "updateChoicesLog", null);
__decorate([
    (0, common_1.Post)('logs/WordsFromLetters'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a log for WordsFromLetters minigame',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Words From Letters log created successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_minigame_log_dto_1.CreateMinigameLogDto]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "createWordsFromLettersLog", null);
__decorate([
    (0, common_1.Patch)('logs/WordsFromLetters'),
    (0, swagger_1.ApiOperation)({ summary: 'Update log for WordsFromLetters' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'WordsFromLetters Log updated successfully.',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_minigame_log_dto_1.UpdateMinigameLogDto]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "updateWordsFromLettersLog", null);
__decorate([
    (0, common_1.Get)('sessions/:readingSessionID'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get saved minigames for a specific reading session',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Minigames fetched successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Param)('readingSessionID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "findMinigamesBySessionID", null);
__decorate([
    (0, common_1.Get)(':readingSessionID/random'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get 3 random minigames for a specific reading session',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Minigames fetched successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Param)('readingSessionID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "findRandomMinigamesBySessionID", null);
__decorate([
    (0, common_1.Get)(':readingMaterialID/wordsFromLetters'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get WordsFromLetters minigame for a specific reading material',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Words from Letters minigame fetched successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Param)('readingMaterialID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "findWordsFromLettersMinigame", null);
__decorate([
    (0, common_1.Post)(':readingSessionID/complete'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a completion status of minigames for a specific reading session',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Reading session completed successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Param)('readingSessionID')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MinigamesController.prototype, "getMinigamesCompletion", null);
exports.MinigamesController = MinigamesController = __decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), role_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('minigames'),
    __metadata("design:paramtypes", [minigames_service_1.MinigamesService])
], MinigamesController);
//# sourceMappingURL=minigames.controller.js.map