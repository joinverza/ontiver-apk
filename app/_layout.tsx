import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { RobotoMono_700Bold } from '@expo-google-fonts/roboto-mono/700Bold';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';

import AppStatusBar from '@/components/shared/AppStatusBar';
import { AppLockScreen } from '@/components/shared/AppLockScreen';
import { StepUpPrompt } from '@/components/shared/StepUpPrompt';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { AppProviders } from '@/providers/AppProviders';
import { useAuthStore } from '@/store/authStore';
import { runtimeConfig } from '@/lib/config';

Sentry.init({
  dsn: runtimeConfig.sentryDsn,
  enabled: Boolean(runtimeConfig.sentryDsn),
  environment: runtimeConfig.appEnvironment,
  sendDefaultPii: false,
  attachScreenshot: false,
  attachViewHierarchy: false,
  tracesSampleRate: runtimeConfig.appEnvironment === 'production' ? 0.1 : 1,
  beforeSend: (event) => ({ ...event, user: undefined }),
});

void SplashScreen.preventAutoHideAsync();

function Navigation() {
  const status = useAuthStore((state) => state.status);
  const isAppLocked = useAuthStore((state) => state.isAppLocked);

  if (status === 'restoring') {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  }

  if (status === 'authenticated' && isAppLocked) return <AppLockScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="continue" />
      <Stack.Protected guard={status === 'anonymous'}>
        <Stack.Screen name="auth" />
      </Stack.Protected>
      <Stack.Protected guard={status === 'authenticated'}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(screens)" />
      </Stack.Protected>
    </Stack>
  );
}

function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    RobotoMono_700Bold,
  });

  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <AppProviders>
            <Navigation />
            <StepUpPrompt />
            <AppStatusBar />
          </AppProviders>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(RootLayout);
