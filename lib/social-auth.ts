import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import {
  GoogleOneTapSignIn,
  isCancelledResponse,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
} from 'react-native-nitro-google-signin';

import { authenticate, type TokenData } from './api';
import { linkIdentity, unlinkIdentity } from './account-api';
import { runtimeConfig } from './config';

export type SocialProvider = 'google' | 'apple';
export type SocialMode = 'login' | 'signup';
export const APPLE_CREDENTIAL_USER_KEY = 'ontiver.apple.credential-user.v1';

type ProviderCredential = {
  provider: SocialProvider;
  identityToken: string;
  fullName?: string;
  authorizationCode?: string;
  serverAuthCode?: string;
  nonce?: string;
  providerAccountId?: string;
};

export class SocialAuthCancelledError extends Error {
  constructor() {
    super('Authentication was cancelled.');
  }
}

function configureGoogle(nonce?: string): void {
  if (!runtimeConfig.googleWebClientId) {
    throw new Error('Google sign-in is not configured for this build.');
  }
  GoogleOneTapSignIn.configure({
    webClientId: runtimeConfig.googleWebClientId,
    offlineAccess: true,
    autoSelectOnSignIn: false,
    nonce,
  });
}

async function googleCredential(mode: SocialMode): Promise<ProviderCredential> {
  const nonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Crypto.randomUUID(),
    { encoding: Crypto.CryptoEncoding.HEX },
  );
  configureGoogle(nonce);
  await GoogleOneTapSignIn.checkPlayServices();
  let response = mode === 'signup' ? await GoogleOneTapSignIn.createAccount() : await GoogleOneTapSignIn.signIn();
  if (isNoSavedCredentialFoundResponse(response)) response = await GoogleOneTapSignIn.presentExplicitSignIn();
  if (isCancelledResponse(response)) throw new SocialAuthCancelledError();
  if (!isSuccessResponse(response) || !response.data.idToken) throw new Error('Google did not return a verifiable identity token.');
  return {
    provider: 'google',
    identityToken: response.data.idToken,
    serverAuthCode: response.data.serverAuthCode ?? undefined,
    fullName: response.data.user.name ?? undefined,
    providerAccountId: response.data.user.email ?? response.data.user.id ?? undefined,
    nonce,
  };
}

async function appleCredential(): Promise<ProviderCredential> {
  if (Platform.OS !== 'ios' || !(await AppleAuthentication.isAvailableAsync())) {
    throw new Error('Sign in with Apple is unavailable on this device.');
  }
  const state = Crypto.randomUUID();
  const nonce = Crypto.randomUUID();
  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      state,
      nonce,
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ERR_REQUEST_CANCELED') throw new SocialAuthCancelledError();
    throw error;
  }
  if (credential.state !== state) throw new Error('Apple sign-in state validation failed.');
  if (!credential.identityToken) throw new Error('Apple did not return a verifiable identity token.');
  await SecureStore.setItemAsync(APPLE_CREDENTIAL_USER_KEY, credential.user, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
  const fullName = credential.fullName ? AppleAuthentication.formatFullName(credential.fullName) : undefined;
  return {
    provider: 'apple',
    identityToken: credential.identityToken,
    authorizationCode: credential.authorizationCode ?? undefined,
    fullName,
    nonce,
    providerAccountId: credential.user,
  };
}

async function credentialFor(provider: SocialProvider, mode: SocialMode): Promise<ProviderCredential> {
  return provider === 'google' ? googleCredential(mode) : appleCredential();
}

export async function authenticateSocial(provider: SocialProvider, mode: SocialMode, consentAccepted: boolean): Promise<TokenData> {
  const credential = await credentialFor(provider, mode);
  return authenticate(`/auth/oauth/${provider}`, {
    ...(provider === 'google' ? { idToken: credential.identityToken } : { identityToken: credential.identityToken }),
    mode,
    role: 'user',
    fullName: credential.fullName,
    consentAccepted,
    authorizationCode: credential.authorizationCode,
    serverAuthCode: credential.serverAuthCode,
    nonce: credential.nonce,
  });
}

export async function linkSocialIdentity(provider: SocialProvider): Promise<void> {
  const credential = await credentialFor(provider, 'signup');
  await linkIdentity(credential);
}

export async function unlinkSocialIdentity(provider: SocialProvider, providerAccountId?: string): Promise<void> {
  await unlinkIdentity(provider);
  if (provider === 'google') {
    try {
      configureGoogle();
      await GoogleOneTapSignIn.revokeAccess(providerAccountId ?? '');
    } catch {
      await GoogleOneTapSignIn.signOut().catch(() => undefined);
    }
  }
  if (provider === 'apple') await SecureStore.deleteItemAsync(APPLE_CREDENTIAL_USER_KEY);
}

export async function clearProviderClientSession(): Promise<void> {
  try {
    configureGoogle();
    await GoogleOneTapSignIn.signOut();
  } catch {
    // The Ontiver backend session remains the source of truth for logout.
  }
}
