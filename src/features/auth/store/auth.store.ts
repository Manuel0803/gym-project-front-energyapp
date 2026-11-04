import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../interfaces/auth-state.interface';
import { AuthUser } from '../interfaces/auth.interface';
import { decodeJwt } from '@/common/utils/jwt.utils';
import { setAuthCookie, clearAuthCookie } from '@/common/utils/cookie.utils';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      tokens: null,
      user: null,
      role: null,
      gymUuid: null,
      requiresOnboarding: false,
      domain: null,

      setLogin: (data, domain = '') => {
        const decoded = decodeJwt(data.access_token);

        const role = (decoded?.role || data.user?.role || 'USER').toString();
        const gymUuid = (decoded?.gymUuid || data.user?.gymUuid || '').toString();
        const requiresOnboarding =
          typeof decoded?.requiresOnboarding === 'boolean'
            ? decoded.requiresOnboarding
            : (data.user?.requiresOnboarding ?? false);

        const user: AuthUser = {
          uuid: data.user?.uuid || decoded?.uuid || decoded?.sub || '',
          name:
            data.user?.name ||
            decoded?.name ||
            (decoded?.email ? decoded.email.split('@')[0] : 'Usuario'),
          email: data.user?.email || decoded?.email || '',
          role,
          gymUuid,
          requiresOnboarding,
        };

        const tokens = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        };

        // Sync cookies for Edge Middleware inspection
        setAuthCookie(data.access_token);

        set({
          token: data.access_token,
          refreshToken: data.refresh_token,
          tokens,
          user,
          role,
          gymUuid,
          requiresOnboarding,
          domain: domain || null,
        });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        const decoded = decodeJwt(accessToken);
        const requiresOnboarding =
          typeof decoded?.requiresOnboarding === 'boolean'
            ? decoded.requiresOnboarding
            : false;
        const role = decoded?.role ? decoded.role.toString() : undefined;
        const gymUuid = decoded?.gymUuid ? decoded.gymUuid.toString() : undefined;

        setAuthCookie(accessToken);

        set((state) => ({
          token: accessToken,
          refreshToken,
          tokens: { accessToken, refreshToken },
          requiresOnboarding,
          role: role || state.role,
          gymUuid: gymUuid || state.gymUuid,
          user: state.user
            ? {
                ...state.user,
                requiresOnboarding,
                role: role || state.user.role,
                gymUuid: gymUuid || state.user.gymUuid,
              }
            : null,
        }));
      },

      setOnboardingComplete: ({ access_token, refresh_token }) => {
        const decoded = decodeJwt(access_token);

        setAuthCookie(access_token);

        set((state) => {
          const updatedUser: AuthUser | null = state.user
            ? {
                ...state.user,
                email: decoded?.email || state.user.email,
                requiresOnboarding: false,
              }
            : {
                uuid: decoded?.uuid || decoded?.sub || '',
                name: decoded?.name || 'Usuario',
                email: decoded?.email || '',
                role: (decoded?.role || 'CUSTOMER').toString(),
                gymUuid: (decoded?.gymUuid || '').toString(),
                requiresOnboarding: false,
              };

          return {
            token: access_token,
            refreshToken: refresh_token,
            tokens: {
              accessToken: access_token,
              refreshToken: refresh_token,
            },
            user: updatedUser,
            requiresOnboarding: false,
            role: decoded?.role ? decoded.role.toString() : state.role,
            gymUuid: decoded?.gymUuid ? decoded.gymUuid.toString() : state.gymUuid,
          };
        });
      },

      setLogout: () => {
        clearAuthCookie();
        set({
          token: null,
          refreshToken: null,
          tokens: null,
          user: null,
          role: null,
          gymUuid: null,
          requiresOnboarding: false,
          domain: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Ensure browser cookie stays in sync when Zustand rehydrates from localStorage
        if (state?.token) {
          setAuthCookie(state.token);
        }
      },
    }
  )
);
