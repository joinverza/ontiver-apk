import { ASSETS } from '@/utils/assets';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MicroText } from '../../components/shared/AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';

export default function SplashScreen() {
  const router = useRouter();
  const ds = useDesignSystem();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={[styles.container, {}]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ASSETS.AUTH.SPLASH_LOGO width={ds.width * 0.5} height={200} />
      </View>
      <MicroText color={Colors.white}>
        Powered by Qynara
      </MicroText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingBottom: 32,
  },
});
