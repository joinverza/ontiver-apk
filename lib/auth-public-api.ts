import { z } from 'zod';

import { apiRequest } from './api';

const AuthSuccess = <T extends z.ZodTypeAny>(data: T) => z.object({ success: z.literal(true), data, requestId: z.string().optional() });

export async function signup(input: { fullName: string; email: string; password: string; consentAccepted: boolean }) {
  return (await apiRequest('/auth/signup', AuthSuccess(z.object({ userId: z.string(), role: z.string(), status: z.string() }).passthrough()), { method: 'POST', body: JSON.stringify({ ...input, email: input.email.trim().toLowerCase(), role: 'user' }) })).data;
}

export async function verifySignupEmail(email: string, code: string) {
  return (await apiRequest('/auth/email/verify', AuthSuccess(z.object({ verified: z.boolean(), status: z.string() })), { method: 'POST', body: JSON.stringify({ email: email.trim().toLowerCase(), code, role: 'user' }) })).data;
}

export async function resendSignupEmail(email: string) {
  return (await apiRequest('/auth/email/resend', AuthSuccess(z.object({ accepted: z.boolean() }).passthrough()), { method: 'POST', body: JSON.stringify({ email: email.trim().toLowerCase(), role: 'user' }) })).data;
}

export async function forgotPassword(email: string) {
  return (await apiRequest('/auth/forgot-password', AuthSuccess(z.object({ accepted: z.boolean() }).passthrough()), { method: 'POST', body: JSON.stringify({ email: email.trim().toLowerCase() }) })).data;
}

export async function resetPassword(input: { token: string; newPassword: string; mfaCode?: string; recoveryCode?: string }) {
  return (await apiRequest('/auth/reset-password', AuthSuccess(z.object({ reset: z.boolean().optional(), status: z.string().optional() }).passthrough()), { method: 'POST', body: JSON.stringify(input) })).data;
}
