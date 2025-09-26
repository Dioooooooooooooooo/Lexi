"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailModule = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const config_1 = require("@nestjs/config");
const path = __importStar(require("path"));
const email_service_1 = require("./email.service");
const email_queue_service_1 = require("./email.queue.service");
const googleapis_1 = require("googleapis");
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (config) => {
                    const useGmailOauth = config.get("GOOGLE_USE_OAUTH") === "true";
                    let transport;
                    if (useGmailOauth) {
                        const clientId = config.get("GOOGLE_CLIENT_ID");
                        const clientSecret = config.get("GOOGLE_CLIENT_SECRET");
                        const refreshToken = config.get("GOOGLE_REFRESH_TOKEN");
                        const userEmail = config.get("GOOGLE_USER");
                        const oAuth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret);
                        oAuth2Client.setCredentials({ refresh_token: refreshToken });
                        const accessTokenRes = await oAuth2Client.getAccessToken();
                        const accessToken = accessTokenRes?.token ?? accessTokenRes;
                        transport = {
                            service: "gmail",
                            auth: {
                                type: "OAuth2",
                                user: userEmail,
                                clientId,
                                clientSecret,
                                refreshToken,
                                accessToken,
                            },
                        };
                    }
                    else {
                        transport = {
                            host: config.get("SMTP_HOST"),
                            port: Number(config.get("SMTP_PORT") ?? 587),
                            secure: config.get("SMTP_SECURE") === "true",
                            auth: {
                                user: config.get("SMTP_USER"),
                                pass: config.get("SMTP_PASS"),
                            },
                        };
                    }
                    return {
                        transport,
                        defaults: {
                            from: config.get("EMAIL_FROM") ||
                                '"No Reply" <noreply@example.com>',
                        },
                        template: {
                            dir: path.join(__dirname, "templates"),
                            adapter: new handlebars_adapter_1.HandlebarsAdapter(undefined, {
                                noEscape: true,
                            }),
                            options: {
                                strict: true,
                            },
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [email_service_1.EmailService, email_queue_service_1.EmailQueueService],
        exports: [email_service_1.EmailService, email_queue_service_1.EmailQueueService],
    })
], EmailModule);
//# sourceMappingURL=email.module.js.map