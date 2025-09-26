import { HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UserResponseDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, UpdateProfileDto, RefreshTokenDto, GoogleExchangeTokenDto } from './dto/auth.dto';
import { SuccessResponseDto } from '@/common/dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<SuccessResponseDto<{
        access_token: string;
        refresh_token: string;
    }>>;
    login(loginDto: LoginDto): Promise<SuccessResponseDto<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>>;
    exchangeGoogleIdToken(googleExchangeTokenDto: GoogleExchangeTokenDto): Promise<SuccessResponseDto<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<SuccessResponseDto<{
        access_token: string;
        refresh_token: string;
    }>>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<SuccessResponseDto<void>>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<SuccessResponseDto<void>>;
    requestEmailVerification(req: Request & {
        user: any;
    }): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<SuccessResponseDto<void>>;
    checkUser(fieldType: string, fieldValue: string): Promise<HttpException | {
        message: string;
    }>;
    getProfile(req: {
        user: UserResponseDto;
    }): SuccessResponseDto<UserResponseDto>;
    updateProfile(req: {
        user: UserResponseDto;
    }, updateProfileDto: UpdateProfileDto): Promise<SuccessResponseDto<UserResponseDto>>;
    deleteUser(req: {
        user: UserResponseDto;
    }): Promise<SuccessResponseDto<void>>;
    changePassword(req: {
        user: UserResponseDto;
    }, changePasswordDto: ChangePasswordDto): Promise<SuccessResponseDto<void>>;
    logout(body?: {
        refresh_token?: string;
    }): Promise<SuccessResponseDto<void>>;
    verifyToken(req: {
        user: UserResponseDto;
    }): SuccessResponseDto<{
        valid: boolean;
        user: UserResponseDto;
    }>;
    getProfileLegacy(req: {
        user: UserResponseDto;
    }): SuccessResponseDto<UserResponseDto>;
}
