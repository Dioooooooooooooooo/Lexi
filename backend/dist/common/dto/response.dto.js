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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponseDto = exports.ErrorResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Something went wrong" }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Field "name" must not be empty',
        description: "Detailed error, if any",
        required: false,
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "error", void 0);
class SuccessResponseDto {
    constructor() {
        this.status = "success";
    }
}
exports.SuccessResponseDto = SuccessResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Response status" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SuccessResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Request successful" }),
    __metadata("design:type", String)
], SuccessResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Response data" }),
    __metadata("design:type", Object)
], SuccessResponseDto.prototype, "data", void 0);
//# sourceMappingURL=response.dto.js.map