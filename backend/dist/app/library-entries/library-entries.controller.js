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
exports.LibraryEntriesController = void 0;
const common_1 = require("@nestjs/common");
const library_entries_service_1 = require("./library-entries.service");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../common/dto");
let LibraryEntriesController = class LibraryEntriesController {
    constructor(libraryEntriesService) {
        this.libraryEntriesService = libraryEntriesService;
    }
    async create(readingMaterialId) {
        const entry = await this.libraryEntriesService.create(readingMaterialId);
        return {
            message: 'Reading material successsfully added to library.',
            data: entry,
        };
    }
    async findAll() {
        const entries = await this.libraryEntriesService.findAll();
        return {
            message: 'Successfully fetched reading materials from library.',
            data: entries,
        };
    }
    async remove(readingMaterialId) {
        await this.libraryEntriesService.remove(readingMaterialId);
        return { message: 'Successfully removed reading material from library.' };
    }
};
exports.LibraryEntriesController = LibraryEntriesController;
__decorate([
    (0, common_1.Post)('reading-materials/:readingMaterialId'),
    (0, swagger_1.ApiOperation)({ summary: 'This adds a reading material to the library' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Reading material successsfully added to library.',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('readingMaterialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LibraryEntriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'This will get all reading materials in library.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reading materials in library successfully fetched.',
        type: dto_1.SuccessResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LibraryEntriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':readingMaterialId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove reading material from library.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully removed reading material from library.',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Param)('readingMaterialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LibraryEntriesController.prototype, "remove", null);
exports.LibraryEntriesController = LibraryEntriesController = __decorate([
    (0, common_1.Controller)('library-entries'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [library_entries_service_1.LibraryEntriesService])
], LibraryEntriesController);
//# sourceMappingURL=library-entries.controller.js.map