export type Roles =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'USER'
  | 'CUSTOMER'
  | 'TRAINER'
  | 'PROFESSOR'
  | 'PROFESOR'
  | 'STAFF'
  | string;

export interface LoginPayload {
  identifier: string;
  password: string;
  domain: string;
  /**
   * @deprecated Provided for backwards compatibility with legacy callers
   */
  email?: string;
}

export interface AuthUser {
  uuid: string;
  name: string;
  email: string;
  role: Roles;
  gymUuid: string;
  requiresOnboarding?: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export interface ForgotPasswordPayload {
  email: string;
  domain: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface OnboardingPayload {
  email: string;
  password: string;
}

export interface OnboardingResponse {
  access_token: string;
  refresh_token: string;
  user?: Partial<AuthUser>;
}