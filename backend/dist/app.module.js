"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const achievements_module_1 = require("./app/achievements/achievements.module");
const activity_logs_module_1 = require("./app/activity-logs/activity-logs.module");
const activity_module_1 = require("./app/activity/activity.module");
const auth_module_1 = require("./app/auth/auth.module");
const classrooms_module_1 = require("./app/classrooms/classrooms.module");
const email_module_1 = require("./app/email/email.module");
const genres_module_1 = require("./app/genres/genres.module");
const minigames_module_1 = require("./app/minigames/minigames.module");
const pupils_module_1 = require("./app/pupils/pupils.module");
const reading_materials_module_1 = require("./app/reading-materials/reading-materials.module");
const reading_sessions_module_1 = require("./app/reading-sessions/reading-sessions.module");
const user_module_1 = require("./app/user/user.module");
const configuration_1 = __importDefault(require("./configuration/configuration"));
const database_module_1 = require("./database/database.module");
const seed_module_1 = require("./seed/seed.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const redis_1 = require("@keyv/redis");
const redis_2 = require("@keyv/redis");
const cacheable_1 = require("cacheable");
const dictionary_module_1 = require("./app/dictionary/dictionary.module");
const imagekit_module_1 = require("./app/imagekit/imagekit.module");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = __importDefault(require("multer"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 1000,
                        limit: 10,
                    },
                ],
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => {
                    return {
                        stores: [
                            new redis_2.Keyv({
                                store: new cacheable_1.CacheableMemory({ ttl: 60000, lruSize: 5000 }),
                            }),
                            (0, redis_1.createKeyv)(config.get('REDIS_URI')),
                        ],
                    };
                },
            }),
            platform_express_1.MulterModule.register({
                storage: multer_1.default.memoryStorage(),
            }),
            database_module_1.DatabaseModule,
            email_module_1.EmailModule,
            auth_module_1.AuthModule,
            pupils_module_1.PupilsModule,
            classrooms_module_1.ClassroomsModule,
            minigames_module_1.MinigamesModule,
            reading_sessions_module_1.ReadingSessionsModule,
            reading_materials_module_1.ReadingMaterialsModule,
            genres_module_1.GenresModule,
            achievements_module_1.AchievementsModule,
            seed_module_1.SeedModule,
            activity_module_1.ActivityModule,
            user_module_1.UserModule,
            activity_logs_module_1.ActivityLogsModule,
            dictionary_module_1.DictionaryModule,
            imagekit_module_1.ImagekitModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map