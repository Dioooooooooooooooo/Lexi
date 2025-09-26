import { DB } from '@/database/db';
import { JwtService } from '@nestjs/jwt';
import { Kysely } from 'kysely';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { ChangePasswordDto, ForgotPasswordDto, LoginDto, RefreshTokenDto, RegisterDto, ResetPasswordDto, UpdateProfileDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly db;
    private jwtService;
    private readonly emailService;
    private readonly userService;
    constructor(db: Kysely<DB>, jwtService: JwtService, emailService: EmailService, userService: UserService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            created_at: Date;
            id: string;
            updated_at: Date;
            username: string;
            first_name: string;
            last_name: string;
            email: string;
            avatar: string;
            is_email_verified: boolean;
            is_phone_verified: boolean;
            phone: string;
            role: string;
        };
    }>;
    deleteUser(userId: string): Promise<{
        is_deleted: boolean;
    }>;
    checkUserExists(fieldType: string, fieldValue: string): Promise<boolean>;
    exchangeGoogleIdToken(idToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            email: string;
            first_name: string;
            last_name: string;
            username: string;
            role: string;
        };
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void>;
    requestEmailVerification(userId: string): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        created_at: Date;
        id: string;
        updated_at: Date;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        avatar: string;
        is_email_verified: boolean;
        is_phone_verified: boolean;
        phone: string;
        role: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    logout(refreshToken?: string): Promise<void>;
    validateUser(payload: {
        sub: string;
        email: string;
    }): Promise<{
        created_at: Date;
        id: string;
        updated_at: Date;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        avatar: string;
        is_email_verified: boolean;
        is_phone_verified: boolean;
        phone: string;
        role: string;
    }>;
    validateGoogleUser(profile: unknown): Promise<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        username: string;
        role: string;
    }>;
    validateGoogleIdToken(idToken: string): Promise<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        username: string;
        role: string;
    }>;
    generateTokens(userId: string, email: string, role: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    private generateEmailVerificationToken;
}
