import { z } from 'zod';

import { apiRequest } from './api';

const ClaimedHandoffSchema = z.object({
  handoffId: z.string(),
  status: z.literal('claimed'),
  clientId: z.string(),
  requestUri: z.string().nullable(),
  expiresAt: z.string(),
});

const CompletedHandoffSchema = z.object({
  handoffId: z.string(),
  status: z.literal('completed'),
});

const CancelledHandoffSchema = z.object({
  handoffId: z.string(),
  status: z.literal('cancelled'),
});

export type ClaimedHandoff = z.infer<typeof ClaimedHandoffSchema>;

export function claimHandoff(handoffToken: string, deviceBinding: string) {
  return apiRequest(
    '/api/v1/mobile/handoffs/claim',
    ClaimedHandoffSchema,
    {
      method: 'POST',
      body: JSON.stringify({ handoffToken, deviceBinding }),
    },
  );
}

export function completeHandoff(handoffId: string, handoffToken: string, deviceBinding: string) {
  return apiRequest(
    `/api/v1/mobile/handoffs/${encodeURIComponent(handoffId)}/complete`,
    CompletedHandoffSchema,
    {
      method: 'POST',
      body: JSON.stringify({ handoffToken, deviceBinding }),
    },
  );
}

export function cancelHandoff(handoffId: string) {
  return apiRequest(
    `/api/v1/mobile/handoffs/${encodeURIComponent(handoffId)}/cancel`,
    CancelledHandoffSchema,
    { method: 'POST' },
  );
}
