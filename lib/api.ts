import { z } from 'zod';

import { API_BASE_URL } from './config';
import {
  AuthUser,
  UserSchema,
  clearCredentials,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './session';
import { requestStepUpCode } from './step-up-bus';

const ErrorEnvelopeSchema = z.object({
  success: z.literal(false),
  error: z.object({ code: z.string(), message: z.string(), details: z.unknown().optional() }),
}).passthrough();

const HttpDetailErrorSchema = z.object({
  detail: z.union([
    z.string().transform((message) => ({ code: 'request_failed', message })),
    z.object({ code: z.string(), message: z.string(), reason: z.string().optional() }).passthrough(),
  ]),
}).passthrough();

const TokenDataSchema = z.object({
  accessToken: z.string().min(20),
  refreshToken: z.string().min(20),
  expiresIn: z.number(),
  user: UserSchema,
  permissions: z.array(z.string()).default([]),
});

const TokenEnvelopeSchema = z.object({ success: z.literal(true), data: TokenDataSchema });
const AuthChallengeEnvelopeSchema = z.object({
  success: z.literal(true),
  data: z.object({ mfaRequired: z.literal(true), challengeId: z.string(), methods: z.array(z.string()) }),
});

export type TokenData = z.infer<typeof TokenDataSchema>;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

let refreshPromise: Promise<TokenData> | null = null;

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function requestNonce(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

async function decodeError(response: Response): Promise<ApiError> {
  const raw = await response.json().catch(() => null);
  const parsed = ErrorEnvelopeSchema.safeParse(raw);
  if (parsed.success) {
    return new ApiError(response.status, parsed.data.error.code, parsed.data.error.message, parsed.data.error.details);
  }
  const detail = HttpDetailErrorSchema.safeParse(raw);
  if (detail.success) {
    return new ApiError(response.status, detail.data.detail.code, detail.data.detail.message, detail.data.detail);
  }
  return new ApiError(response.status, 'request_failed', `Request failed (${response.status})`);
}

async function persistTokens(tokens: TokenData): Promise<TokenData> {
  setAccessToken(tokens.accessToken);
  await setRefreshToken(tokens.refreshToken);
  return tokens;
}

async function consumeAuthenticationResponse(response: Response): Promise<TokenData> {
  if (!response.ok) throw await decodeError(response);
  const raw = await response.json();
  const tokens = TokenEnvelopeSchema.safeParse(raw);
  if (tokens.success) return persistTokens(tokens.data.data);
  const challenge = AuthChallengeEnvelopeSchema.safeParse(raw);
  if (!challenge.success) throw new ApiError(502, 'auth_response_invalid', 'The authentication service returned an invalid response.');
  const code = await requestStepUpCode('Enter the 6-digit code from your authenticator app to finish signing in.');
  const verified = await fetch(`${API_BASE_URL}/auth/mfa/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ challengeId: challenge.data.data.challengeId, method: 'totp', code }),
  });
  if (!verified.ok) throw await decodeError(verified);
  return persistTokens(TokenEnvelopeSchema.parse(await verified.json()).data);
}

export async function authenticate(path: string, body: Record<string, unknown>): Promise<TokenData> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  return consumeAuthenticationResponse(response);
}

async function performStepUp(): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new ApiError(401, 'session_missing', 'Sign in again to continue.');
  const code = await requestStepUpCode('Enter the 6-digit code from your authenticator app to continue this sensitive action.');
  const response = await fetch(`${API_BASE_URL}/auth/step-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) throw await decodeError(response);
}

async function rotateRefreshToken(): Promise<TokenData> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new ApiError(401, 'session_missing', 'No refresh token is available.');
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      await clearCredentials();
      throw await decodeError(response);
    }
    const tokens = TokenEnvelopeSchema.parse(await response.json()).data;
    setAccessToken(tokens.accessToken);
    await setRefreshToken(tokens.refreshToken);
    return tokens;
  })().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

export async function restoreSession(): Promise<AuthUser | null> {
  if (!(await getRefreshToken())) return null;
  try {
    return (await rotateRefreshToken()).user;
  } catch {
    await clearCredentials();
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  schema: z.ZodType<T>,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  const method = (init.method ?? 'GET').toUpperCase();
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!SAFE_METHODS.has(method)) {
    if (!headers.has('X-Ontiver-Nonce')) headers.set('X-Ontiver-Nonce', requestNonce());
    if (!headers.has('X-Ontiver-Timestamp')) headers.set('X-Ontiver-Timestamp', Math.floor(Date.now() / 1000).toString());
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, method, headers });
  if (response.status === 401 && retry && (await getRefreshToken())) {
    await rotateRefreshToken();
    return apiRequest(path, schema, init, false);
  }
  if (!response.ok) {
    const error = await decodeError(response);
    if (response.status === 403 && retry && error.code === 'step_up_required') {
      await performStepUp();
      return apiRequest(path, schema, init, false);
    }
    throw error;
  }
  if (response.status === 204) return schema.parse(undefined);
  return schema.parse(await response.json());
}

export async function login(email: string, password: string): Promise<TokenData> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password, role: 'user' }),
  });
  return consumeAuthenticationResponse(response);
}

export async function logout(allSessions = false): Promise<void> {
  const refreshToken = await getRefreshToken();
  try {
    if (refreshToken) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken, allSessions }),
      });
    }
  } finally {
    await clearCredentials();
  }
}

export const SuccessEnvelope = <T extends z.ZodTypeAny>(data: T) =>
  z.object({ success: z.literal(true), data, timestamp: z.string().optional(), requestId: z.string().optional() });
