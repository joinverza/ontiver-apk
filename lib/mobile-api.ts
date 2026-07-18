import { z } from 'zod';

import { SuccessEnvelope, apiRequest } from './api';

export const BootstrapSchema = z.object({
  profile: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    avatarUrl: z.string(),
    emailVerified: z.boolean(),
    mfaEnabled: z.boolean(),
  }),
  capabilities: z.record(z.string(), z.boolean()),
  verificationProvider: z.literal('smileid'),
  verificationIsFree: z.literal(true),
  billingEnabled: z.literal(false),
  minimumAppVersion: z.string(),
  recommendedAppVersion: z.string(),
  environment: z.string(),
  userTier: z.literal('free'),
}).passthrough();

export const ActivitySchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  tone: z.string(),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
});

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  actionLabel: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});

const PageSchema = <T extends z.ZodTypeAny>(item: T) => z.object({
  items: z.array(item),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  hasNext: z.boolean(),
});

export async function getBootstrap() {
  return (await apiRequest('/api/v1/banking/user/mobile/bootstrap', SuccessEnvelope(BootstrapSchema))).data;
}

export async function getActivities(page = 1) {
  return (await apiRequest(`/api/v1/banking/user/activities?page=${page}`, SuccessEnvelope(PageSchema(ActivitySchema)))).data;
}

export async function getNotifications(page = 1) {
  return (await apiRequest(`/api/v1/banking/user/notifications?page=${page}`, SuccessEnvelope(PageSchema(NotificationSchema).extend({ unreadCount: z.number() })))).data;
}

export async function markNotificationRead(id: string) {
  return apiRequest(`/api/v1/banking/user/notifications/${encodeURIComponent(id)}/read`, SuccessEnvelope(z.object({ notificationId: z.string(), readAt: z.string() })), { method: 'POST' });
}
