import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import * as crypto from "crypto";
import { KyselyDatabaseService } from "@/database/kysely-database.service";
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateProfileDto,
  RefreshTokenDto,
} from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private dbService: KyselyDatabaseService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const db = this.dbService.database;

    // Check if user already exists
    const existing = await db
      .selectFrom("auth.users")
      .select(["id", "email", "username"])
      .where((eb) =>
        eb.or([
          eb("email", "=", registerDto.email),
          eb("username", "=", registerDto.username),
        ]),
      )
      .execute();

    if (existing.length > 0) {
      const hasEmail = existing.some((u) => u.email === registerDto.email);
      const hasUsername = existing.some(
        (u) => u.username === registerDto.username,
      );

      if (hasEmail && hasUsername) {
        throw new ConflictException("Email and username already exist");
      } else if (hasEmail) {
        throw new ConflictException("Email already exists");
      } else {
        throw new ConflictException("Username already exists");
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const { password, confirm_password, role, ...userData } = registerDto;

    // Create user
    const user = await db
      .insertInto("auth.users")
      .values({
        ...userData,
        is_email_verified: false,
        is_phone_verified: false,
      })
      .returningAll()
      .executeTakeFirst();

    if (!user) {
      throw new Error("Failed to create user");
    }

    // Create auth provider entry
    await db
      .insertInto("auth.auth_providers")
      .values({
        id: uuidv4(),
        user_id: user.id,
        provider_type: "email",
        password_hash: hashedPassword,
        email: registerDto.email,
      })
      .execute();

    const dbRole = await db
      .selectFrom("auth.roles")
      .select("id")
      .where("name", "=", registerDto.role)
      .executeTakeFirstOrThrow(
        () => new Error(`Role "${registerDto.role}" not found`),
      );

    // Assign role to user
    await db
      .insertInto("auth.user_roles")
      .values({
        user_id: user.id,
        role_id: dbRole.id,
      })
      .execute();

    // Generate email verification token
    await this.generateEmailVerificationToken(user.id);

    // Generate JWT tokens
    const tokens = await this.generateTokens(
      user.id,
      user.email!,
      registerDto.role,
    );

    return {
      message: "User successfully registered",
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const db = this.dbService.database;

    // Find user and auth provider
    const userWithProvider = await db
      .selectFrom("auth.users")
      .leftJoin(
        "auth.auth_providers",
        "auth.users.id",
        "auth.auth_providers.user_id",
      )
      .leftJoin("auth.user_roles", "auth.users.id", "auth.user_roles.user_id")
      .leftJoin("auth.roles", "auth.user_roles.role_id", "auth.roles.id")
      .select([
        "auth.users.id",
        "auth.users.username",
        "auth.users.email",
        "auth.users.first_name",
        "auth.users.last_name",
        "auth.users.avatar",
        "auth.users.phone",
        "auth.users.is_email_verified",
        "auth.users.is_phone_verified",
        "auth.users.created_at",
        "auth.users.updated_at",
        "auth.auth_providers.password_hash",
        "auth.roles.name as role",
      ])
      .where("auth.users.email", "=", loginDto.email)
      .where("auth.auth_providers.provider_type", "=", "email")
      .executeTakeFirst();

    if (!userWithProvider || !userWithProvider.password_hash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      userWithProvider.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Log the login
    await db
      .insertInto("auth.login_logs")
      .values({
        id: uuidv4(),
        user_id: userWithProvider.id,
        logged_in_at: new Date(),
      })
      .execute();

    // Generate JWT tokens
    const tokens = await this.generateTokens(
      userWithProvider.id,
      userWithProvider.email!,
      userWithProvider.role!,
    );

    const { password_hash, ...user } = userWithProvider;
    return {
      message: "User successfully logged in",
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const db = this.dbService.database;

    // Find and validate refresh token
    const refreshToken = await db
      .selectFrom("auth.refresh_tokens")
      .leftJoin("auth.users", "auth.refresh_tokens.user_id", "auth.users.id")
      .leftJoin("auth.user_roles", "auth.users.id", "auth.user_roles.user_id")
      .leftJoin("auth.roles", "auth.user_roles.role_id", "auth.roles.id")
      .select([
        "auth.refresh_tokens.id as token_id",
        "auth.refresh_tokens.user_id",
        "auth.refresh_tokens.expires_at",
        "auth.refresh_tokens.revoked",
        "auth.users.email",
        "auth.roles.name as role",
      ])
      .where("auth.refresh_tokens.token", "=", refreshTokenDto.refresh_token)
      .executeTakeFirst();

    if (
      !refreshToken ||
      refreshToken.revoked ||
      new Date() > refreshToken.expires_at
    ) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    // Revoke the old refresh token
    await db
      .updateTable("auth.refresh_tokens")
      .set({ revoked: true })
      .where("id", "=", refreshToken.token_id)
      .execute();

    // Generate new tokens
    const tokens = await this.generateTokens(
      refreshToken.user_id,
      refreshToken.email!,
      refreshToken.role!,
    );

    return {
      message: "Token refreshed successfully",
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const db = this.dbService.database;

    // Find user by email
    const user = await db
      .selectFrom("auth.users")
      .select(["id", "email"])
      .where("email", "=", forgotPasswordDto.email)
      .executeTakeFirst();

    if (!user) {
      // Don't reveal if email exists - just return success
      return {
        message: "If the email exists, a password reset link has been sent.",
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Store reset token
    await db
      .insertInto("auth.password_reset_tokens")
      .values({
        id: uuidv4(),
        user_id: user.id,
        token: hashedToken,
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        used: false,
      })
      .execute();

    // In a real app, you would send an email here
    // For now, just return the token (remove this in production)
    console.log(`Password reset token for ${user.email}: ${resetToken}`);

    return {
      message: "If the email exists, a password reset link has been sent.",
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const db = this.dbService.database;

    // Hash the token to find it in the database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetPasswordDto.token)
      .digest("hex");

    // Find valid reset token
    const resetToken = await db
      .selectFrom("auth.password_reset_tokens")
      .select(["id", "user_id", "expires_at", "used"])
      .where("token", "=", hashedToken)
      .executeTakeFirst();

    if (!resetToken || resetToken.used || new Date() > resetToken.expires_at) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.new_password,
      saltRounds,
    );

    // Update password
    await db
      .updateTable("auth.auth_providers")
      .set({ password_hash: hashedPassword })
      .where("user_id", "=", resetToken.user_id)
      .where("provider_type", "=", "email")
      .execute();

    // Mark token as used
    await db
      .updateTable("auth.password_reset_tokens")
      .set({ used: true })
      .where("id", "=", resetToken.id)
      .execute();

    return { message: "Password reset successfully" };
  }

  async requestEmailVerification(userId: string) {
    const db = this.dbService.database;
    const user = await db
      .selectFrom("auth.users")
      .select(["id", "email", "is_email_verified"])
      .where("id", "=", userId)
      .executeTakeFirst();

    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (user.is_email_verified) {
      throw new BadRequestException("Email already verified");
    }

    const token = await this.generateEmailVerificationToken(userId);
    console.log("Email validation token: " + token);
  }

  async verifyEmail(token: string) {
    const db = this.dbService.database;

    // Find valid verification token
    const verificationToken = await db
      .selectFrom("auth.email_verification_tokens")
      .select(["id", "user_id", "expires_at", "used"])
      .where("token", "=", token)
      .executeTakeFirst();

    if (
      !verificationToken ||
      verificationToken.used ||
      new Date() > verificationToken.expires_at
    ) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    // Mark email as verified
    await db
      .updateTable("auth.users")
      .set({ is_email_verified: true })
      .where("id", "=", verificationToken.user_id)
      .execute();

    // Mark token as used
    await db
      .updateTable("auth.email_verification_tokens")
      .set({ used: true })
      .where("id", "=", verificationToken.id)
      .execute();

    return { message: "Email verified successfully" };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const db = this.dbService.database;

    // Check for email uniqueness if updating email
    if (updateProfileDto.email) {
      const existingUser = await db
        .selectFrom("auth.users")
        .select("id")
        .where("email", "=", updateProfileDto.email)
        .where("id", "!=", userId)
        .executeTakeFirst();

      if (existingUser) {
        throw new ConflictException("Email already exists");
      }
    }

    // Update user
    await db
      .updateTable("auth.users")
      .set(updateProfileDto)
      .where("id", "=", userId)
      .execute();

    // If email was changed, generate new verification token
    if (updateProfileDto.email) {
      await this.generateEmailVerificationToken(userId);
    }

    // Return updated user with role
    const updatedUser = await db
      .selectFrom("auth.users")
      .innerJoin("auth.user_roles", "auth.users.id", "auth.user_roles.user_id")
      .innerJoin("auth.roles", "auth.user_roles.role_id", "auth.roles.id")
      .select([
        "auth.users.id",
        "auth.users.username",
        "auth.users.email",
        "auth.users.first_name",
        "auth.users.last_name",
        "auth.users.avatar",
        "auth.users.phone",
        "auth.users.is_email_verified",
        "auth.users.is_phone_verified",
        "auth.users.created_at",
        "auth.users.updated_at",
        "auth.roles.name as role",
      ])
      .where("auth.users.id", "=", userId)
      .executeTakeFirstOrThrow(() => new NotFoundException("User not found"));

    return { message: "Profile updated successfully", data: updatedUser };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const db = this.dbService.database;

    // Get current password hash
    const authProvider = await db
      .selectFrom("auth.auth_providers")
      .select(["password_hash"])
      .where("user_id", "=", userId)
      .where("provider_type", "=", "email")
      .executeTakeFirst();

    if (!authProvider || !authProvider.password_hash) {
      throw new NotFoundException("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.current_password,
      authProvider.password_hash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.new_password,
      saltRounds,
    );

    // Update password
    await db
      .updateTable("auth.auth_providers")
      .set({ password_hash: hashedPassword })
      .where("user_id", "=", userId)
      .where("provider_type", "=", "email")
      .execute();

    return { message: "Password changed successfully" };
  }

  async logout(refreshToken?: string): Promise<{ message: string }> {
    if (refreshToken) {
      const db = this.dbService.database;

      // Revoke the refresh token
      await db
        .updateTable("auth.refresh_tokens")
        .set({ revoked: true })
        .where("token", "=", refreshToken)
        .execute();
    }

    return { message: "Successfully logged out" };
  }

  async validateUser(payload: { sub: string; email: string }) {
    const db = this.dbService.database;

    const user: any = await db
      .selectFrom("auth.users")
      .leftJoin("auth.user_roles", "auth.users.id", "auth.user_roles.user_id")
      .leftJoin("auth.roles", "auth.user_roles.role_id", "auth.roles.id")
      .select([
        "auth.users.id",
        "auth.users.username",
        "auth.users.email",
        "auth.users.first_name",
        "auth.users.last_name",
        "auth.users.avatar",
        "auth.users.phone",
        "auth.users.is_email_verified",
        "auth.users.is_phone_verified",
        "auth.users.created_at",
        "auth.users.updated_at",
        "auth.roles.name as role",
      ])
      .where("auth.users.id", "=", payload.sub)
      .executeTakeFirst();

    if (user.role === "Teacher") {
      const teacher = await db
        .selectFrom("public.teachers as t")
        .where("t.user_id", "=", user.id)
        .selectAll()
        .executeTakeFirstOrThrow(
          () => new NotFoundException("Teacher does not exist"),
        );
      user.teacher = teacher;
    }

    if (user.role === "Pupil") {
      const pupil = await db
        .selectFrom("public.pupils as p")
        .where("p.user_id", "=", user.id)
        .selectAll()
        .executeTakeFirstOrThrow(
          () => new NotFoundException("Teacher does not exist"),
        );
      user.pupil = pupil;
    }

    if (!user) {
      return null;
    }

    return user;
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const db = this.dbService.database;
    const payload: any = { sub: userId, email: email, role: role };

    if (role === "Teacher") {
      const teacher = await db
        .selectFrom("public.teachers as t")
        .where("t.user_id", "=", userId)
        .selectAll()
        .executeTakeFirstOrThrow(
          () => new NotFoundException("Teacher does not exist"),
        );
      payload.teacher = teacher;
    }

    if (role === "Pupil") {
      const pupil = await db
        .selectFrom("public.pupils as p")
        .where("p.user_id", "=", userId)
        .selectAll()
        .executeTakeFirstOrThrow(
          () => new NotFoundException("Teacher does not exist"),
        );
      payload.pupil = pupil;
    }

    // Generate access token
    const access_token = this.jwtService.sign(payload);

    // Generate refresh token
    const refresh_token = crypto.randomBytes(32).toString("hex");

    // Store refresh token
    await db
      .insertInto("auth.refresh_tokens")
      .values({
        id: uuidv4(),
        user_id: userId,
        token: refresh_token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        revoked: false,
      })
      .execute();

    return { access_token, refresh_token };
  }

  private async generateEmailVerificationToken(userId: string) {
    const db = this.dbService.database;
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await db
      .insertInto("auth.email_verification_tokens")
      .values({
        id: uuidv4(),
        user_id: userId,
        token: verificationToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        used: false,
      })
      .execute();

    // In a real app, you would send an email here
    console.log(
      `Email verification token for user ${userId}: ${verificationToken}`,
    );

    return verificationToken;
  }
}
