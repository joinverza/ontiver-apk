import { create } from 'zustand';

import { login as loginRequest, logout as logoutRequest, restoreSession } from '@/lib/api';
import type { AuthUser } from '@/lib/session';
import { authenticateSocial, clearProviderClientSession, SocialAuthCancelledError, type SocialMode, type SocialProvider } from '@/lib/social-auth';

type AuthStatus = 'restoring' | 'authenticated' | 'anonymous';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  isAppLocked: boolean;
  lastError: string | null;
  restore: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (provider: SocialProvider, mode: SocialMode, consentAccepted?: boolean) => Promise<void>;
  logout: (allSessions?: boolean) => Promise<void>;
  lock: () => void;
  unlock: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'restoring',
  user: null,
  isAppLocked: false,
  lastError: null,
  restore: async () => {
    set({ status: 'restoring', lastError: null });
    const user = await restoreSession();
    set({ status: user ? 'authenticated' : 'anonymous', user });
  },
  login: async (email, password) => {
    set({ lastError: null });
    try {
      const tokens = await loginRequest(email.trim().toLowerCase(), password);
      set({ status: 'authenticated', user: tokens.user, isAppLocked: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in.';
      set({ status: 'anonymous', user: null, lastError: message });
      throw error;
    }
  },
  socialLogin: async (provider, mode, consentAccepted = false) => {
    set({ lastError: null });
    try {
      const tokens = await authenticateSocial(provider, mode, consentAccepted);
      set({ status: 'authenticated', user: tokens.user, isAppLocked: false });
    } catch (error) {
      if (error instanceof SocialAuthCancelledError) {
        set({ lastError: null });
        throw error;
      }
      const message = error instanceof Error ? error.message : `Unable to continue with ${provider}.`;
      set({ status: 'anonymous', user: null, lastError: message });
      throw error;
    }
  },
  logout: async (allSessions = false) => {
    try {
      await logoutRequest(allSessions);
    } finally {
      await clearProviderClientSession();
      set({ status: 'anonymous', user: null, isAppLocked: false, lastError: null });
    }
  },
  lock: () => set({ isAppLocked: true }),
  unlock: () => set({ isAppLocked: false }),
}));
