import { z } from 'zod';

import { SuccessEnvelope, apiRequest } from './api';

export const CredentialSchema = z.object({
  credentialId: z.string(),
  title: z.string(),
  type: z.string(),
  status: z.string(),
  issuedAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  trustScore: z.number().optional(),
}).passthrough();

const WalletSchema = z.object({
  trustScore: z.number(),
  credentials: z.array(CredentialSchema),
  disclosureRequests: z.array(z.object({
    id: z.string(),
    requestId: z.string().optional(),
    requester: z.string(),
    purpose: z.string(),
    audience: z.string().default(''),
    requestedFields: z.array(z.string()).default([]),
    status: z.string(),
    expiresAt: z.string().nullable().optional(),
  }).passthrough()),
  connectedApps: z.array(z.object({
    id: z.string(),
    name: z.string(),
    status: z.string(),
    scopes: z.array(z.string()).default([]),
    lastUsedAt: z.string().nullable().optional(),
  }).passthrough()),
  stats: z.object({
    verifiedCredentials: z.number(),
    credentialReuses: z.number(),
    rawPiiShared: z.number(),
    pendingRequests: z.number(),
    activeConnectedApps: z.number(),
  }),
}).passthrough();

const PrivacyOverviewSchema = z.object({
  score: z.number().min(0).max(100),
  factors: z.record(z.string(), z.object({ score: z.number(), maximum: z.number() }).passthrough()),
  weeklyTrend: z.array(z.object({ date: z.string(), score: z.number() })),
  recommendations: z.array(z.object({ id: z.string(), title: z.string(), action: z.string() })),
  confirmedAlerts: z.array(z.object({ id: z.string(), type: z.string(), status: z.string(), createdAt: z.string() }).passthrough()),
});

export async function getWallet() {
  return (await apiRequest('/api/v1/banking/user/wallet', SuccessEnvelope(WalletSchema))).data;
}

export async function getCredentials() {
  const schema = SuccessEnvelope(z.object({ items: z.array(CredentialSchema) }));
  return (await apiRequest('/api/v1/banking/user/credentials', schema)).data.items;
}

export async function getPrivacyOverview() {
  return (await apiRequest('/api/v1/banking/user/privacy/overview', SuccessEnvelope(PrivacyOverviewSchema))).data;
}

export async function setConnectedAppStatus(id: string, status: 'active' | 'paused') {
  return apiRequest(
    `/api/v1/banking/user/wallet/apps/${encodeURIComponent(id)}/status`,
    SuccessEnvelope(z.unknown()),
    { method: 'POST', body: JSON.stringify({ status }) },
  );
}
