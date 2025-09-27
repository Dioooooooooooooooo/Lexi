import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  MaxLength,
  IsIn,
  IsUrl,
  IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Match } from "@/validators/match.decorator";

export class RegisterDto {
  @ApiProperty({
    description: "Username",
    example: "johndoe1",
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  username: string;

  @ApiProperty({
    description: "User first name",
    example: "John",
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  first_name: string;

  @ApiProperty({ description: "User last name", example: "Doe", minLength: 1 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  last_name: string;

  @ApiProperty({ description: "User email", example: "john.doe@example.com" })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ description: "User password", example: "securePassword123" })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @ApiProperty({
    description: "Password confirmation",
    example: "securePassword123",
  })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @Match("password", { message: "Passwords do not match" })
  confirm_password: string;

  @ApiProperty({
    description: "User role",
    example: "Pupil",
    enum: ["Pupil", "Teacher"],
  })
  @IsString()
  @MaxLength(255)
  @IsIn(["Pupil", "Teacher"])
  role: string;
}

export class LoginDto {
  @ApiProperty({ description: "User email", example: "john.doe@example.com" })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ description: "User password", example: "securePassword123" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ description: "User email", example: "john.doe@example.com" })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: "Reset token" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  token: string;

  @ApiProperty({ description: "New password", example: "newSecurePassword123" })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  new_password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: "Current password" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  current_password: string;

  @ApiProperty({ description: "New password" })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  new_password: string;
}

export class UpdateRoleDto {
  @ApiProperty({ description: "User email", example: "john.doe@example.com" })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ description: "New role", example: "Staff" })
  @IsString()
  @MaxLength(255)
  role: string;
}

export class UpdateProfileDto {
  @ApiProperty({
    description: "Username",
    example: "janes123",
    required: false,
    minLength: 8,
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(255)
  username?: string;

  @ApiProperty({
    description: "First name",
    example: "Jane",
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  first_name?: string;

  @ApiProperty({
    description: "Last name",
    example: "Smith",
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  last_name?: string;

  @ApiProperty({ description: "Email address", required: false })
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @ApiProperty({ description: "Avatar", required: false })
  @IsUrl()
  @IsOptional()
  @MaxLength(2048)
  avatar?: string;

  @ApiProperty({ description: "Age", required: false})
  @IsOptional()
  @IsNumber()
  age?: number
}

export class RefreshTokenDto {
  @ApiProperty({ description: "Refresh token" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  refresh_token: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: "User ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({ description: "Email", nullable: true })
  @MaxLength(255)
  email: string | null;

  @ApiProperty({ description: "First name", nullable: true })
  @MaxLength(255)
  first_name: string | null;

  @ApiProperty({ description: "Last name", nullable: true })
  @MaxLength(255)
  last_name: string | null;

  @ApiProperty({ description: "User role", nullable: true })
  @MaxLength(255)
  role: string | null;

  @ApiProperty({ description: "Created at", required: false })
  created_at?: Date;

  @ApiProperty({ description: "Created at", required: false })
  updated_at?: Date;
}

export class AuthResponseDto {
  @ApiProperty({ description: "Access token" })
  @MaxLength(255)
  access_token: string;

  @ApiProperty({ description: "User info", type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ description: "Refresh token", required: false })
  @MaxLength(255)
  refresh_token?: string;
}

export class GoogleExchangeTokenDto {
  @ApiProperty({ description: "Google ID Token", required: true })
  @IsString()
  @IsNotEmpty()
  id_token: string;
}
