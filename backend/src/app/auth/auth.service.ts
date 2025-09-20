import { AccessTokenPayload } from '@/common/types/jwt.types';
import { DB } from '@/database/db';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { Kysely } from 'kysely';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from './dto/auth.dto';
import { ImagekitService } from '../imagekit/imagekit.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE') private readonly db: Kysely<DB>,
    private jwtService: JwtService,
    // EmailService injected to send onboarding / reset / verify emails
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly imageKitService: ImagekitService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existing = await this.db
      .selectFrom('auth.users')
      .select(['id', 'email', 'username'])
      .where(eb =>
        eb.or([
          eb('email', '=', registerDto.email),
          eb('username', '=', registerDto.username),
        ]),
      )
      .execute();

    if (existing.length > 0) {
      const hasEmail = existing.some(u => u.email === registerDto.email);
      const hasUsername = existing.some(
        u => u.username === registerDto.username,
      );

      if (hasEmail && hasUsername) {
        throw new ConflictException('Email and username already exist');
      } else if (hasEmail) {
        throw new ConflictException('Email already exists');
      } else {
        throw new ConflictException('Username already exists');
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword: string = await (
      bcrypt as {
        hash: (data: string, salt: number) => Promise<string>;
      }
    ).hash(registerDto.password, saltRounds);

    const { password, confirm_password, role, ...userData } = registerDto;

    // Create user
    const user = await this.db
      .insertInto('auth.users')
      .values({
        ...userData,
        is_email_verified: false,
        is_phone_verified: false,
      })
      .returningAll()
      .executeTakeFirst();

    if (!user) {
      throw new Error('Failed to create user');
    }

    // Create auth provider entry
    await this.db
      .insertInto('auth.auth_providers')
      .values({
        id: uuidv4(),
        user_id: user.id,
        provider_type: 'email',
        password_hash: hashedPassword,
        email: registerDto.email,
      })
      .execute();

    const dbRole = await this.db
      .selectFrom('auth.roles')
      .select('id')
      .where('name', '=', role)
      .executeTakeFirstOrThrow(() => new Error(`Role "${role}" not found`));

    // Assign role to user
    await this.db
      .insertInto('auth.user_roles')
      .values({
        user_id: user.id,
        role_id: dbRole.id,
      })
      .execute();

    // Generate email verification token
    const token = await this.generateEmailVerificationToken(user.id);

    // Send onboarding and verification email (non-blocking)
    try {
      await this.emailService.sendOnboarding({
        email: user.email,
        name: user.first_name,
      });
      await this.emailService.sendVerifyEmail(
        { email: user.email, name: user.first_name },
        token,
      );
    } catch {
      // Email service will enqueue failed sends itself. Log and continue.
      console.warn('Email send failed during registration, queued for retry');
    }

    // Generate JWT tokens
    const tokens = await this.generateTokens(user.id, user.email, role);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user and auth provider
    const userWithProvider = await this.db
      .selectFrom('auth.users')
      .leftJoin(
        'auth.auth_providers',
        'auth.users.id',
        'auth.auth_providers.user_id',
      )
      .leftJoin('auth.user_roles', 'auth.users.id', 'auth.user_roles.user_id')
      .leftJoin('auth.roles', 'auth.user_roles.role_id', 'auth.roles.id')
      .select([
        'auth.users.id',
        'auth.users.username',
        'auth.users.email',
        'auth.users.first_name',
        'auth.users.last_name',
        'auth.users.avatar',
        'auth.users.phone',
        'auth.users.is_email_verified',
        'auth.users.is_phone_verified',
        'auth.users.created_at',
        'auth.users.updated_at',
        'auth.auth_providers.password_hash',
        'auth.roles.name as role',
      ])
      .where('auth.users.email', '=', loginDto.email)
      .where('auth.auth_providers.provider_type', '=', 'email')
      .executeTakeFirst();

    if (!userWithProvider || !userWithProvider.password_hash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid: boolean = await (
      bcrypt as {
        compare: (data: string, encrypted: string) => Promise<boolean>;
      }
    ).compare(loginDto.password, userWithProvider.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (userWithProvider.role === 'Pupil') {
      // Save login streak
      void this.userService.updateLoginStreak(userWithProvider.id);
    }

    // Generate JWT tokens
    const tokens = await this.generateTokens(
      userWithProvider.id,
      userWithProvider.email,
      userWithProvider.role,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...user } = userWithProvider;
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user,
    };
  }

  async exchangeGoogleIdToken(idToken: string) {
    if (!idToken) throw new Error('id_token required');

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const profile = {
      id: payload?.sub,
      emails: payload?.email ? [{ value: payload.email }] : [],
      name: {
        givenName: payload?.given_name,
        familyName: payload?.family_name,
      },
      displayName: payload?.name,
      photos: payload?.picture ? [{ value: payload.picture }] : [],
    };

    const user = await this.validateGoogleUser(profile);
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    // Find and validate refresh token
    const refreshToken = await this.db
      .selectFrom('auth.refresh_tokens')
      .leftJoin('auth.users', 'auth.refresh_tokens.user_id', 'auth.users.id')
      .leftJoin('auth.user_roles', 'auth.users.id', 'auth.user_roles.user_id')
      .leftJoin('auth.roles', 'auth.user_roles.role_id', 'auth.roles.id')
      .select([
        'auth.refresh_tokens.id as token_id',
        'auth.refresh_tokens.user_id',
        'auth.refresh_tokens.expires_at',
        'auth.refresh_tokens.revoked',
        'auth.users.email',
        'auth.roles.name as role',
      ])
      .where('auth.refresh_tokens.token', '=', refreshTokenDto.refresh_token)
      .executeTakeFirst();

    if (!refreshToken || refreshToken.revoked) {
      throw new UnauthorizedException('hey Invalid refresh token');
    }

    if (new Date() > refreshToken.expires_at) {
      await this.db
        .updateTable('auth.refresh_tokens')
        .set({ revoked: true })
        .where('id', '=', refreshToken.token_id)
        .execute();
    }

    // Generate new tokens
    const tokens = await this.generateTokens(
      refreshToken.user_id,
      refreshToken.email,
      refreshToken.role,
    );

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // Find user by email
    const user = await this.db
      .selectFrom('auth.users')
      .select(['id', 'email'])
      .where('email', '=', forgotPasswordDto.email)
      .executeTakeFirst();

    if (!user) {
      // Don't reveal if email exists - just return success
      return {
        message: 'If the email exists, a password reset link has been sent.',
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Store reset token
    await this.db
      .insertInto('auth.password_reset_tokens')
      .values({
        id: uuidv4(),
        user_id: user.id,
        token: hashedToken,
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        used: false,
      })
      .execute();

    // Send password reset email (non-blocking)
    try {
      await this.emailService.sendResetPassword(
        { email: user.email },
        resetToken,
      );
    } catch {
      console.warn('Failed to send reset password email, enqueued for retry');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Hash the token to find it in the database
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetPasswordDto.token)
      .digest('hex');

    // Find valid reset token
    const resetToken = await this.db
      .selectFrom('auth.password_reset_tokens')
      .select(['id', 'user_id', 'expires_at', 'used'])
      .where('token', '=', hashedToken)
      .executeTakeFirst();

    if (!resetToken || resetToken.used || new Date() > resetToken.expires_at) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword: string = await (
      bcrypt as {
        hash: (data: string, salt: number) => Promise<string>;
      }
    ).hash(resetPasswordDto.new_password, saltRounds);

    // Update password
    await this.db
      .updateTable('auth.auth_providers')
      .set({ password_hash: hashedPassword })
      .where('user_id', '=', resetToken.user_id)
      .where('provider_type', '=', 'email')
      .execute();

    // Mark token as used
    await this.db
      .updateTable('auth.password_reset_tokens')
      .set({ used: true })
      .where('id', '=', resetToken.id)
      .execute();
  }

  async requestEmailVerification(userId: string) {
    const user = await this.db
      .selectFrom('auth.users')
      .select(['id', 'email', 'is_email_verified'])
      .where('id', '=', userId)
      .executeTakeFirst();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.is_email_verified) {
      throw new BadRequestException('Email already verified');
    }

    const token = await this.generateEmailVerificationToken(userId);
    console.log('Email validation token: ' + token);
  }

  async verifyEmail(token: string) {
    // Find valid verification token
    const verificationToken = await this.db
      .selectFrom('auth.email_verification_tokens')
      .select(['id', 'user_id', 'expires_at', 'used'])
      .where('token', '=', token)
      .executeTakeFirst();

    if (
      !verificationToken ||
      verificationToken.used ||
      new Date() > verificationToken.expires_at
    ) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Mark email as verified
    await this.db
      .updateTable('auth.users')
      .set({ is_email_verified: true })
      .where('id', '=', verificationToken.user_id)
      .execute();

    // Mark token as used
    await this.db
      .updateTable('auth.email_verification_tokens')
      .set({ used: true })
      .where('id', '=', verificationToken.id)
      .execute();
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // Check for email uniqueness if updating email
    if (updateProfileDto.email) {
      const existingUser = await this.db
        .selectFrom('auth.users')
        .select('id')
        .where('email', '=', updateProfileDto.email)
        .where('id', '!=', userId)
        .executeTakeFirst();

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }
    console.log(updateProfileDto);

    if (updateProfileDto.avatarFile) {
      const avatarUrl = await this.imageKitService.uploadImageJson(updateProfileDto.avatarFile);
      updateProfileDto.avatar = avatarUrl;

      console.log(updateProfileDto);
    }

    // Update user
    await this.db
      .updateTable('auth.users')
      .set(updateProfileDto)
      .where('id', '=', userId)
      .execute();

    // If email was changed, generate new verification token
    if (updateProfileDto.email) {
      await this.generateEmailVerificationToken(userId);
    }

    // Return updated user with role
    const updatedUser = await this.db
      .selectFrom('auth.users')
      .innerJoin('auth.user_roles', 'auth.users.id', 'auth.user_roles.user_id')
      .innerJoin('auth.roles', 'auth.user_roles.role_id', 'auth.roles.id')
      .select([
        'auth.users.id',
        'auth.users.username',
        'auth.users.email',
        'auth.users.first_name',
        'auth.users.last_name',
        'auth.users.avatar',
        'auth.users.phone',
        'auth.users.is_email_verified',
        'auth.users.is_phone_verified',
        'auth.users.created_at',
        'auth.users.updated_at',
        'auth.roles.name as role',
      ])
      .where('auth.users.id', '=', userId)
      .executeTakeFirstOrThrow(() => new NotFoundException('User not found'));

    return updatedUser;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    // Get current password hash
    const authProvider = await this.db
      .selectFrom('auth.auth_providers')
      .select(['password_hash'])
      .where('user_id', '=', userId)
      .where('provider_type', '=', 'email')
      .executeTakeFirst();

    if (!authProvider || !authProvider.password_hash) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid: boolean = await (
      bcrypt as {
        compare: (data: string, encrypted: string) => Promise<boolean>;
      }
    ).compare(changePasswordDto.current_password, authProvider.password_hash);

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword: string = await (
      bcrypt as {
        hash: (data: string, salt: number) => Promise<string>;
      }
    ).hash(changePasswordDto.new_password, saltRounds);

    // Update password
    await this.db
      .updateTable('auth.auth_providers')
      .set({ password_hash: hashedPassword })
      .where('user_id', '=', userId)
      .where('provider_type', '=', 'email')
      .execute();
  }

  async logout(refreshToken?: string) {
    if (refreshToken) {
      // Revoke the refresh token
      await this.db
        .updateTable('auth.refresh_tokens')
        .set({ revoked: true })
        .where('token', '=', refreshToken)
        .execute();
    }
  }

  async validateUser(payload: { sub: string; email: string }) {
    const user = await this.db
      .selectFrom('auth.users')
      .leftJoin('auth.user_roles', 'auth.users.id', 'auth.user_roles.user_id')
      .leftJoin('auth.roles', 'auth.user_roles.role_id', 'auth.roles.id')
      .select([
        'auth.users.id',
        'auth.users.username',
        'auth.users.email',
        'auth.users.first_name',
        'auth.users.last_name',
        'auth.users.avatar',
        'auth.users.phone',
        'auth.users.is_email_verified',
        'auth.users.is_phone_verified',
        'auth.users.created_at',
        'auth.users.updated_at',
        'auth.roles.name as role',
      ])
      .where('auth.users.id', '=', payload.sub)
      .executeTakeFirstOrThrow(
        () => new NotFoundException('User does not exist'),
      );

    if (user.role === 'Teacher') {
      const teacher = await this.db
        .selectFrom('public.teachers as t')
        .where('t.user_id', '=', user.id)
        .selectAll()
        .executeTakeFirstOrThrow(
          () => new NotFoundException('Teacher does not exist'),
        );
      (user as { teacher?: unknown }).teacher = teacher;
    }

    if (user.role === 'Pupil') {
      const pupil = await this.db
        .selectFrom('public.pupils as p')
        .where('p.user_id', '=', user.id)
        .selectAll()
        .executeTakeFirstOrThrow(
          () => new NotFoundException('Pupil does not exist'),
        );
      (user as { pupil?: unknown }).pupil = pupil;
    }

    return user;
  }

  // Validate or create a user from Google profile
  async validateGoogleUser(profile: unknown) {
    const googleProfile = profile as {
      id: string;
      emails?: Array<{ value: string }>;
      name?: { givenName?: string; familyName?: string };
      displayName?: string;
      photos?: Array<{ value: string }>;
    };
    const providerId = googleProfile.id;
    // Try to find existing federated provider
    const provider = await this.db
      .selectFrom('auth.auth_providers')
      .leftJoin('auth.users', 'auth.auth_providers.user_id', 'auth.users.id')
      .leftJoin('auth.user_roles', 'auth.users.id', 'auth.user_roles.user_id')
      .leftJoin('auth.roles', 'auth.user_roles.role_id', 'auth.roles.id')
      .select([
        'auth.auth_providers.id as provider_id',
        'auth.auth_providers.user_id',
        'auth.users.id as id',
        'auth.users.email',
        'auth.users.first_name',
        'auth.users.last_name',
        'auth.users.username',
        'auth.roles.name as role',
      ])
      .where('auth.auth_providers.provider_type', '=', 'google')
      .where('auth.auth_providers.provider_user_id', '=', providerId)
      .executeTakeFirst();

    if (provider && provider.user_id) {
      // Return the existing user object shape used elsewhere
      return {
        id: provider.user_id,
        email: provider.email,
        first_name: provider.first_name,
        last_name: provider.last_name,
        username: provider.username,
        role: provider.role || 'Pupil',
      };
    }

    // No provider found -> create a new user and provider
    const email = googleProfile.emails?.[0]?.value || null;
    const firstName =
      googleProfile.name?.givenName || googleProfile.displayName || null;
    const lastName = googleProfile.name?.familyName || null;
    const usernameBase = email
      ? email.split('@')[0]
      : googleProfile.displayName || `google_${providerId}`;
    const username =
      `${usernameBase}_${Math.random().toString(36).substring(2, 8)}`.slice(
        0,
        255,
      );

    // Default role for social signups
    const roleName = 'Pupil';

    // Create user
    const user = await this.db
      .insertInto('auth.users')
      .values({
        username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        avatar: googleProfile.photos?.[0]?.value || null,
        phone: null,
        is_email_verified: !!email,
        is_phone_verified: false,
      })
      .returningAll()
      .executeTakeFirst();

    if (!user) {
      throw new Error('Failed to create user from Google profile');
    }

    // Create auth provider link
    await this.db
      .insertInto('auth.auth_providers')
      .values({
        id: uuidv4(),
        user_id: user.id,
        provider_type: 'google',
        provider_user_id: providerId,
        email: email,
        access_token: null,
        refresh_token: null,
      })
      .execute();

    // Find role
    const dbRole = await this.db
      .selectFrom('auth.roles')
      .select('id')
      .where('name', '=', roleName)
      .executeTakeFirst();

    if (dbRole) {
      await this.db
        .insertInto('auth.user_roles')
        .values({ user_id: user.id, role_id: dbRole.id })
        .execute();
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      role: roleName,
    };
  }

  async validateGoogleIdToken(idToken: string) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const profile = {
      id: payload?.sub,
      emails: payload?.email ? [{ value: payload.email }] : [],
      name: {
        givenName: payload?.given_name,
        familyName: payload?.family_name,
      },
      displayName: payload?.name,
      photos: payload?.picture ? [{ value: payload.picture }] : [],
    };
    return this.validateGoogleUser(profile);
  }

  async generateTokens(userId: string, email: string, role: string) {
    const payload: AccessTokenPayload = {
      sub: userId,
      email: email,
      role: role,
    };

    if (role === 'Teacher') {
      const teacher = await this.db
        .selectFrom('public.teachers as t')
        .where('t.user_id', '=', userId)
        .selectAll()
        .executeTakeFirstOrThrow(
          () => new NotFoundException('Teacher does not exist'),
        );
      payload.teacher = teacher;
    }

    if (role === 'Pupil') {
      const pupil = await this.db
        .selectFrom('public.pupils as p')
        .where('p.user_id', '=', userId)
        .selectAll()
        .executeTakeFirstOrThrow(
          () => new NotFoundException('Pupil does not exist'),
        );
      payload.pupil = pupil;
    }

    // Generate access token
    const access_token = this.jwtService.sign(payload);

    // Generate refresh token
    const refresh_token = crypto.randomBytes(32).toString('hex');

    // Store refresh token
    await this.db
      .insertInto('auth.refresh_tokens')
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
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await this.db
      .insertInto('auth.email_verification_tokens')
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
