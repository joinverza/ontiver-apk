import { ASSETS } from '@/utils/assets';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MicroText } from '../../components/shared/AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';

export default function SplashScreen() {
  const router = useRouter();
  const ds = useDesignSystem();

  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/auth/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={[styles.container, {}]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
          <ASSETS.AUTH.SPLASH_LOGO width={ds.width * 0.5} height={200} />
        </Animated.View>
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
