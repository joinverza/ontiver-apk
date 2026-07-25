import Constants from 'expo-constants';
import { z } from 'zod';

const ConfigSchema = z.object({
  appEnvironment: z.enum(['development', 'preview', 'production']).default('development'),
  apiUrl: z.string().url(),
  websiteUrl: z.string().url().default('https://ontiver.com'),
  supportEmail: z.string().email().default('support@ontiver.com'),
  googleWebClientId: z.string().min(20).optional(),
  sentryDsn: z.string().url().optional(),
  smileIdEnvironment: z.enum(['sandbox', 'production']).default('sandbox'),
});

const extra = Constants.expoConfig?.extra ?? {};

export const runtimeConfig = ConfigSchema.parse({
  appEnvironment: extra.appEnvironment ?? process.env.EXPO_PUBLIC_APP_ENV,
  apiUrl: extra.apiUrl ?? process.env.EXPO_PUBLIC_API_BASE_URL ?? process.env.EXPO_PUBLIC_API_URL,
  websiteUrl: extra.websiteUrl ?? process.env.EXPO_PUBLIC_WEBSITE_URL,
  supportEmail: extra.supportEmail ?? process.env.EXPO_PUBLIC_SUPPORT_EMAIL,
  googleWebClientId: extra.googleWebClientId ?? process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  sentryDsn: extra.sentryDsn ?? process.env.EXPO_PUBLIC_SENTRY_DSN,
  smileIdEnvironment:
    extra.smileIdEnvironment ?? process.env.EXPO_PUBLIC_SMILEID_ENVIRONMENT,
});

export const API_BASE_URL = runtimeConfig.apiUrl.replace(/\/$/, '');

export const legalUrls = {
  legal: `${runtimeConfig.websiteUrl.replace(/\/$/, '')}/legal`,
  privacy: `${runtimeConfig.websiteUrl.replace(/\/$/, '')}/privacy`,
  terms: `${runtimeConfig.websiteUrl.replace(/\/$/, '')}/terms`,
  cookies: `${runtimeConfig.websiteUrl.replace(/\/$/, '')}/cookies`,
  accountDeletion: `${runtimeConfig.websiteUrl.replace(/\/$/, '')}/account-deletion`,
  support: `${runtimeConfig.websiteUrl.replace(/\/$/, '')}/support`,
};
