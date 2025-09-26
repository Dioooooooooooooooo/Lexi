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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const dto_1 = require("../../common/dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        const data = await this.authService.register(registerDto);
        return {
            message: 'User successfully registered',
            data: {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
            },
        };
    }
    async login(loginDto) {
        const data = await this.authService.login(loginDto);
        return {
            message: 'User successfully logged in',
            data: {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                user: data.user,
            },
        };
    }
    async exchangeGoogleIdToken(googleExchangeTokenDto) {
        const data = await this.authService.exchangeGoogleIdToken(googleExchangeTokenDto.id_token);
        return {
            message: 'Authentication successful',
            data,
        };
    }
    async refreshToken(refreshTokenDto) {
        const refreshToken = refreshTokenDto.refresh_token;
        const data = await this.authService.refreshToken({
            refresh_token: refreshToken,
        });
        return {
            message: 'Token refreshed successfully',
            data: {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
            },
        };
    }
    async forgotPassword(forgotPasswordDto) {
        await this.authService.forgotPassword(forgotPasswordDto);
        return {
            message: 'If the email exists, a password reset link has been sent.',
        };
    }
    async resetPassword(resetPasswordDto) {
        await this.authService.resetPassword(resetPasswordDto);
        return { message: 'Password reset successfully' };
    }
    async requestEmailVerification(req) {
        await this.authService.requestEmailVerification(req.user.id);
        return { message: 'Verification email sent if not already verified.' };
    }
    async verifyEmail(token) {
        await this.authService.verifyEmail(token);
        return { message: 'Email verified successfully' };
    }
    async checkUser(fieldType, fieldValue) {
        const res = await this.authService.checkUserExists(fieldType, fieldValue);
        if (res) {
            return new common_1.HttpException({ statusCode: common_1.HttpStatus.CONFLICT, message: 'User already exist.' }, common_1.HttpStatus.CONFLICT);
        }
        return { message: 'User does not exist.' };
    }
    getProfile(req) {
        console.log('getting ', req.user);
        return { message: 'User profile retrieved successfully', data: req.user };
    }
    async updateProfile(req, updateProfileDto) {
        console.log('UpdateProfileDto:', updateProfileDto);
        await this.authService.updateProfile(req.user.id, updateProfileDto);
        return {
            message: 'User profile successfully updated',
        };
    }
    async deleteUser(req) {
        await this.authService.deleteUser(req.user.id);
        return {
            message: `${req.user.first_name} ${req.user.last_name} successfully deleted`,
        };
    }
    async changePassword(req, changePasswordDto) {
        await this.authService.changePassword(req.user.id, changePasswordDto);
        return { message: 'Password changed successfully' };
    }
    async logout(body) {
        const refreshToken = body?.refresh_token;
        await this.authService.logout(refreshToken);
        return { message: 'Successfully logged out' };
    }
    verifyToken(req) {
        return {
            message: 'Token is valid',
            data: {
                valid: true,
                user: req.user,
            },
        };
    }
    getProfileLegacy(req) {
        return {
            message: 'User profile retrieved successfully',
            data: req.user,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register a new user',
        description: 'Create a new user account with email and password',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'User successfully registered',
        type: auth_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiBody)({
        type: auth_dto_1.RegisterDto,
        description: 'User registration data',
        examples: {
            example1: {
                summary: 'Example registration',
                description: 'A sample user registration',
                value: {
                    first_name: 'John Doe',
                    last_name: 'Doe',
                    email: 'john.doe@example.com',
                    password: 'securePassword123',
                    confirm_password: 'securePassword123',
                    role: 'Pupil',
                },
            },
        },
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'User already exists',
        type: dto_1.ErrorResponseDto,
        example: {
            message: 'User already exists',
            error: 'Conflict',
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data',
        type: dto_1.ErrorResponseDto,
        example: {
            message: [
                'email must be a valid email',
                'password must be longer than or equal to 6 characters',
            ],
            error: 'Bad Request',
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: 'User login',
        description: 'Authenticate user with email and password',
    }),
    (0, swagger_1.ApiBody)({
        type: auth_dto_1.LoginDto,
        description: 'User login credentials',
        examples: {
            example1: {
                summary: 'Example login',
                description: 'A sample user login',
                value: {
                    email: 'john.doe@example.com',
                    password: 'securePassword123',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User successfully logged in',
        type: dto_1.SuccessResponseDto,
        example: {
            message: 'User successfully logged in',
            data: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    email: 'john.doe@example.com',
                    name: 'John Doe',
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid credentials',
        type: dto_1.ErrorResponseDto,
        example: {
            message: 'Invalid credentials',
            error: 'Unauthorized',
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data',
        type: dto_1.ErrorResponseDto,
        example: {
            message: ['email must be a valid email', 'password should not be empty'],
            error: 'Bad Request',
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('google/token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Exchange Google id_token for app tokens',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: dto_1.SuccessResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.GoogleExchangeTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "exchangeGoogleIdToken", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh access token',
        description: 'Get a new access token using refresh token',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Token refreshed successfully',
        type: dto_1.SuccessResponseDto,
    }),
    (0, swagger_1.ApiBody)({
        type: auth_dto_1.RefreshTokenDto,
        description: 'Refresh token',
        examples: {
            example1: {
                summary: 'Example refresh',
                description: 'A sample refresh token request',
                value: {
                    refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Token refreshed successfully',
        type: dto_1.SuccessResponseDto,
        example: {
            message: 'Token refreshed successfully',
            data: {
                access_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                refresh_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid refresh token',
        type: dto_1.ErrorResponseDto,
        example: {
            message: 'Invalid refresh token',
            error: 'Unauthorized',
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request password reset',
        description: 'Send a password reset link to user email',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Password reset email sent (if email exists)',
        type: dto_1.SuccessResponseDto,
    }),
    (0, swagger_1.ApiBody)({
        type: auth_dto_1.ForgotPasswordDto,
        description: 'User email for password reset',
        examples: {
            example1: {
                summary: 'Example forgot password',
                description: 'A sample forgot password request',
                value: {
                    email: 'john.doe@example.com',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Password reset email sent (if email exists)',
        type: (dto_1.SuccessResponseDto),
        example: {
            message: 'If the email exists, a password reset link has been sent.',
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data',
        type: dto_1.ErrorResponseDto,
        example: {
            message: ['email must be a valid email'],
            error: 'Bad Request',
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset password',
        description: 'Reset user password using reset token',
    }),
    (0, swagger_1.ApiBody)({
        type: auth_dto_1.ResetPasswordDto,
        description: 'Reset token and new password',
        examples: {
            example1: {
                summary: 'Example reset password',
                description: 'A sample password reset',
                value: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    new_password: 'newSecurePassword123',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Password reset successfully',
        type: (dto_1.SuccessResponseDto),
        example: {
            message: 'Password reset successfully',
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid or expired reset token',
        type: dto_1.ErrorResponseDto,
        example: {
            message: 'Invalid or expired reset token',
            error: 'Bad Request',
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('request-email-verification'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request email verification',
        description: 'Request email verification token',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Email verication sent.',
        type: (dto_1.SuccessResponseDto),
        example: {
            message: 'If the email exists, an email verification link has been sent.',
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestEmailVerification", null);
__decorate([
    (0, common_1.Get)('verify-email'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify email',
        description: 'Verify user email using verification token',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'token',
        description: 'Email verification token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Email verified successfully',
        type: (dto_1.SuccessResponseDto),
        example: {
            message: 'Email verified successfully',
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid or expired verification token',
        type: dto_1.ErrorResponseDto,
        example: {
            message: 'Invalid or expired verification token',
            error: 'Bad Request',
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Get)('check-user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check to see if user exists',
        description: 'Throws an error if user does exist.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User exists.',
    }),
    __param(0, (0, common_1.Query)('fieldType')),
    __param(1, (0, common_1.Query)('fieldValue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkUser", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current user profile',
        description: 'Retrieve the authenticated user profile information',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User profile retrieved successfully',
        type: dto_1.SuccessResponseDto,
        example: {
            message: 'User profile retrieved successfully',
            data: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                email: 'john.doe@example.com',
                name: 'John Doe',
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid or missing token',
        type: dto_1.ErrorResponseDto,
        example: {
            message: 'Unauthorized',
            error: 'Unauthorized',
        },
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", dto_1.SuccessResponseDto)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user profile',
        description: 'Update the authenticated user profile information',
    }),
    (0, swagger_1.ApiBody)({
        type: auth_dto_1.UpdateProfileDto,
        description: 'Profile update data',
        examples: {
            example1: {
                summary: 'Example profile update',
                description: 'A sample profile update',
                value: {
                    name: 'John Updated',
                    email: 'john.updated@example.com',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Profile updated successfully',
        type: dto_1.SuccessResponseDto,
        example: {
            message: 'Profile updated successfully',
            data: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                email: 'john.updated@example.com',
                name: 'John Updated',
            },
        },
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Email already exists',
        type: dto_1.ErrorResponseDto,
        example: {
            message: 'Email already exists',
            error: 'Conflict',
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid or missing token',
        type: dto_1.ErrorResponseDto,
        example: {
            message: 'Unauthorized',
            error: 'Unauthorized',
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Delete)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete user account',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User account deleted successfully',
        type: dto_1.SuccessResponseDto,
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Change user password',
        description: 'Change the authenticated user password',
    }),
    (0, swagger_1.ApiBody)({
        type: auth_dto_1.ChangePasswordDto,
        description: 'Current and new password',
        examples: {
            example1: {
                summary: 'Example change password',
                description: 'A sample password change',
                value: {
                    current_password: 'currentPassword123',
                    new_password: 'newSecurePassword123',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Password changed successfully',
        type: (dto_1.SuccessResponseDto),
        example: {
            message: 'Password changed successfully',
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid or missing token / Current password incorrect',
        type: dto_1.ErrorResponseDto,
        example: {
            message: 'Current password is incorrect',
            error: 'Unauthorized',
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'User logout',
        description: 'Logout the authenticated user and optionally revoke refresh token',
    }),
    (0, swagger_1.ApiBody)({
        required: false,
        schema: {
            type: 'object',
            properties: {
                refresh_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
            },
        },
        description: 'Optional refresh token to revoke',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User successfully logged out',
        type: (dto_1.SuccessResponseDto),
        example: {
            message: 'Successfully logged out',
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid or missing token',
        type: dto_1.ErrorResponseDto,
        example: {
            message: 'Unauthorized',
            error: 'Unauthorized',
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('verify-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify JWT token',
        description: 'Verify if the provided JWT token is valid and return user info',
    }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Token is valid',
        schema: {
            type: 'object',
            properties: {
                valid: {
                    type: 'boolean',
                    example: true,
                },
                user: {
                    $ref: '#/components/schemas/UserResponseDto',
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid or expired token',
        type: dto_1.ErrorResponseDto,
        example: {
            message: 'Unauthorized',
            error: 'Unauthorized',
        },
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", dto_1.SuccessResponseDto)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user profile (legacy)',
        description: 'Retrieve the authenticated user profile information - use /auth/me instead',
        deprecated: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User profile retrieved successfully',
        type: auth_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid or missing token',
        type: dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", dto_1.SuccessResponseDto)
], AuthController.prototype, "getProfileLegacy", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map