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
exports.GenresController = void 0;
const common_1 = require("@nestjs/common");
const genres_service_1 = require("./genres.service");
const create_genre_dto_1 = require("./dto/create-genre.dto");
const dto_1 = require("../../common/dto");
const swagger_1 = require("@nestjs/swagger");
let GenresController = class GenresController {
    constructor(genresService) {
        this.genresService = genresService;
    }
    create(createGenreDto) {
        return this.genresService.create(createGenreDto);
    }
    findAll() {
        return this.genresService.findAll();
    }
};
exports.GenresController = GenresController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create Genre',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Genre created successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_genre_dto_1.CreateGenreDto]),
    __metadata("design:returntype", Promise)
], GenresController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all Genres',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Genres fetched successfully',
        type: dto_1.SuccessResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GenresController.prototype, "findAll", null);
exports.GenresController = GenresController = __decorate([
    (0, common_1.Controller)("genres"),
    __metadata("design:paramtypes", [genres_service_1.GenresService])
], GenresController);
//# sourceMappingURL=genres.controller.js.map