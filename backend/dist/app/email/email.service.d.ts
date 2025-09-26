import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { EmailQueueService } from "./email.queue.service";
export declare class EmailService {
    private readonly mailerService;
    private readonly configService;
    private readonly queue;
    private readonly logger;
    constructor(mailerService: MailerService, configService: ConfigService, queue: EmailQueueService);
    private buildClientUrl;
    sendMailWithRetry(options: any): Promise<void>;
    sendOnboarding(user: {
        email: string;
        firstName?: string;
        name?: string;
    }): Promise<void>;
    sendResetPassword(user: {
        email: string;
        name?: string;
    }, token: string): Promise<void>;
    sendVerifyEmail(user: {
        email: string;
        name?: string;
    }, token: string): Promise<void>;
}
