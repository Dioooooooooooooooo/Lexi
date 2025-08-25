import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);
  private queueFile = path.join(process.cwd(), "email_queue.json");

  private processing = false;

  async enqueue(mailOptions: any) {
    const queue = await this.readQueue();
    queue.push({
      id: Date.now() + Math.random(),
      mailOptions,
      attempts: 0,
      lastError: null,
    });
    await this.writeQueue(queue);
    this.processQueue().catch(err =>
      this.logger.error("processQueue failed", err),
    );
  }

  private async readQueue() {
    try {
      if (!fs.existsSync(this.queueFile)) return [];
      const raw = await fs.promises.readFile(this.queueFile, "utf-8");
      return JSON.parse(raw || "[]");
    } catch (err) {
      this.logger.error("readQueue error", err);
      return [];
    }
  }

  private async writeQueue(queue: any[]) {
    await fs.promises.writeFile(
      this.queueFile,
      JSON.stringify(queue, null, 2),
      "utf-8",
    );
  }

  async processQueue() {
    if (this.processing) return;
    this.processing = true;
    try {
      let queue = await this.readQueue();
      if (!queue.length) return;
      const mailer = require("nodemailer");
      const transporter = mailer.createTransport({
        // Use env SMTP settings
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const toKeep = [] as any[];
      for (const item of queue) {
        try {
          await transporter.sendMail(item.mailOptions);
          this.logger.log("Queued mail sent", item.mailOptions.to);
        } catch (err) {
          item.attempts = (item.attempts || 0) + 1;
          item.lastError = err && err.message ? err.message : String(err);
          this.logger.error(
            "Failed to send queued mail",
            item.mailOptions.to,
            item.lastError,
          );
          if (item.attempts < 5) {
            toKeep.push(item);
          } else {
            this.logger.error(
              "Dropping mail after max attempts",
              item.mailOptions.to,
            );
          }
        }
      }

      await this.writeQueue(toKeep);
    } catch (err) {
      this.logger.error("processQueue top-level error", err);
    } finally {
      this.processing = false;
    }
  }
}
