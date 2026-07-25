import { z } from 'zod';

import { SuccessEnvelope, apiRequest } from './api';

const IdentitySchema = z.object({ id: z.string(), provider: z.enum(['google', 'apple']), email: z.string(), emailVerified: z.boolean(), linkedAt: z.string(), lastUsedAt: z.string().nullable(), status: z.string(), canUnlink: z.boolean() });
const IdentitiesDataSchema = z.object({ items: z.array(IdentitySchema), passwordLoginEnabled: z.boolean(), signInMethodCount: z.number() });
export type LinkedIdentity = z.infer<typeof IdentitySchema>;
const SessionSchema = z.object({ sessionId: z.string(), current: z.boolean(), status: z.string(), device: z.string(), createdAt: z.string(), lastActivityAt: z.string(), expiresAt: z.string(), revokedAt: z.string().nullable() }).passthrough();
export const PrivacySettingsSchema = z.object({
  profileVisibility: z.boolean(), analyticsSharing: z.boolean(), partnerSharing: z.boolean(),
  emailNotifications: z.boolean(), pushNotifications: z.boolean(), marketingNotifications: z.boolean(),
  securityNotifications: z.boolean(), loginNotifications: z.boolean(), proofNotifications: z.boolean(),
  verificationResultNotifications: z.boolean(), paymentNotifications: z.boolean(), disclosureNotifications: z.boolean(),
  productUpdateNotifications: z.boolean(), updatedAt: z.string().nullable(),
});
export type PrivacySettings = z.infer<typeof PrivacySettingsSchema>;

export async function getIdentities() {
  return (await apiRequest('/api/v1/banking/user/account/identities', SuccessEnvelope(IdentitiesDataSchema))).data;
}

export async function linkIdentity(input: { provider: 'google' | 'apple'; identityToken: string; fullName?: string; authorizationCode?: string; serverAuthCode?: string; nonce?: string }) {
  return (await apiRequest('/api/v1/banking/user/account/identities', SuccessEnvelope(z.object({ identityId: z.string(), provider: z.string(), linkedAt: z.string() })), { method: 'POST', body: JSON.stringify(input) })).data;
}

export async function unlinkIdentity(provider: 'google' | 'apple') {
  return (await apiRequest(`/api/v1/banking/user/account/identities/${provider}`, SuccessEnvelope(z.object({ provider: z.string(), unlinkedAt: z.string() })), { method: 'DELETE' })).data;
}

export async function setPassword(newPassword: string) {
  return (await apiRequest('/api/v1/banking/user/account/password/set', SuccessEnvelope(z.object({ setAt: z.string(), passwordLoginEnabled: z.boolean(), otherSessionsRevoked: z.boolean() })), { method: 'POST', body: JSON.stringify({ newPassword }) })).data;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return (await apiRequest('/api/v1/banking/user/account/password', SuccessEnvelope(z.object({ changedAt: z.string(), otherSessionsRevoked: z.boolean() })), { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) })).data;
}

export async function getSessions() {
  return (await apiRequest('/api/v1/banking/user/security/sessions', SuccessEnvelope(z.object({ items: z.array(SessionSchema) })))).data.items;
}

export async function revokeSession(id: string) {
  return apiRequest(`/api/v1/banking/user/security/sessions/${encodeURIComponent(id)}/revoke`, SuccessEnvelope(z.unknown()), { method: 'POST' });
}

export async function getPrivacySettings() {
  return (await apiRequest('/api/v1/banking/user/settings/privacy', SuccessEnvelope(PrivacySettingsSchema))).data;
}

export async function updatePrivacySettings(settings: PrivacySettings) {
  const { updatedAt: _updatedAt, ...body } = settings;
  return (await apiRequest('/api/v1/banking/user/settings/privacy', SuccessEnvelope(PrivacySettingsSchema), { method: 'PATCH', body: JSON.stringify(body) })).data;
}

export async function requestDataExport() {
  return (await apiRequest('/api/v1/banking/user/privacy/data-export', SuccessEnvelope(z.object({ requestId: z.string(), status: z.string(), createdAt: z.string() })), { method: 'POST', body: JSON.stringify({ reason: 'Requested from the Ontiver mobile app' }) })).data;
}

export async function requestAccountDeletion() {
  return (await apiRequest('/api/v1/banking/user/privacy/data-deletion', SuccessEnvelope(z.object({ requestId: z.string(), status: z.string(), createdAt: z.string(), providerRevocationsQueued: z.number().default(0) })), { method: 'POST', body: JSON.stringify({ reason: 'Requested from the Ontiver mobile app' }) })).data;
}
