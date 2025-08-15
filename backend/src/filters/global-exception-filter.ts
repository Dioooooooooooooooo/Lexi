import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message } = this.getErrorDetails(exception);

    reply.status(status).send({
      status: "error",
      message,
      ...(process.env.NODE_ENV === "development" && {
        stack: (exception as any)?.stack,
      }),
    });
  }

  private getErrorDetails(exception: unknown) {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === "string") {
        return { message: response, error: "HttpException" };
      }
      if (typeof response === "object" && response !== null) {
        return {
          message: (response as any).message || "Internal server error",
          error: (response as any).error || "HttpException",
        };
      }
    }

    if (exception instanceof Error) {
      return { message: exception.message, error: exception.name };
    }

    return { message: "Internal server error", error: "InternalServerError" };
  }
}
