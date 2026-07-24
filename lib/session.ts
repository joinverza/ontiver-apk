import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { z } from 'zod';

const REFRESH_TOKEN_KEY = 'ontiver.auth.refresh-token.v1';
const APP_LOCK_VERIFIER_KEY = 'ontiver.app-lock.verifier.v1';
const DEVICE_BINDING_KEY = 'ontiver.handoff.device-binding.v1';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.string(),
  fullName: z.string().nullish(),
  avatarUrl: z.string().nullish(),
}).passthrough();

export type AuthUser = z.infer<typeof UserSchema>;

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(value: string | null): void {
  accessToken = value;
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function setRefreshToken(value: string): Promise<void> {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function clearCredentials(): Promise<void> {
  setAccessToken(null);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function setAppLockVerifier(value: string): Promise<void> {
  await SecureStore.setItemAsync(APP_LOCK_VERIFIER_KEY, value, {
    keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  });
}

export async function getAppLockVerifier(): Promise<string | null> {
  return SecureStore.getItemAsync(APP_LOCK_VERIFIER_KEY);
}

export async function clearAppLockVerifier(): Promise<void> {
  await SecureStore.deleteItemAsync(APP_LOCK_VERIFIER_KEY);
}

export async function getOrCreateDeviceBinding(): Promise<string> {
  const existing = await SecureStore.getItemAsync(DEVICE_BINDING_KEY);
  if (existing) return existing;
  const generated = `device_${Crypto.randomUUID()}_${Crypto.randomUUID()}`;
  await SecureStore.setItemAsync(DEVICE_BINDING_KEY, generated, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return generated;
}
