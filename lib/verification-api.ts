import { z } from 'zod';

import { SuccessEnvelope, apiRequest } from './api';

const CredentialTypeSchema = z.object({
  id: z.string(),
  label: z.string(),
  available: z.boolean(),
  flow: z.enum(['smileid_sdk', 'smileid_enhanced_kyc']),
  requiresCamera: z.boolean(),
  jobType: z.number(),
  unavailableReason: z.string().optional(),
});

const SmileSessionSchema = z.object({
  verificationId: z.string(),
  jobId: z.string(),
  userId: z.string(),
  product: z.string(),
  jobType: z.number(),
  environment: z.enum(['sandbox', 'production']),
  callbackUrl: z.string().url(),
  partnerParameters: z.record(z.string(), z.union([z.string(), z.number()])),
  ui: z.object({ showInstructions: z.boolean(), allowGalleryUpload: z.boolean(), verificationIsFree: z.literal(true) }),
  status: z.string(),
});

const VerificationStatusSchema = z.object({
  verificationId: z.string(),
  status: z.string(),
  overallResult: z.string().nullable().optional(),
}).passthrough();

export async function getCredentialTypes() {
  return (await apiRequest('/api/v1/banking/user/credential-types', SuccessEnvelope(z.object({ items: z.array(CredentialTypeSchema), verificationProvider: z.literal('smileid'), verificationIsFree: z.literal(true) })))).data.items;
}

export async function createSmileSession(credentialType: 'nin' | 'passport' | 'drivers_license' | 'voters_card', country = 'NG') {
  return (await apiRequest('/api/v1/banking/user/verifications/smile-session', SuccessEnvelope(SmileSessionSchema), { method: 'POST', body: JSON.stringify({ credentialType, country }) })).data;
}

export async function submitEnhancedKyc(body: { verificationType: 'bvn'; idNumber: string; country: string; firstName: string; lastName: string; dateOfBirth: string }) {
  return (await apiRequest('/api/v1/banking/user/verifications/smile-basic', SuccessEnvelope(z.object({ verificationId: z.string(), status: z.string(), createdAt: z.string() })), { method: 'POST', body: JSON.stringify(body) })).data;
}

export async function getVerificationStatus(verificationId: string) {
  return (await apiRequest(`/api/v1/banking/user/verifications/${encodeURIComponent(verificationId)}`, SuccessEnvelope(VerificationStatusSchema))).data;
}
