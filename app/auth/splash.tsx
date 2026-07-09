import { ASSETS } from '@/utils/assets';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN = Dimensions.get('window');
const GREEN = '#1ED760';
const BRIGHT_GREEN = '#6ae63d';
const DARK_BG = '#041A0B';
const INNER_BG = '#072010';
const LOADER_DURATION = 3400;
const PROGRESS_MS = 2200;

// Animated SVG Circle
const AnimatedSvgCircle = Animated.createAnimatedComponent(SvgCircle);

export default function SplashScreen() {
  const router = useRouter();

  // ── Staggered Entrance ───────────────────────────────────────
  const orbitOpacity = useSharedValue(0);
  const orbitY = useSharedValue(24);

  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(20);

  const barOpacity = useSharedValue(0);
  const barY = useSharedValue(16);

  // ── Ring rotations (spin continuously) ───────────────────────
  const outerRot = useSharedValue(0);
  const innerRot = useSharedValue(0);

  // ── Master progress 0 → 1  (drives bar + rings + glow) ───────
  const progress = useSharedValue(0);

  // ── Continuous Breathing ──────────────────────────────────────
  const logoScale = useSharedValue(1);
  const textGlow = useSharedValue(1);

  // ── Exit fade ─────────────────────────────────────────────────
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    // 1. Orbit scales/fades in first
    orbitOpacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.exp) });
    orbitY.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.exp) });

    // 2. Text fades in after 250ms
    textOpacity.value = withDelay(250, withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) }));
    textY.value = withDelay(250, withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }));

    // 3. Bar fades in after 500ms
    barOpacity.value = withDelay(500, withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) }));
    barY.value = withDelay(500, withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }));

    // Rings spin continuously
    outerRot.value = withRepeat(
      withTiming(360, { duration: 14000, easing: Easing.linear }),
      -1, false,
    );
    innerRot.value = withRepeat(
      withTiming(-360, { duration: 18000, easing: Easing.linear }),
      -1, false,
    );

    // Continuous breathing for logo and text
    logoScale.value = withRepeat(
      withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
    textGlow.value = withRepeat(
      withTiming(0.65, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );

    // Master progress starts after everything is visible (850ms delay)
    progress.value = withDelay(850, withTiming(1, {
      duration: PROGRESS_MS,
      easing: Easing.inOut(Easing.ease),
    }));

    // Fade out → navigate
    const timer = setTimeout(() => {
      screenOpacity.value = withTiming(
        0,
        { duration: 500, easing: Easing.inOut(Easing.ease) },
        () => runOnJS(navigate)(),
      );
    }, LOADER_DURATION);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function navigate() {
    router.replace('/auth/onboarding');
  }

  // ── Animated styles ──────────────────────────────────────────

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const orbitEntranceStyle = useAnimatedStyle(() => ({
    opacity: orbitOpacity.value,
    transform: [{ translateY: orbitY.value }],
  }));

  const textEntranceStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  const barEntranceStyle = useAnimatedStyle(() => ({
    opacity: barOpacity.value,
    transform: [{ translateY: barY.value }],
  }));

  // Outer ring: starts small + dim, grows to full + bright
  const outerRingStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${outerRot.value}deg` },
      { scale: interpolate(progress.value, [0, 1], [0.85, 1.0]) }, //means the outer ring starts at 85% size and grows to 100% as progress goes from 0 to 1
    ],
    opacity: interpolate(progress.value, [0, 0.25, 1], [0.3, 0.6, 1]),
  }));

  // Inner ring: lags slightly behind outer
  const innerRingStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${innerRot.value}deg` },
      { scale: interpolate(progress.value, [0, 1], [0.75, 1.0]) },
    ],
    opacity: interpolate(progress.value, [0, 0.35, 1], [0.2, 0.5, 0.85]),
  }));

  // Glow: radiates outward as progress increases
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.4, 1], [0.15, 0.5, 0.95]),
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.2, 3.4]) },
    ],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textGlow.value,
  }));

  // ── Circular progress arc ───────────────────────────────────────
  // We use the outer ring's size to set the radius
  const BASE_SIZE = Math.min(SCREEN.width * 0.38, 150);
  const outerRingSize = BASE_SIZE * 1.55;
  const RING_RADIUS = (outerRingSize / 2) - 3; // slightly inset so stroke doesn't overflow
  const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

  const arcProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));


  const logoSize = BASE_SIZE * 0.84;
  const innerDiscSize = BASE_SIZE * 1.15;
  const innerRingSize = BASE_SIZE * 1.35;

  return (
    <Animated.View style={[styles.screen, screenStyle]}>

      {/* Radial glow */}
      {/* <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[styles.radialGlow, glowStyle]} />
      </View> */}

      <View style={styles.topLine} pointerEvents="none" />

      {/* ── Main content ── */}
      <View style={styles.content}>

        {/* 1. Orbit Cluster */}
        <Animated.View style={[styles.orbitContainer, { width: outerRingSize, height: outerRingSize }, orbitEntranceStyle]}>

          {/* Outer ring */}
          <Animated.View
            style={[
              styles.outerRing,
              {
                width: outerRingSize,
                height: outerRingSize,
                borderRadius: outerRingSize / 2,
                top: 0,
                left: 0,
              },
              outerRingStyle,
            ]}
          />

          {/* Inner ring */}
          <Animated.View
            style={[
              styles.innerRing,
              {
                width: innerRingSize,
                height: innerRingSize,
                borderRadius: innerRingSize / 2,
                top: (outerRingSize - innerRingSize) / 2,
                left: (outerRingSize - innerRingSize) / 2,
              },
              innerRingStyle,
            ]}
          />

          {/* Dark disc behind logo */}
          <View
            style={[
              styles.innerDisc,
              {
                width: innerDiscSize,
                height: innerDiscSize,
                borderRadius: innerDiscSize / 2,
                top: (outerRingSize - innerDiscSize) / 2,
                left: (outerRingSize - innerDiscSize) / 2,
              },
            ]}
          />

          {/* Logo centred */}
          <Animated.View style={[styles.logoWrapper, {
            width: logoSize,
            height: logoSize,
            top: (outerRingSize - logoSize) / 2,
            left: (outerRingSize - logoSize) / 2,
          }, logoAnimatedStyle]}>
            <ASSETS.AUTH.SPLASH_LOGO width="100%" height="100%" />
          </Animated.View>
        </Animated.View>

        {/* 2. Text Block */}
        {/* <Animated.View style={[styles.textBlock, textEntranceStyle]}>
          <Animated.View style={[styles.textBlockInner, textAnimatedStyle]}>
            <Text style={styles.brandLabel}>Ontiver</Text>
            <Text style={styles.subLabel}>Opening secure identity workspace</Text>
          </Animated.View>
        </Animated.View> */}

        {/* 3. Progress Bar */}
        {/* <Animated.View style={[styles.progressTrack, barEntranceStyle]}>
          <View style={styles.progressMask}>
            <Animated.View style={[styles.progressFillWrapper, progressBarStyle]}>
              <LinearGradient
                colors={['transparent', GREEN, BRIGHT_GREEN]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>

          <Animated.View style={[styles.progressTip, progressTipTranslateStyle, tipOpacityStyle]} />
        </Animated.View> */}

        {/* Circular progress arc — drawn on top of the outer orbit ring */}
        <Animated.View
          style={[{
            position: 'absolute',
            width: outerRingSize,
            height: outerRingSize,
            top: 0,
            left: 0,
          }, orbitEntranceStyle]}
          pointerEvents="none"
        >
          <Svg
            width={outerRingSize}
            height={outerRingSize}
            style={{ transform: [{ rotate: '-90deg' }] }}
          >
            {/* Track (background arc) */}
            <SvgCircle
              cx={outerRingSize / 2}
              cy={outerRingSize / 2}
              r={RING_RADIUS}
              stroke="rgba(30,215,96,0.12)"
              strokeWidth={3}
              fill="none"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            />
            {/* Fill arc */}
            <AnimatedSvgCircle
              cx={outerRingSize / 2}
              cy={outerRingSize / 2}
              r={RING_RADIUS}
              stroke={BRIGHT_GREEN}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              animatedProps={arcProps}
            />
          </Svg>
        </Animated.View>

      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DARK_BG,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  radialGlow: {
    position: 'absolute',
    width: 560,
    height: 560,
    borderRadius: 280,
    backgroundColor: 'rgba(30,215,96,0.18)',
    top: '50%',
    left: '50%',
    marginTop: -280,
    marginLeft: -280,
  },

  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(30,215,96,0.45)',
  },

  content: {
    alignItems: 'center',
  },

  // ── Orbit ────────────────────────────────────────────────────
  orbitContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(30,215,96,0.70)',
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(30,215,96,0.50)',
    borderStyle: 'dashed',
  },
  innerDisc: {
    position: 'absolute',
    backgroundColor: INNER_BG,
    shadowColor: '#0e3c1e90',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 12,
  },
  logoWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pointer: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── Text ─────────────────────────────────────────────────────
  textBlock: {
    marginTop: 32,
    alignItems: 'center',
  },
  textBlockInner: {
    alignItems: 'center',
  },
  brandLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3.1,
    textTransform: 'uppercase',
    color: GREEN,
  },
  subLabel: {
    marginTop: 8,
    fontSize: 13,
    color: 'rgba(187,224,196,0.75)',
  },
});
