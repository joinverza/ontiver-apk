import { PropsWithChildren, useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';

import { useAuthStore } from '@/store/authStore';
import { APPLE_CREDENTIAL_USER_KEY } from '@/lib/social-auth';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: 2, staleTime: 30_000, refetchOnReconnect: true },
      mutations: { retry: 0 },
    },
  }));
  const restore = useAuthStore((state) => state.restore);
  const lock = useAuthStore((state) => state.lock);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    void restore();
  }, [restore]);

  useEffect(() => {
    let backgroundedAt: number | null = null;
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') backgroundedAt = Date.now();
      if (nextState === 'active' && backgroundedAt && Date.now() - backgroundedAt >= 60_000) lock();
    });
    return () => subscription.remove();
  }, [lock]);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const verifyAppleCredential = async () => {
      const appleUser = await SecureStore.getItemAsync(APPLE_CREDENTIAL_USER_KEY);
      if (!appleUser) return;
      try {
        const state = await AppleAuthentication.getCredentialStateAsync(appleUser);
        if (state === AppleAuthentication.AppleAuthenticationCredentialState.REVOKED || state === AppleAuthentication.AppleAuthenticationCredentialState.NOT_FOUND) await logout();
      } catch {
        // Credential-state checks are unavailable on the iOS simulator and must not end valid sessions there.
      }
    };
    void verifyAppleCredential();
    const appState = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') void verifyAppleCredential();
    });
    const revoked = AppleAuthentication.addRevokeListener(() => { void logout(); });
    return () => {
      appState.remove();
      revoked.remove();
    };
  }, [logout]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
