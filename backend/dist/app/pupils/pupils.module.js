"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PupilsModule = void 0;
const common_1 = require("@nestjs/common");
const pupils_service_1 = require("./pupils.service");
const pupils_controller_1 = require("./pupils.controller");
let PupilsModule = class PupilsModule {
};
exports.PupilsModule = PupilsModule;
exports.PupilsModule = PupilsModule = __decorate([
    (0, common_1.Module)({
        controllers: [pupils_controller_1.PupilsController],
        providers: [pupils_service_1.PupilsService],
        exports: [pupils_service_1.PupilsService],
    })
], PupilsModule);
//# sourceMappingURL=pupils.module.js.map