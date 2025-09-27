"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const google_auth_library_1 = require("google-auth-library");
const kysely_1 = require("kysely");
const uuid_1 = require("uuid");
const email_service_1 = require("../email/email.service");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(db, jwtService, emailService, userService) {
        this.db = db;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.userService = userService;
    }
    async register(registerDto) {
        const existing = await this.db
            .selectFrom('authentication.users')
            .select(['id', 'email', 'username'])
            .where(eb => eb.or([
            eb('email', '=', registerDto.email),
            eb('username', '=', registerDto.username),
        ]))
            .execute();
        if (existing.length > 0) {
            const hasEmail = existing.some(u => u.email === registerDto.email);
            const hasUsername = existing.some(u => u.username === registerDto.username);
            if (hasEmail && hasUsername) {
                throw new common_1.ConflictException('Email and username already exist');
            }
            else if (hasEmail) {
                throw new common_1.ConflictException('Email already exists');
            }
            else {
                throw new common_1.ConflictException('Username already exists');
            }
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
        const { password, confirm_password, role, ...userData } = registerDto;
        const user = await this.db
            .insertInto('authentication.users')
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
        await this.db
            .insertInto('authentication.auth_providers')
            .values({
            id: (0, uuid_1.v4)(),
            user_id: user.id,
            provider_type: 'email',
            password_hash: hashedPassword,
            email: registerDto.email,
        })
            .execute();
        const dbRole = await this.db
            .selectFrom('authentication.roles')
            .select('id')
            .where('name', '=', role)
            .executeTakeFirstOrThrow(() => new Error(`Role "${role}" not found`));
        await this.db
            .insertInto('authentication.user_roles')
            .values({
            user_id: user.id,
            role_id: dbRole.id,
        })
            .execute();
        const token = await this.generateEmailVerificationToken(user.id);
        try {
            await this.emailService.sendOnboarding({
                email: user.email,
                name: user.first_name,
            });
            await this.emailService.sendVerifyEmail({ email: user.email, name: user.first_name }, token);
        }
        catch {
            console.warn('Email send failed during registration, queued for retry');
        }
        const tokens = await this.generateTokens(user.id, user.email, role);
        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        };
    }
    async login(loginDto) {
        const userWithProvider = await this.db
            .selectFrom('authentication.users')
            .leftJoin('authentication.auth_providers', 'authentication.users.id', 'authentication.auth_providers.user_id')
            .leftJoin('authentication.user_roles', 'authentication.users.id', 'authentication.user_roles.user_id')
            .leftJoin('authentication.roles', 'authentication.user_roles.role_id', 'authentication.roles.id')
            .select([
            'authentication.users.id',
            'authentication.users.username',
            'authentication.users.email',
            'authentication.users.first_name',
            'authentication.users.last_name',
            'authentication.users.avatar',
            'authentication.users.phone',
            'authentication.users.is_email_verified',
            'authentication.users.is_phone_verified',
            'authentication.users.created_at',
            'authentication.users.updated_at',
            'authentication.auth_providers.password_hash',
            'authentication.roles.name as role',
        ])
            .where('authentication.users.email', '=', loginDto.email)
            .where('authentication.auth_providers.provider_type', '=', 'email')
            .where('authentication.users.is_deleted', '=', false)
            .executeTakeFirst();
        if (!userWithProvider || !userWithProvider.password_hash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, userWithProvider.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (userWithProvider.role === 'Pupil') {
            await this.userService.updateLoginStreak(userWithProvider.id);
        }
        const tokens = await this.generateTokens(userWithProvider.id, userWithProvider.email, userWithProvider.role);
        const { password_hash, ...user } = userWithProvider;
        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            user,
        };
    }
    async deleteUser(userId) {
        const res = await this.db
            .updateTable('authentication.users as u')
            .set({ is_deleted: true })
            .where('u.id', '=', userId)
            .returning(['is_deleted'])
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('User not found'));
        console.log('deleted: ', res.is_deleted);
        return res;
    }
    async checkUserExists(fieldType, fieldValue) {
        if (fieldType === '' ||
            fieldType === null ||
            fieldValue === '' ||
            fieldValue === null) {
            throw new common_1.BadRequestException('FieldType/FieldValue cannot be empty.');
        }
        var res;
        switch (fieldType) {
            case 'username':
                res = await this.db
                    .selectFrom('authentication.users as u')
                    .where('u.username', '=', fieldValue)
                    .selectAll()
                    .executeTakeFirst();
                break;
            case 'email':
                res = await this.db
                    .selectFrom('authentication.users as u')
                    .where('u.email', '=', fieldValue)
                    .selectAll()
                    .executeTakeFirst();
                break;
            default:
                throw new common_1.BadRequestException('Invalid FieldType');
        }
        if (res) {
            return true;
        }
        return false;
    }
    async exchangeGoogleIdToken(idToken) {
        if (!idToken)
            throw new Error('id_token required');
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
    async refreshToken(refreshTokenDto) {
        const refreshToken = await this.db
            .selectFrom('authentication.refresh_tokens')
            .leftJoin('authentication.users', 'authentication.refresh_tokens.user_id', 'authentication.users.id')
            .leftJoin('authentication.user_roles', 'authentication.users.id', 'authentication.user_roles.user_id')
            .leftJoin('authentication.roles', 'authentication.user_roles.role_id', 'authentication.roles.id')
            .select([
            'authentication.refresh_tokens.id as token_id',
            'authentication.refresh_tokens.user_id',
            'authentication.refresh_tokens.expires_at',
            'authentication.refresh_tokens.revoked',
            'authentication.users.email',
            'authentication.roles.name as role',
        ])
            .where('authentication.refresh_tokens.token', '=', refreshTokenDto.refresh_token)
            .executeTakeFirst();
        if (!refreshToken || refreshToken.revoked) {
            throw new common_1.UnauthorizedException('hey Invalid refresh token');
        }
        if (new Date() > refreshToken.expires_at) {
            await this.db
                .updateTable('authentication.refresh_tokens')
                .set({ revoked: true })
                .where('id', '=', refreshToken.token_id)
                .execute();
        }
        const tokens = await this.generateTokens(refreshToken.user_id, refreshToken.email, refreshToken.role);
        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.db
            .selectFrom('authentication.users')
            .select(['id', 'email'])
            .where('email', '=', forgotPasswordDto.email)
            .executeTakeFirst();
        if (!user) {
            return {
                message: 'If the email exists, a password reset link has been sent.',
            };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        await this.db
            .insertInto('authentication.password_reset_tokens')
            .values({
            id: (0, uuid_1.v4)(),
            user_id: user.id,
            token: hashedToken,
            expires_at: new Date(Date.now() + 15 * 60 * 1000),
            used: false,
        })
            .execute();
        try {
            await this.emailService.sendResetPassword({ email: user.email }, resetToken);
        }
        catch {
            console.warn('Failed to send reset password email, enqueued for retry');
        }
    }
    async resetPassword(resetPasswordDto) {
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetPasswordDto.token)
            .digest('hex');
        const resetToken = await this.db
            .selectFrom('authentication.password_reset_tokens')
            .select(['id', 'user_id', 'expires_at', 'used'])
            .where('token', '=', hashedToken)
            .executeTakeFirst();
        if (!resetToken || resetToken.used || new Date() > resetToken.expires_at) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(resetPasswordDto.new_password, saltRounds);
        await this.db
            .updateTable('authentication.auth_providers')
            .set({ password_hash: hashedPassword })
            .where('user_id', '=', resetToken.user_id)
            .where('provider_type', '=', 'email')
            .execute();
        await this.db
            .updateTable('authentication.password_reset_tokens')
            .set({ used: true })
            .where('id', '=', resetToken.id)
            .execute();
    }
    async requestEmailVerification(userId) {
        const user = await this.db
            .selectFrom('authentication.users')
            .select(['id', 'email', 'is_email_verified'])
            .where('id', '=', userId)
            .executeTakeFirst();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.is_email_verified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        const token = await this.generateEmailVerificationToken(userId);
        console.log('Email validation token: ' + token);
    }
    async verifyEmail(token) {
        const verificationToken = await this.db
            .selectFrom('authentication.email_verification_tokens')
            .select(['id', 'user_id', 'expires_at', 'used'])
            .where('token', '=', token)
            .executeTakeFirst();
        if (!verificationToken ||
            verificationToken.used ||
            new Date() > verificationToken.expires_at) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        await this.db
            .updateTable('authentication.users')
            .set({ is_email_verified: true })
            .where('id', '=', verificationToken.user_id)
            .execute();
        await this.db
            .updateTable('authentication.email_verification_tokens')
            .set({ used: true })
            .where('id', '=', verificationToken.id)
            .execute();
    }
    async updateProfile(userId, updateProfileDto) {
        if (updateProfileDto.email) {
            const existingUser = await this.db
                .selectFrom('authentication.users')
                .select('id')
                .where('email', '=', updateProfileDto.email)
                .where('id', '!=', userId)
                .executeTakeFirst();
            if (existingUser) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        if (updateProfileDto.age) {
            await this.db
                .updateTable('public.pupils')
                .set({ age: updateProfileDto.age })
                .where('user_id', '=', userId)
                .execute();
        }
        else {
            await this.db
                .updateTable('authentication.users')
                .set(updateProfileDto)
                .where('id', '=', userId)
                .execute();
        }
        if (updateProfileDto.email) {
            await this.generateEmailVerificationToken(userId);
        }
        const updatedUser = await this.db
            .selectFrom('authentication.users')
            .innerJoin('authentication.user_roles', 'authentication.users.id', 'authentication.user_roles.user_id')
            .innerJoin('authentication.roles', 'authentication.user_roles.role_id', 'authentication.roles.id')
            .select([
            'authentication.users.id',
            'authentication.users.username',
            'authentication.users.email',
            'authentication.users.first_name',
            'authentication.users.last_name',
            'authentication.users.avatar',
            'authentication.users.phone',
            'authentication.users.is_email_verified',
            'authentication.users.is_phone_verified',
            'authentication.users.created_at',
            'authentication.users.updated_at',
            'authentication.roles.name as role',
        ])
            .where('authentication.users.id', '=', userId)
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('User not found'));
        return updatedUser;
    }
    async changePassword(userId, changePasswordDto) {
        const authProvider = await this.db
            .selectFrom('authentication.auth_providers')
            .select(['password_hash'])
            .where('user_id', '=', userId)
            .where('provider_type', '=', 'email')
            .executeTakeFirst();
        if (!authProvider || !authProvider.password_hash) {
            throw new common_1.NotFoundException('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.current_password, authProvider.password_hash);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(changePasswordDto.new_password, saltRounds);
        await this.db
            .updateTable('authentication.auth_providers')
            .set({ password_hash: hashedPassword })
            .where('user_id', '=', userId)
            .where('provider_type', '=', 'email')
            .execute();
    }
    async logout(refreshToken) {
        if (refreshToken) {
            await this.db
                .updateTable('authentication.refresh_tokens')
                .set({ revoked: true })
                .where('token', '=', refreshToken)
                .execute();
        }
    }
    async validateUser(payload) {
        const user = await this.db
            .selectFrom('authentication.users')
            .leftJoin('authentication.user_roles', 'authentication.users.id', 'authentication.user_roles.user_id')
            .leftJoin('authentication.roles', 'authentication.user_roles.role_id', 'authentication.roles.id')
            .select([
            'authentication.users.id',
            'authentication.users.username',
            'authentication.users.email',
            'authentication.users.first_name',
            'authentication.users.last_name',
            'authentication.users.avatar',
            'authentication.users.phone',
            'authentication.users.is_email_verified',
            'authentication.users.is_phone_verified',
            'authentication.users.created_at',
            'authentication.users.updated_at',
            'authentication.roles.name as role',
        ])
            .where('authentication.users.id', '=', payload.sub)
            .executeTakeFirstOrThrow(() => new common_1.NotFoundException('User does not exist'));
        if (user.role === 'Teacher') {
            const teacher = await this.db
                .selectFrom('public.teachers as t')
                .where('t.user_id', '=', user.id)
                .selectAll()
                .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Teacher does not exist'));
            user.teacher = teacher;
        }
        if (user.role === 'Pupil') {
            const pupil = await this.db
                .selectFrom('public.pupils as p')
                .where('p.user_id', '=', user.id)
                .selectAll()
                .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Pupil does not exist'));
            user.pupil = pupil;
        }
        return user;
    }
    async validateGoogleUser(profile) {
        const googleProfile = profile;
        const providerId = googleProfile.id;
        const provider = await this.db
            .selectFrom('authentication.auth_providers')
            .leftJoin('authentication.users', 'authentication.auth_providers.user_id', 'authentication.users.id')
            .leftJoin('authentication.user_roles', 'authentication.users.id', 'authentication.user_roles.user_id')
            .leftJoin('authentication.roles', 'authentication.user_roles.role_id', 'authentication.roles.id')
            .select([
            'authentication.auth_providers.id as provider_id',
            'authentication.auth_providers.user_id',
            'authentication.users.id as id',
            'authentication.users.email',
            'authentication.users.first_name',
            'authentication.users.last_name',
            'authentication.users.username',
            'authentication.roles.name as role',
        ])
            .where('authentication.auth_providers.provider_type', '=', 'google')
            .where('authentication.auth_providers.provider_user_id', '=', providerId)
            .executeTakeFirst();
        if (provider && provider.user_id) {
            return {
                id: provider.user_id,
                email: provider.email,
                first_name: provider.first_name,
                last_name: provider.last_name,
                username: provider.username,
                role: provider.role || 'Pupil',
            };
        }
        const email = googleProfile.emails?.[0]?.value || null;
        const firstName = googleProfile.name?.givenName || googleProfile.displayName || null;
        const lastName = googleProfile.name?.familyName || null;
        const usernameBase = email
            ? email.split('@')[0]
            : googleProfile.displayName || `google_${providerId}`;
        const username = `${usernameBase}_${Math.random().toString(36).substring(2, 8)}`.slice(0, 255);
        const roleName = 'Pupil';
        const user = await this.db
            .insertInto('authentication.users')
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
        await this.db
            .insertInto('authentication.auth_providers')
            .values({
            id: (0, uuid_1.v4)(),
            user_id: user.id,
            provider_type: 'google',
            provider_user_id: providerId,
            email: email,
            access_token: null,
            refresh_token: null,
        })
            .execute();
        const dbRole = await this.db
            .selectFrom('authentication.roles')
            .select('id')
            .where('name', '=', roleName)
            .executeTakeFirst();
        if (dbRole) {
            await this.db
                .insertInto('authentication.user_roles')
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
    async validateGoogleIdToken(idToken) {
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
    async generateTokens(userId, email, role) {
        const payload = {
            sub: userId,
            email: email,
            role: role,
        };
        if (role === 'Teacher') {
            const teacher = await this.db
                .selectFrom('public.teachers as t')
                .where('t.user_id', '=', userId)
                .selectAll()
                .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Teacher does not exist'));
            payload.teacher = teacher;
        }
        if (role === 'Pupil') {
            const pupil = await this.db
                .selectFrom('public.pupils as p')
                .where('p.user_id', '=', userId)
                .selectAll()
                .executeTakeFirstOrThrow(() => new common_1.NotFoundException('Pupil does not exist'));
            payload.pupil = pupil;
        }
        const access_token = this.jwtService.sign(payload);
        const refresh_token = crypto.randomBytes(32).toString('hex');
        await this.db
            .insertInto('authentication.refresh_tokens')
            .values({
            id: (0, uuid_1.v4)(),
            user_id: userId,
            token: refresh_token,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            revoked: false,
        })
            .execute();
        return { access_token, refresh_token };
    }
    async generateEmailVerificationToken(userId) {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        await this.db
            .insertInto('authentication.email_verification_tokens')
            .values({
            id: (0, uuid_1.v4)(),
            user_id: userId,
            token: verificationToken,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
            used: false,
        })
            .execute();
        console.log(`Email verification token for user ${userId}: ${verificationToken}`);
        return verificationToken;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE')),
    __metadata("design:paramtypes", [kysely_1.Kysely,
        jwt_1.JwtService,
        email_service_1.EmailService,
        user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map