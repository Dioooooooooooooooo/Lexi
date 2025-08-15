import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  Res,
  Req,
} from "@nestjs/common";
import { Response, Request as ExpressRequest } from "express";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  UserResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateProfileDto,
  RefreshTokenDto,
} from "./dto/auth.dto";
import { ErrorResponseDto, SuccessResponseDto } from "@/common/dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    summary: "Register a new user",
    description: "Create a new user account with email and password",
  })
  @ApiBody({
    type: RegisterDto,
    description: "User registration data",
    examples: {
      example1: {
        summary: "Example registration",
        description: "A sample user registration",
        value: {
          first_name: "John Doe",
          last_name: "Doe",
          email: "john.doe@example.com",
          password: "securePassword123",
          confirm_password: "securePassword123",
          role: "Pupil",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User successfully registered",
    type: AuthResponseDto,
    example: {
      message: "User successfully registered",
      data: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "john.doe@example.com",
          first_name: "John",
          last_name: "Doe",
          role: "Pupil",
          created_at: "2023-01-01T00:00:00.000Z",
        },
      },
    },
  })
  @ApiConflictResponse({
    description: "User already exists",
    type: ErrorResponseDto,
    example: {
      statusCode: 409,
      message: "User already exists",
      error: "Conflict",
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: ErrorResponseDto,
    example: {
      statusCode: 400,
      message: [
        "email must be a valid email",
        "password must be longer than or equal to 6 characters",
      ],
      error: "Bad Request",
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SuccessResponseDto> {
    const data = await this.authService.register(registerDto);

    response.cookie("access_token", data.data.access_token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development", // false in dev, true in prod
      path: "/",
      // domain: "localhost",
    });

    response.cookie("refresh_token", data.data.refresh_token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development", // false in dev, true in prod
      path: "/", // could be /auth/refresh
      // domain: "localhost",
    });

    return data;
  }

  @Post("login")
  @ApiOperation({
    summary: "User login",
    description: "Authenticate user with email and password",
  })
  @ApiBody({
    type: LoginDto,
    description: "User login credentials",
    examples: {
      example1: {
        summary: "Example login",
        description: "A sample user login",
        value: {
          email: "john.doe@example.com",
          password: "securePassword123",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User successfully logged in",
    type: SuccessResponseDto,
    example: {
      message: "User successfully logged in",
      data: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "john.doe@example.com",
          name: "John Doe",
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: ErrorResponseDto,
    example: {
      statusCode: 401,
      message: "Invalid credentials",
      error: "Unauthorized",
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: ErrorResponseDto,
    example: {
      statusCode: 400,
      message: ["email must be a valid email", "password should not be empty"],
      error: "Bad Request",
    },
  })
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<SuccessResponseDto> {
    const data = await this.authService.login(loginDto);

    response.cookie("access_token", data.data.access_token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development", // false in dev, true in prod
      path: "/",
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      // domain: "localhost",
    });

    response.cookie("refresh_token", data.data.refresh_token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development", // false in dev, true in prod
      path: "/", // could be /auth/refresh
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      // domain: "localhost",
    });

    return data;
  }

  @Post("refresh")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Refresh access token",
    description: "Get a new access token using refresh token",
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: "Refresh token",
    examples: {
      example1: {
        summary: "Example refresh",
        description: "A sample refresh token request",
        value: {
          refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Token refreshed successfully",
    type: SuccessResponseDto,
    example: {
      message: "Token refreshed successfully",
      data: {
        access_token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
        refresh_token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid refresh token",
    type: ErrorResponseDto,
    example: {
      statusCode: 401,
      message: "Invalid refresh token",
      error: "Unauthorized",
    },
  })
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @Body() refreshTokenDto: RefreshTokenDto,
    @Request() req: ExpressRequest,
  ): Promise<SuccessResponseDto> {
    // Prefer refresh_token from cookie for modern clients, fallback to body for legacy
    const refreshToken =
      req.cookies?.refresh_token || refreshTokenDto.refresh_token;
    const data = await this.authService.refreshToken({
      refresh_token: refreshToken,
    });

    response.cookie("access_token", data.data.access_token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development",
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      path: "/",
    });
    response.cookie("refresh_token", data.data.refresh_token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      path: "/",
    });

    return data;
  }

  @Post("forgot-password")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Request password reset",
    description: "Send a password reset link to user email",
  })
  @ApiBody({
    type: ForgotPasswordDto,
    description: "User email for password reset",
    examples: {
      example1: {
        summary: "Example forgot password",
        description: "A sample forgot password request",
        value: {
          email: "john.doe@example.com",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password reset email sent (if email exists)",
    type: SuccessResponseDto,
    example: {
      message: "If the email exists, a password reset link has been sent.",
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: ErrorResponseDto,
    example: {
      statusCode: 400,
      message: ["email must be a valid email"],
      error: "Bad Request",
    },
  })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<SuccessResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post("reset-password")
  @ApiOperation({
    summary: "Reset password",
    description: "Reset user password using reset token",
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: "Reset token and new password",
    examples: {
      example1: {
        summary: "Example reset password",
        description: "A sample password reset",
        value: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          new_password: "newSecurePassword123",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password reset successfully",
    type: SuccessResponseDto,
    example: {
      message: "Password reset successfully",
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid or expired reset token",
    type: ErrorResponseDto,
    example: {
      statusCode: 400,
      message: "Invalid or expired reset token",
      error: "Bad Request",
    },
  })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<SuccessResponseDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post("request-email-verification")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Request email verification",
    description: "Request email verification token",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Email verication sent.",
    type: SuccessResponseDto,
    example: {
      message: "If the email exists, an email verification link has been sent.",
    },
  })
  async requestEmailVerification(@Req() req: Request & { user: any }) {
    await this.authService.requestEmailVerification(req.user.id);
    return { message: "Verification email sent if not already verified." };
  }

  @Get("verify-email")
  @ApiOperation({
    summary: "Verify email",
    description: "Verify user email using verification token",
  })
  @ApiQuery({
    name: "token",
    description: "Email verification token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Email verified successfully",
    type: SuccessResponseDto,
    example: {
      message: "Email verified successfully",
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid or expired verification token",
    type: ErrorResponseDto,
    example: {
      statusCode: 400,
      message: "Invalid or expired verification token",
      error: "Bad Request",
    },
  })
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Query("token") token: string,
  ): Promise<SuccessResponseDto> {
    return this.authService.verifyEmail(token);
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get current user profile",
    description: "Retrieve the authenticated user profile information",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User profile retrieved successfully",
    type: SuccessResponseDto,
    example: {
      message: "User profile retrieved successfully",
      data: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "john.doe@example.com",
        name: "John Doe",
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing token",
    type: ErrorResponseDto,
    example: {
      statusCode: 401,
      message: "Unauthorized",
      error: "Unauthorized",
    },
  })
  getProfile(@Request() req: { user: UserResponseDto }): SuccessResponseDto {
    return { message: "User profile retrieved successfully", data: req.user };
  }

  @Patch("me")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Update user profile",
    description: "Update the authenticated user profile information",
  })
  @ApiBody({
    type: UpdateProfileDto,
    description: "Profile update data",
    examples: {
      example1: {
        summary: "Example profile update",
        description: "A sample profile update",
        value: {
          name: "John Updated",
          email: "john.updated@example.com",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Profile updated successfully",
    type: SuccessResponseDto,
    example: {
      message: "Profile updated successfully",
      data: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "john.updated@example.com",
        name: "John Updated",
      },
    },
  })
  @ApiConflictResponse({
    description: "Email already exists",
    type: ErrorResponseDto,
    example: {
      statusCode: 409,
      message: "Email already exists",
      error: "Conflict",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing token",
    type: ErrorResponseDto,
    example: {
      statusCode: 401,
      message: "Unauthorized",
      error: "Unauthorized",
    },
  })
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req: { user: UserResponseDto },
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<SuccessResponseDto> {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post("change-password")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Change user password",
    description: "Change the authenticated user password",
  })
  @ApiBody({
    type: ChangePasswordDto,
    description: "Current and new password",
    examples: {
      example1: {
        summary: "Example change password",
        description: "A sample password change",
        value: {
          current_password: "currentPassword123",
          new_password: "newSecurePassword123",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password changed successfully",
    type: SuccessResponseDto,
    example: {
      message: "Password changed successfully",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing token / Current password incorrect",
    type: ErrorResponseDto,
    example: {
      statusCode: 401,
      message: "Current password is incorrect",
      error: "Unauthorized",
    },
  })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req: { user: UserResponseDto },
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<SuccessResponseDto> {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }

  @Post("logout")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "User logout",
    description:
      "Logout the authenticated user and optionally revoke refresh token",
  })
  @ApiBody({
    required: false,
    schema: {
      type: "object",
      properties: {
        refresh_token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
    },
    description: "Optional refresh token to revoke",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User successfully logged out",
    type: SuccessResponseDto,
    example: {
      message: "Successfully logged out",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing token",
    type: ErrorResponseDto,
    example: {
      statusCode: 401,
      message: "Unauthorized",
      error: "Unauthorized",
    },
  })
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) response: Response,
    @Body() body?: { refresh_token?: string },
  ): Promise<SuccessResponseDto> {
    // Prefer refresh_token from cookie for modern clients, fallback to body for legacy
    const refreshToken = req.cookies?.refresh_token || body?.refresh_token;
    const result = await this.authService.logout(refreshToken);

    // Clear cookies for modern clients
    response.clearCookie("access_token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development",
      path: "/",
    });
    response.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development",
      path: "/",
    });

    return result;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("verify-token")
  @ApiOperation({
    summary: "Verify JWT token",
    description:
      "Verify if the provided JWT token is valid and return user info",
  })
  @ApiBearerAuth("JWT-auth")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Token is valid",
    schema: {
      type: "object",
      properties: {
        valid: {
          type: "boolean",
          example: true,
        },
        user: {
          $ref: "#/components/schemas/UserResponseDto",
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or expired token",
    type: ErrorResponseDto,
    example: {
      statusCode: 401,
      message: "Unauthorized",
      error: "Unauthorized",
    },
  })
  verifyToken(@Request() req: { user: UserResponseDto }): SuccessResponseDto {
    return {
      message: "Token is valid",
      data: {
        valid: true,
        user: req.user,
      },
    };
  }

  // Legacy endpoint for backward compatibility
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @Get("profile")
  @ApiOperation({
    summary: "Get user profile (legacy)",
    description:
      "Retrieve the authenticated user profile information - use /auth/me instead",
    deprecated: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User profile retrieved successfully",
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing token",
    type: ErrorResponseDto,
  })
  getProfileLegacy(
    @Request() req: { user: UserResponseDto },
  ): SuccessResponseDto {
    return {
      message: "User profile retrieved successfully",
      data: req.user,
    };
  }
}
