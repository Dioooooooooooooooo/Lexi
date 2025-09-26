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
exports.DictionaryService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
let DictionaryService = class DictionaryService {
    constructor(cacheManager, configService) {
        this.cacheManager = cacheManager;
        this.configService = configService;
    }
    async definition(word) {
        const cache = await this.cacheManager.get(`dictionary-${word}`);
        if (cache) {
            return cache;
        }
        const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/sd2/json/${word}?key=${this.configService.get('DICTIONARY_API_KEY')}`);
        const result = await response.json();
        await this.cacheManager.set(`dictionary-${word}`, result, this.configService.get('DICTIONARY_TTL_DAYS', 120) *
            24 *
            60 *
            60 *
            1000);
        return result;
    }
};
exports.DictionaryService = DictionaryService;
exports.DictionaryService = DictionaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [cache_manager_1.Cache,
        config_1.ConfigService])
], DictionaryService);
//# sourceMappingURL=dictionary.service.js.map