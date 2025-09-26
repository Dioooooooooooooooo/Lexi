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
var EmailQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let EmailQueueService = EmailQueueService_1 = class EmailQueueService {
    constructor() {
        this.logger = new common_1.Logger(EmailQueueService_1.name);
        this.queueFile = path.join(process.cwd(), "email_queue.json");
        this.processing = false;
    }
    async enqueue(mailOptions) {
        const queue = await this.readQueue();
        queue.push({
            id: Date.now() + Math.random(),
            mailOptions,
            attempts: 0,
            lastError: null,
        });
        await this.writeQueue(queue);
        this.processQueue().catch(err => this.logger.error("processQueue failed", err));
    }
    async readQueue() {
        try {
            if (!fs.existsSync(this.queueFile))
                return [];
            const raw = await fs.promises.readFile(this.queueFile, "utf-8");
            return JSON.parse(raw || "[]");
        }
        catch (err) {
            this.logger.error("readQueue error", err);
            return [];
        }
    }
    async writeQueue(queue) {
        await fs.promises.writeFile(this.queueFile, JSON.stringify(queue, null, 2), "utf-8");
    }
    async processQueue() {
        if (this.processing)
            return;
        this.processing = true;
        try {
            let queue = await this.readQueue();
            if (!queue.length)
                return;
            const mailer = require("nodemailer");
            const transporter = mailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            const toKeep = [];
            for (const item of queue) {
                try {
                    await transporter.sendMail(item.mailOptions);
                    this.logger.log("Queued mail sent", item.mailOptions.to);
                }
                catch (err) {
                    item.attempts = (item.attempts || 0) + 1;
                    item.lastError = err && err.message ? err.message : String(err);
                    this.logger.error("Failed to send queued mail", item.mailOptions.to, item.lastError);
                    if (item.attempts < 5) {
                        toKeep.push(item);
                    }
                    else {
                        this.logger.error("Dropping mail after max attempts", item.mailOptions.to);
                    }
                }
            }
            await this.writeQueue(toKeep);
        }
        catch (err) {
            this.logger.error("processQueue top-level error", err);
        }
        finally {
            this.processing = false;
        }
    }
};
exports.EmailQueueService = EmailQueueService;
exports.EmailQueueService = EmailQueueService = EmailQueueService_1 = __decorate([
    (0, common_1.Injectable)()
], EmailQueueService);
//# sourceMappingURL=email.queue.service.js.map