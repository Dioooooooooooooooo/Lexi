export declare class RegisterDto {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    role: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    new_password: string;
}
export declare class ChangePasswordDto {
    current_password: string;
    new_password: string;
}
export declare class UpdateRoleDto {
    email: string;
    role: string;
}
export declare class UpdateProfileDto {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    avatar?: string;
}
export declare class RefreshTokenDto {
    refresh_token: string;
}
export declare class UserResponseDto {
    id: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    role: string | null;
    created_at?: Date;
    updated_at?: Date;
}
export declare class AuthResponseDto {
    access_token: string;
    user: UserResponseDto;
    refresh_token?: string;
}
export declare class GoogleExchangeTokenDto {
    id_token: string;
}
