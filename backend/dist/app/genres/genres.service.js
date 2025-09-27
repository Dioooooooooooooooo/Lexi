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
exports.GenresService = void 0;
const common_1 = require("@nestjs/common");
const kysely_1 = require("kysely");
let GenresService = class GenresService {
    constructor(db) {
        this.db = db;
    }
    async create(createGenreDto) {
        const genre = await this.db
            .insertInto("public.genres")
            .values({
            name: createGenreDto.name,
        })
            .returningAll()
            .executeTakeFirst();
        if (!genre) {
            throw new Error("Failed to create genre");
        }
        return {
            message: "Genre successfully created",
            data: genre,
        };
    }
    async findAll() {
        const genres = await this.db
            .selectFrom("public.genres as g")
            .selectAll()
            .execute();
        if (genres.length === 0) {
            throw new common_1.NotFoundException("No genres found");
        }
        return {
            message: "Genres successfully fetched",
            data: genres,
        };
    }
    async createReadingMaterialGenres(readingMaterialId, genreNames) {
        const genreIds = await this.db
            .selectFrom("public.genres as g")
            .where("g.name", "in", genreNames)
            .select("g.id")
            .execute()
            .then(genres => genres.map(genre => genre.id));
        return await this.db
            .insertInto("public.reading_material_genres")
            .values(genreIds.map(genreId => ({
            reading_material_id: readingMaterialId,
            genre_id: genreId,
        })))
            .execute();
    }
};
exports.GenresService = GenresService;
exports.GenresService = GenresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DATABASE")),
    __metadata("design:paramtypes", [kysely_1.Kysely])
], GenresService);
//# sourceMappingURL=genres.service.js.map