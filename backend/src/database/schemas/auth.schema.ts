import { Generated, Selectable } from "kysely";

// Auth schema interface
export interface AuthRolePermissionsTable {
  role_id: Generated<string>;
  permission_id: string;
}

export interface AuthRolesTable {
  id: Generated<number>;
  name: string;
  description: string;
}

export interface AuthPermissionsTable {
  id: Generated<string>;
  name: string;
  description: string;
}

export interface AuthUsersTable {
  id: Generated<string>;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface AuthUserRolesTable {
  user_id: string;
  role_id: Generated<number>;
}

export interface AuthProvidersTable {
  id: Generated<string>;
  user_id: string | null;
  provider_type: string;
  provider_user_id: string | null;
  email: string | null;
  refresh_token: string | null;
  access_token: string | null;
  token_expires_at: Date | null;
  password_hash: string | null;
  last_used_at: Date | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface AuthPasswordResetTokensTable {
  id: Generated<string>;
  user_id: string;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Generated<Date>;
}

export interface AuthEmailVerificationTokensTable {
  id: Generated<string>;
  user_id: string;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Generated<Date>;
}

export interface AuthRefreshTokensTable {
  id: Generated<string>;
  user_id: string;
  token: string;
  expires_at: Date;
  revoked: boolean;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}
