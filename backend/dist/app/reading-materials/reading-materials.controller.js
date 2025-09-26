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
exports.ReadingMaterialsController = void 0;
const common_1 = require("@nestjs/common");
const reading_materials_service_1 = require("./reading-materials.service");
const create_reading_material_dto_1 = require("./dto/create-reading-material.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../common/dto");
const role_guard_1 = require("../auth/role-guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const pupils_service_1 = require("../pupils/pupils.service");
let ReadingMaterialsController = class ReadingMaterialsController {
    constructor(readingMaterialsService, pupilService) {
        this.readingMaterialsService = readingMaterialsService;
        this.pupilService = pupilService;
    }
    async create(createReadingMaterialDto) {
        const result = await this.readingMaterialsService.create(createReadingMaterialDto);
        return {
            message: 'Reading material successfully created',
            data: result,
        };
    }
    async findAll() {
        const readingMaterials = await this.readingMaterialsService.findAll();
        return {
            message: 'Reading materials successfully fetched',
            data: readingMaterials,
        };
    }
    async findRecommendations(req) {
        const recommendedMaterials = await this.readingMaterialsService.getRecommendedReadingMaterials(req.user.id);
        return {
            message: 'Recommended reading materials successfully fetched',
            data: recommendedMaterials,
        };
    }
    async findOne(id) {
        const readingMaterial = await this.readingMaterialsService.findOne(id);
        return {
            message: 'Reading material successfully fetched',
            data: readingMaterial,
        };
    }
};
exports.ReadingMaterialsController = ReadingMaterialsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a reading material',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Reading material created successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reading_material_dto_1.CreateReadingMaterialDto]),
    __metadata("design:returntype", Promise)
], ReadingMaterialsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all reading materials',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reading materials fetched successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReadingMaterialsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(['Pupil']),
    (0, swagger_1.ApiOperation)({
        summary: 'Get recommended reading materials for the pupil',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Recommended reading materials fetched successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReadingMaterialsController.prototype, "findRecommendations", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a reading material by id',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reading material fetched successfully',
        type: (dto_1.SuccessResponseDto),
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReadingMaterialsController.prototype, "findOne", null);
exports.ReadingMaterialsController = ReadingMaterialsController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('reading-materials'),
    __metadata("design:paramtypes", [reading_materials_service_1.ReadingMaterialsService,
        pupils_service_1.PupilsService])
], ReadingMaterialsController);
//# sourceMappingURL=reading-materials.controller.js.map