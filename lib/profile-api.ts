import { z } from 'zod';

import { SuccessEnvelope, apiRequest } from './api';

export const ProfileSchema = z.object({
  id: z.string(), email: z.string().email(), role: z.string(), fullName: z.string(), organizationName: z.string(), contactName: z.string(), countryCode: z.string(), department: z.string(), jurisdiction: z.string(), avatarUrl: z.string().nullable().optional(),
}).passthrough();
export type Profile = z.infer<typeof ProfileSchema>;

export async function getProfile() {
  return (await apiRequest('/auth/profile', SuccessEnvelope(ProfileSchema))).data;
}

export async function updateProfile(input: Pick<Profile, 'fullName' | 'countryCode'>) {
  return (await apiRequest('/auth/profile', SuccessEnvelope(ProfileSchema), { method: 'PATCH', body: JSON.stringify(input) })).data;
}
