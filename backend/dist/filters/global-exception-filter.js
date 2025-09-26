"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    async catch(exception, host) {
        const ctx = host.switchToHttp();
        const reply = ctx.getResponse();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const { message } = this.getErrorDetails(exception);
        reply.status(status).send({
            status: "error",
            message,
            ...(process.env.NODE_ENV === "development" && {
                stack: exception?.stack,
            }),
        });
    }
    getErrorDetails(exception) {
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            if (typeof response === "string") {
                return { message: response, error: "HttpException" };
            }
            if (typeof response === "object" && response !== null) {
                return {
                    message: response.message || "Internal server error",
                    error: response.error || "HttpException",
                };
            }
        }
        if (exception instanceof Error) {
            return { message: exception.message, error: exception.name };
        }
        return { message: "Internal server error", error: "InternalServerError" };
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception-filter.js.map