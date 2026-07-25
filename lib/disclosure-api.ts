import { z } from 'zod';

import { SuccessEnvelope, apiRequest } from './api';

export const DisclosureSchema = z.object({
  requestId: z.string(),
  applicationId: z.string().nullable().optional(),
  applicationName: z.string().nullable().optional(),
  applicationLogoUrl: z.string().nullable().optional(),
  requester: z.string(),
  requesterCategory: z.string(),
  verificationType: z.string().nullable().optional(),
  purpose: z.string(),
  audience: z.string(),
  requestedFields: z.array(z.string()),
  resolvedFields: z.array(z.string()),
  risk: z.string(),
  status: z.string(),
  expiresAt: z.string().nullable().optional(),
  resolvedAt: z.string().nullable().optional(),
  createdAt: z.string(),
}).passthrough();

export async function resolveDisclosureToken(token: string) {
  return (await apiRequest('/api/v1/banking/user/wallet/disclosures/resolve-token', SuccessEnvelope(DisclosureSchema), { method: 'POST', body: JSON.stringify({ token }) })).data;
}

export async function approveDisclosure(requestId: string, approvedFields: string[]) {
  return (await apiRequest(`/api/v1/banking/user/wallet/disclosures/${encodeURIComponent(requestId)}/approve`, SuccessEnvelope(z.object({ requestId: z.string(), status: z.literal('approved'), approvedFields: z.array(z.string()), resolvedAt: z.string() }).passthrough()), { method: 'POST', body: JSON.stringify({ approvedFields }) })).data;
}

export async function denyDisclosure(requestId: string) {
  return (await apiRequest(`/api/v1/banking/user/wallet/disclosures/${encodeURIComponent(requestId)}/deny`, SuccessEnvelope(z.object({ requestId: z.string(), status: z.literal('denied'), resolvedAt: z.string() }).passthrough()), { method: 'POST' })).data;
}
