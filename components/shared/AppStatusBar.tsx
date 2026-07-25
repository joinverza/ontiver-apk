import { useSegments } from 'expo-router';
import { StatusBar, type StatusBarStyle } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { Platform, StatusBar as NativeStatusBar } from 'react-native';
import Colors from '../../constants/Colors';
import { useTheme } from '../../context/ThemeContext';

const DARK_SPLASH_BACKGROUND = '#041A0B';
const LIGHT_PAGE_BACKGROUND = '#F8FAFC';

const primaryTopRoutes = new Set([
  '(tabs)/settings',
  '(screens)/add-credential',
  '(screens)/kyc',
  '(screens)/scan',
  'auth/create-account',
  'auth/login',
  'auth/biometric-auth',
  'auth/biometric-auth/use-pin',
]);

function routeStartsOnDarkSurface(routeKey: string) {
  if (routeKey === 'auth/splash') {
    return true;
  }

  if (routeKey.startsWith('(screens)/settings/ontiver-pro')) {
    return true;
  }

  return primaryTopRoutes.has(routeKey);
}

export function AppStatusBar() {
  const segments = useSegments();
  const { isDark } = useTheme();

  const routeKey = segments.join('/');
  const startsOnDarkSurface = routeStartsOnDarkSurface(routeKey);

  const { backgroundColor, style } = useMemo<{
    backgroundColor: string;
    style: StatusBarStyle;
  }>(() => {
    if (routeKey === 'auth/splash') {
      return {
        backgroundColor: DARK_SPLASH_BACKGROUND,
        style: 'light',
      };
    }

    if (startsOnDarkSurface) {
      return {
        backgroundColor: Colors.primary,
        style: 'light',
      };
    }

    return {
      backgroundColor: isDark ? Colors.backgroundTint : LIGHT_PAGE_BACKGROUND,
      style: isDark ? 'light' : 'dark',
    };
  }, [isDark, routeKey, startsOnDarkSurface]);

  useEffect(() => {
    const nativeStyle = style === 'light' ? 'light-content' : 'dark-content';

    NativeStatusBar.setBarStyle(nativeStyle, true);

    if (Platform.OS === 'android') {
      NativeStatusBar.setTranslucent(false);
      NativeStatusBar.setBackgroundColor(backgroundColor, true);
    }
  }, [backgroundColor, style]);

  return <StatusBar animated={false} style={style} />;
}

export default AppStatusBar;
