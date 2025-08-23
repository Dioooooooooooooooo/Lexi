import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { EmailQueueService } from "./email.queue.service";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly queue: EmailQueueService,
  ) { }

  private buildClientUrl(path: string, params?: Record<string, string>) {
    const base = this.configService.get<string>("FRONTEND_URL") ?? "";
    if (!base) {
      // Fallback: return path with query params if provided
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

  async sendMailWithRetry(options: any) {
    try {
      await this.mailerService.sendMail(options);
    } catch (err) {
      this.logger.error("Mail send failed, enqueueing", err);
      await this.queue.enqueue(options);
    }
  }

  async sendOnboarding(user: {
    email: string;
    firstName?: string;
    name?: string;
  }) {
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

  async sendResetPassword(
    user: { email: string; name?: string },
    token: string,
  ) {
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

  async sendVerifyEmail(user: { email: string; name?: string }, token: string) {
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
}
