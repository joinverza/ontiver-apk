import { z } from 'zod';

import { SuccessEnvelope, apiRequest } from './api';

const DetailSchema = z.object({
  credentialId: z.string(),
  type: z.string(),
  title: z.string(),
  verificationType: z.string().nullable().optional(),
  status: z.string(),
  issuedAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  issuer: z.object({ name: z.string(), did: z.string().nullable().optional(), verified: z.boolean() }),
  holder: z.object({ name: z.string(), did: z.string().nullable().optional() }),
  claims: z.record(z.string(), z.unknown()),
}).passthrough();

export async function getCredentialDetail(id: string) {
  return (await apiRequest(`/api/v1/banking/user/credentials/${encodeURIComponent(id)}`, SuccessEnvelope(DetailSchema))).data;
}
