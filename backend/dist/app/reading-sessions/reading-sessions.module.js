"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingSessionsModule = void 0;
const common_1 = require("@nestjs/common");
const reading_sessions_service_1 = require("./reading-sessions.service");
const reading_sessions_controller_1 = require("./reading-sessions.controller");
const minigames_service_1 = require("../minigames/minigames.service");
const achievements_service_1 = require("../achievements/achievements.service");
const reading_materials_service_1 = require("../reading-materials/reading-materials.service");
const genres_service_1 = require("../genres/genres.service");
const readibility_service_1 = require("../reading-materials/readibility.service");
let ReadingSessionsModule = class ReadingSessionsModule {
};
exports.ReadingSessionsModule = ReadingSessionsModule;
exports.ReadingSessionsModule = ReadingSessionsModule = __decorate([
    (0, common_1.Module)({
        controllers: [reading_sessions_controller_1.ReadingSessionsController],
        providers: [reading_sessions_service_1.ReadingSessionsService, minigames_service_1.MinigamesService, achievements_service_1.AchievementsService, reading_materials_service_1.ReadingMaterialsService, genres_service_1.GenresService, readibility_service_1.ReadabilityService],
    })
], ReadingSessionsModule);
//# sourceMappingURL=reading-sessions.module.js.map