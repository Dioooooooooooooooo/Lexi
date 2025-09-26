"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kysely_1 = require("kysely");
const pg_1 = require("pg");
const database_service_1 = require("./database.service");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: 'DATABASE',
                useFactory: (configService) => {
                    const pool = new pg_1.Pool({
                        host: configService.get('DB_HOST'),
                        port: parseInt(configService.get('DB_PORT') ?? '6543', 10),
                        user: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_DATABASE'),
                        ssl: {
                            rejectUnauthorized: true,
                            ca: configService.get('DB_SSL_CA'),
                        },
                    });
                    return new kysely_1.Kysely({
                        dialect: new kysely_1.PostgresDialect({ pool }),
                    });
                },
                inject: [config_1.ConfigService],
            },
            database_service_1.DatabaseService,
        ],
        exports: ['DATABASE', database_service_1.DatabaseService],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map