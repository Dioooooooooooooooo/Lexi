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
exports.GoogleExchangeTokenDto = exports.AuthResponseDto = exports.UserResponseDto = exports.RefreshTokenDto = exports.UpdateProfileDto = exports.UpdateRoleDto = exports.ChangePasswordDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.LoginDto = exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const match_decorator_1 = require("../../../validators/match.decorator");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Username",
        example: "johndoe1",
        minLength: 8,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User first name",
        example: "John",
        minLength: 1,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], RegisterDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User last name", example: "Doe", minLength: 1 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], RegisterDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User email", example: "john.doe@example.com" }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User password", example: "securePassword123" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Password confirmation",
        example: "securePassword123",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(255),
    (0, match_decorator_1.Match)("password", { message: "Passwords do not match" }),
    __metadata("design:type", String)
], RegisterDto.prototype, "confirm_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User role",
        example: "Pupil",
        enum: ["Pupil", "Teacher"],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, class_validator_1.IsIn)(["Pupil", "Teacher"]),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User email", example: "john.doe@example.com" }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User password", example: "securePassword123" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class ForgotPasswordDto {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User email", example: "john.doe@example.com" }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Reset token" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "New password", example: "newSecurePassword123" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "new_password", void 0);
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Current password" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "current_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "New password" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "new_password", void 0);
class UpdateRoleDto {
}
exports.UpdateRoleDto = UpdateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User email", example: "john.doe@example.com" }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "New role", example: "Staff" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "role", void 0);
class UpdateProfileDto {
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Username",
        example: "janes123",
        required: false,
        minLength: 8,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "First name",
        example: "Jane",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Last name",
        example: "Smith",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Email address", required: false }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Avatar", required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "avatar", void 0);
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Refresh token" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refresh_token", void 0);
class UserResponseDto {
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Email", nullable: true }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "First name", nullable: true }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UserResponseDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Last name", nullable: true }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UserResponseDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User role", nullable: true }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UserResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Created at", required: false }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Created at", required: false }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updated_at", void 0);
class AuthResponseDto {
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Access token" }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User info", type: UserResponseDto }),
    __metadata("design:type", UserResponseDto)
], AuthResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Refresh token", required: false }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "refresh_token", void 0);
class GoogleExchangeTokenDto {
}
exports.GoogleExchangeTokenDto = GoogleExchangeTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Google ID Token", required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GoogleExchangeTokenDto.prototype, "id_token", void 0);
//# sourceMappingURL=auth.dto.js.map