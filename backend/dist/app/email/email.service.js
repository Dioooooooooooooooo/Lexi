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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const email_queue_service_1 = require("./email.queue.service");
let EmailService = EmailService_1 = class EmailService {
    constructor(mailerService, configService, queue) {
        this.mailerService = mailerService;
        this.configService = configService;
        this.queue = queue;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    buildClientUrl(path, params) {
        const base = this.configService.get("FRONTEND_URL") ?? "";
        if (!base) {
            return params
                ? `${path}?${new URLSearchParams(params).toString()}`
                : path;
        }
        const separator = base.endsWith("/") ? "" : "/";
        let url = `${base}${separator}${path}`;
        if (params) {
            url += `?${new URLSearchParams(params).toString()}`;
        }
        return url;
    }
    async sendMailWithRetry(options) {
        try {
            await this.mailerService.sendMail(options);
        }
        catch (err) {
            this.logger.error("Mail send failed, enqueueing", err);
            await this.queue.enqueue(options);
        }
    }
    async sendOnboarding(user) {
        const context = {
            name: user.firstName ?? user.name ?? "there",
            appName: this.configService.get("APP_NAME") ?? "App",
            signinUrl: this.buildClientUrl("login"),
        };
        console.log("onboarding");
        await this.sendMailWithRetry({
            to: user.email,
            subject: `Welcome to ${context.appName}`,
            template: "onboarding",
            context,
        });
    }
    async sendResetPassword(user, token) {
        const resetUrl = this.buildClientUrl("reset-password", { token });
        const context = {
            name: user.name ?? "there",
            resetUrl,
            appName: this.configService.get("APP_NAME") ?? "App",
        };
        await this.sendMailWithRetry({
            to: user.email,
            subject: "Password reset instructions",
            template: "reset-password",
            context,
        });
    }
    async sendVerifyEmail(user, token) {
        const verifyUrl = this.buildClientUrl("verify-email", { token });
        const context = {
            name: user.name ?? "there",
            verifyUrl,
            appName: this.configService.get("APP_NAME") ?? "App",
        };
        await this.sendMailWithRetry({
            to: user.email,
            subject: `Verify your email for ${context.appName}`,
            template: "verify-email",
            context,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService,
        email_queue_service_1.EmailQueueService])
], EmailService);
//# sourceMappingURL=email.service.js.map