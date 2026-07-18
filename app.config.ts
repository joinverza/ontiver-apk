import type { ExpoConfig, ConfigContext } from 'expo/config';

const appEnvironment = process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
const googleIosUrlScheme = process.env.GOOGLE_IOS_REVERSED_CLIENT_ID
  ?? (appEnvironment === 'production' ? undefined : 'com.googleusercontent.apps.local-development');

if (appEnvironment === 'production' && !process.env.GOOGLE_SERVICE_INFO_PLIST && !googleIosUrlScheme) {
  throw new Error('Production builds require GOOGLE_SERVICE_INFO_PLIST or GOOGLE_IOS_REVERSED_CLIENT_ID.');
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Ontiver',
  // This must match the slug registered for the EAS project ID below.
  // It does not control the App Store or Play Store application identifiers.
  slug: 'ontiver-apk',
  version: '1.0.0',
  owner: 'ontiverhq',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'ontiver',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.ontiverhq.ontiver',
    usesAppleSignIn: true,
    googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST,
    infoPlist: {
      NSFaceIDUsageDescription: 'Use Face ID only to unlock your Ontiver app on this device.',
    },
  },
  android: {
    package: 'com.ontiverhq.ontiver',
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    predictiveBackGestureEnabled: false,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-secure-store',
    'expo-apple-authentication',
    '@sentry/react-native/expo',
    [
      'react-native-nitro-google-signin',
      {
        ...(process.env.GOOGLE_SERVICE_INFO_PLIST ? { iosGoogleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST } : {}),
        ...(process.env.GOOGLE_SERVICES_JSON ? { androidGoogleServicesFile: process.env.GOOGLE_SERVICES_JSON } : {}),
        ...(googleIosUrlScheme ? { iosUrlScheme: googleIosUrlScheme } : {}),
      },
    ],
    ['expo-notifications', { icon: './assets/images/icon.png', color: '#115E45' }],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          buildToolsVersion: '36.0.0',
        },
      },
    ],
    './plugins/withSmileConfig.js',
  ],
  experiments: { typedRoutes: true },
  extra: {
    appEnvironment,
    apiUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? process.env.EXPO_PUBLIC_API_URL,
    websiteUrl: process.env.EXPO_PUBLIC_WEBSITE_URL ?? 'https://ontiver.com',
    supportEmail: process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? 'support@ontiver.com',
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    smileIdEnvironment: process.env.EXPO_PUBLIC_SMILEID_ENVIRONMENT ?? 'sandbox',
    router: {},
    eas: { projectId: '06f2b6de-a87c-4470-920c-0855b405d0f3' },
  },
  runtimeVersion: { policy: 'appVersion' },
  updates: { url: 'https://u.expo.dev/06f2b6de-a87c-4470-920c-0855b405d0f3' },
});
