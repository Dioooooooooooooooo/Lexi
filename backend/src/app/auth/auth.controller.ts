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
  Req,
} from "@nestjs/common";
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
  GoogleExchangeTokenDto,
} from "./dto/auth.dto";
import { ErrorResponseDto, SuccessResponseDto } from "@/common/dto";
import { OAuth2Client } from "google-auth-library";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    summary: "Register a new user",
    description: "Create a new user account with email and password",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User successfully registered",
    type: AuthResponseDto,
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
  @ApiConflictResponse({
    description: "User already exists",
    type: ErrorResponseDto,
    example: {
      message: "User already exists",
      error: "Conflict",
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: ErrorResponseDto,
    example: {
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
  ): Promise<
    SuccessResponseDto<{ access_token: string; refresh_token: string }>
  > {
    const data = await this.authService.register(registerDto);

    return {
      message: "User successfully registered",
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      },
    };
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
      message: "Invalid credentials",
      error: "Unauthorized",
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: ErrorResponseDto,
    example: {
      message: ["email must be a valid email", "password should not be empty"],
      error: "Bad Request",
    },
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<
    SuccessResponseDto<{
      access_token: string;
      refresh_token: string;
      user: any;
    }>
  > {
    const data = await this.authService.login(loginDto);

    return {
      message: "User successfully logged in",
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      },
    };
  }

  @Post("google/token")
  @ApiOperation({
    summary: "Exchange Google id_token for app tokens",
  })
  @ApiResponse({ status: HttpStatus.OK, type: SuccessResponseDto })
  async exchangeGoogleIdToken(
    @Body() googleExchangeTokenDto: GoogleExchangeTokenDto,
  ): Promise<
    SuccessResponseDto<{
      access_token: string;
      refresh_token: string;
      user: any;
    }>
  > {
    const data = await this.authService.exchangeGoogleIdToken(
      googleExchangeTokenDto.id_token,
    );

    return {
      message: "Authentication successful",
      data,
    };
  }

  @Post("refresh")
  @ApiOperation({
    summary: "Refresh access token",
    description: "Get a new access token using refresh token",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Token refreshed successfully",
    type: SuccessResponseDto,
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
      message: "Invalid refresh token",
      error: "Unauthorized",
    },
  })
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<
    SuccessResponseDto<{ access_token: string; refresh_token: string }>
  > {
    const refreshToken = refreshTokenDto.refresh_token;
    const data = await this.authService.refreshToken({
      refresh_token: refreshToken,
    });

    return {
      message: "Token refreshed successfully",
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      },
    };
  }

  @Post("forgot-password")
  @ApiOperation({
    summary: "Request password reset",
    description: "Send a password reset link to user email",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password reset email sent (if email exists)",
    type: SuccessResponseDto,
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
    type: SuccessResponseDto<void>,
    example: {
      message: "If the email exists, a password reset link has been sent.",
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: ErrorResponseDto,
    example: {
      message: ["email must be a valid email"],
      error: "Bad Request",
    },
  })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<SuccessResponseDto<void>> {
    await this.authService.forgotPassword(forgotPasswordDto);

    return {
      message: "If the email exists, a password reset link has been sent.",
    };
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
    type: SuccessResponseDto<void>,
    example: {
      message: "Password reset successfully",
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid or expired reset token",
    type: ErrorResponseDto,
    example: {
      message: "Invalid or expired reset token",
      error: "Bad Request",
    },
  })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<SuccessResponseDto<void>> {
    await this.authService.resetPassword(resetPasswordDto);

    return { message: "Password reset successfully" };
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
    type: SuccessResponseDto<void>,
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
    type: SuccessResponseDto<void>,
    example: {
      message: "Email verified successfully",
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid or expired verification token",
    type: ErrorResponseDto,
    example: {
      message: "Invalid or expired verification token",
      error: "Bad Request",
    },
  })
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Query("token") token: string,
  ): Promise<SuccessResponseDto<void>> {
    await this.authService.verifyEmail(token);
    return { message: "Email verified successfully" };
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
      message: "Unauthorized",
      error: "Unauthorized",
    },
  })
  getProfile(
    @Request() req: { user: UserResponseDto },
  ): SuccessResponseDto<UserResponseDto> {
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
      message: "Email already exists",
      error: "Conflict",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing token",
    type: ErrorResponseDto,
    example: {
      message: "Unauthorized",
      error: "Unauthorized",
    },
  })
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req: { user: UserResponseDto },
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<SuccessResponseDto<UserResponseDto>> {
    console.log('UpdateProfileDto:', updateProfileDto);
    await this.authService.updateProfile(req.user.id, updateProfileDto);
    return {
      message: "User profile successfully updated",
    };
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
    type: SuccessResponseDto<void>,
    example: {
      message: "Password changed successfully",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing token / Current password incorrect",
    type: ErrorResponseDto,
    example: {
      message: "Current password is incorrect",
      error: "Unauthorized",
    },
  })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req: { user: UserResponseDto },
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<SuccessResponseDto<void>> {
    await this.authService.changePassword(req.user.id, changePasswordDto);
    return { message: "Password changed successfully" };
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
    type: SuccessResponseDto<void>,
    example: {
      message: "Successfully logged out",
    },
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing token",
    type: ErrorResponseDto,
    example: {
      message: "Unauthorized",
      error: "Unauthorized",
    },
  })
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body() body?: { refresh_token?: string },
  ): Promise<SuccessResponseDto<void>> {
    const refreshToken = body?.refresh_token;
    await this.authService.logout(refreshToken);

    return { message: "Successfully logged out" };
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
      message: "Unauthorized",
      error: "Unauthorized",
    },
  })
  verifyToken(
    @Request() req: { user: UserResponseDto },
  ): SuccessResponseDto<{ valid: boolean; user: UserResponseDto }> {
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
  ): SuccessResponseDto<UserResponseDto> {
    return {
      message: "User profile retrieved successfully",
      data: req.user,
    };
  }
}
