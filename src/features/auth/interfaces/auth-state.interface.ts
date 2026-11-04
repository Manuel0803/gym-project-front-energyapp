import { AuthResponse, AuthUser } from './auth.interface';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  tokens: AuthTokens | null;
  user: AuthUser | null;
  role: string | null;
  gymUuid: string | null;
  requiresOnboarding: boolean;
  domain: string | null;

  setLogin: (data: AuthResponse, domain?: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setOnboardingComplete: (tokens: {
    access_token: string;
    refresh_token: string;
  }) => void;
  setLogout: () => void;
}
