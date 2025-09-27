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
exports.LibraryEntriesService = void 0;
const common_1 = require("@nestjs/common");
const request_context_1 = require("../../common/utils/request-context");
const kysely_1 = require("kysely");
let LibraryEntriesService = class LibraryEntriesService {
    constructor(db) {
        this.db = db;
    }
    async create(readingMaterialId) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        const newEntry = await this.db
            .insertInto('public.library_entries')
            .values({
            user_id: user.id,
            reading_material_id: readingMaterialId,
        })
            .returningAll()
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Failed to add reading material to library.'));
        return newEntry;
    }
    async findAll() {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        const readingMaterials = await this.db
            .selectFrom('public.library_entries as le')
            .leftJoin('public.reading_materials as rm', 'rm.id', 'le.reading_material_id')
            .where('le.user_id', '=', user.id)
            .orderBy('created_at', 'desc')
            .selectAll('rm')
            .execute();
        return readingMaterials;
    }
    async remove(readingMaterialId) {
        const req = (0, request_context_1.getCurrentRequest)();
        const user = req['user'];
        await this.db
            .deleteFrom('public.library_entries')
            .where('reading_material_id', '=', readingMaterialId)
            .where('user_id', '=', user.id)
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Library entry not found.'));
    }
};
exports.LibraryEntriesService = LibraryEntriesService;
exports.LibraryEntriesService = LibraryEntriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [kysely_1.Kysely])
], LibraryEntriesService);
//# sourceMappingURL=library-entries.service.js.map