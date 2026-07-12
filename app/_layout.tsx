import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { 
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter';
import {
  RobotoMono_700Bold
} from '@expo-google-fonts/roboto-mono/700Bold';
import { ToastProvider } from '../context/ToastContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../context/ThemeContext';
import AppStatusBar from '../components/shared/AppStatusBar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    RobotoMono_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <AppStatusBar />
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
