"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingMaterialsModule = void 0;
const common_1 = require("@nestjs/common");
const reading_materials_service_1 = require("./reading-materials.service");
const reading_materials_controller_1 = require("./reading-materials.controller");
const genres_service_1 = require("../genres/genres.service");
const readibility_service_1 = require("./readibility.service");
const pupils_service_1 = require("../pupils/pupils.service");
let ReadingMaterialsModule = class ReadingMaterialsModule {
};
exports.ReadingMaterialsModule = ReadingMaterialsModule;
exports.ReadingMaterialsModule = ReadingMaterialsModule = __decorate([
    (0, common_1.Module)({
        controllers: [reading_materials_controller_1.ReadingMaterialsController],
        providers: [reading_materials_service_1.ReadingMaterialsService, readibility_service_1.ReadabilityService, genres_service_1.GenresService, pupils_service_1.PupilsService],
        exports: [readibility_service_1.ReadabilityService],
    })
], ReadingMaterialsModule);
//# sourceMappingURL=reading-materials.module.js.map