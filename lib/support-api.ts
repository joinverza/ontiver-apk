import { z } from 'zod';

import { SuccessEnvelope, apiRequest } from './api';

const SupportFaqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

const SupportFaqsSchema = z.object({
  items: z.array(SupportFaqSchema),
  managedBy: z.string(),
});

export async function getSupportFaqs() {
  return (await apiRequest('/api/v1/banking/user/support/faqs', SuccessEnvelope(SupportFaqsSchema))).data.items;
}

const SupportMessageSchema = z.object({ messageId: z.string(), threadId: z.string(), message: z.string(), createdAt: z.string() }).passthrough();

export async function sendSupportMessage(message: string) {
  return (await apiRequest('/api/v1/banking/user/support/chat/messages', SuccessEnvelope(SupportMessageSchema), { method: 'POST', body: JSON.stringify({ message }) })).data;
}

export async function rateSupportConversation(rating: number, comment?: string) {
  return (await apiRequest('/api/v1/banking/user/support/chat/rating', SuccessEnvelope(z.object({ threadId: z.string(), rating: z.number(), comment: z.string().nullable().optional(), updatedAt: z.string() })), { method: 'POST', body: JSON.stringify({ rating, comment }) })).data;
}
