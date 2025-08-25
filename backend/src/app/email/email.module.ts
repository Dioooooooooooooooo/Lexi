import { Global, Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as path from "path";
import { EmailService } from "./email.service";
import { EmailQueueService } from "./email.queue.service";
import { google } from "googleapis";

@Global()
@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const useGmailOauth = config.get<string>("GOOGLE_USE_OAUTH") === "true";

        let transport: any;
        if (useGmailOauth) {
          // Gmail OAuth2 via nodemailer
          // Required env vars:
          // GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER (sender email)
          const clientId = config.get<string>("GOOGLE_CLIENT_ID");
          const clientSecret = config.get<string>("GOOGLE_CLIENT_SECRET");
          const refreshToken = config.get<string>("GOOGLE_REFRESH_TOKEN");
          const userEmail = config.get<string>("GOOGLE_USER");

          const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
          oAuth2Client.setCredentials({ refresh_token: refreshToken });

          // getAccessToken() may return a string or an object with token prop depending on version
          const accessTokenRes: any = await oAuth2Client.getAccessToken();
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
        } else {
          // Fallback: normal SMTP transport
          transport = {
            host: config.get<string>("SMTP_HOST"),
            port: Number(config.get<number>("SMTP_PORT") ?? 587),
            secure: config.get<string>("SMTP_SECURE") === "true",
            auth: {
              user: config.get<string>("SMTP_USER"),
              pass: config.get<string>("SMTP_PASS"),
            },
          };
        }

        return {
          transport,
          defaults: {
            from:
              config.get<string>("EMAIL_FROM") ||
              '"No Reply" <noreply@example.com>',
          },
          template: {
            dir: path.join(__dirname, "templates"),
            adapter: new HandlebarsAdapter(undefined, {
              noEscape: true,
            } as any),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService, EmailQueueService],
  exports: [EmailService, EmailQueueService],
})
export class EmailModule {}
