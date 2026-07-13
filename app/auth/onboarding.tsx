import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, PanResponder } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  interpolate, 
  useAnimatedProps,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  Easing
} from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { TypewriterText } from '../../components/shared/TypewriterText';
import { Slide1Visual } from '../../components/onboarding/Slide1Visual';
import { Slide2Visual } from '../../components/onboarding/Slide2Visual';
import { Slide3Visual } from '../../components/onboarding/Slide3Visual';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const slides = [
  {
    id: 1,
    title: "Protect\nYour Identity With\nVerified\nSecurity",
    titleSegments: [
      { text: "Protect\n", bold: true },
      { text: "Your Identity With\n", bold: false },
      { text: "Verified\n", bold: true },
      { text: "Security", bold: false }
    ],
    subtitle: "",
    Visual: Slide1Visual,
    layout: 'text-top' as const
  },
  {
    id: 2,
    title: "Own and Verify\nDigital Credentials",
    titleSegments: [
      { text: "Own and Verify\n", bold: false },
      { text: "Digital Credentials", bold: true }
    ],
    subtitle: "",
    Visual: Slide2Visual,
    layout: 'visual-top' as const
  },
  {
    id: 3,
    title: "Privacy by Design.\nTrust by Default.",
    titleSegments: [
      { text: "Privacy ", bold: true },
      { text: "by Design.\n", bold: false },
      { text: "Trust ", bold: true },
      { text: "by Default.", bold: false }
    ],
    subtitle: "",
    Visual: Slide3Visual,
    layout: 'visual-top' as const
  }
];

const SWIPE_THRESHOLD = 50;

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visualActivationKey, setVisualActivationKey] = useState(0);
  const [isVisualReady, setIsVisualReady] = useState(false);
  const insets = useSafeAreaInsets();

  // Use refs so PanResponder and setTimeout always see the latest values
  const currentIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  // Animation values for visual content (fade + slide)
  // Start hidden — they reveal after typewriter completes
  const visualOpacity = useSharedValue(0);
  const visualTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(12);

  // Nav elements (skip + button) also wait for typewriter
  const navOpacity = useSharedValue(0);

  // Track whether initial entrance has played
  const hasEnteredRef = useRef(false);

  // Progress ring
  const progressValue = useSharedValue(0.33);
  const CIRCLE_LENGTH = 2 * Math.PI * 26;

  // Premium button animations
  const glowPulse = useSharedValue(0);
  const orbitRotation = useSharedValue(0);
  const dashRotation = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Initialize progress
  React.useEffect(() => {
    progressValue.value = withTiming((currentIndex + 1) / slides.length, { duration: 400 });
  }, [currentIndex]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progressValue.value)
  }));

  // Glow pulse: breathes between 0 and 1
  React.useEffect(() => {
    glowPulse.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
    orbitRotation.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1, false
    );
    dashRotation.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1, false
    );
  }, []);

  const glowRingProps = useAnimatedProps(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.15, 0.5]),
    strokeWidth: interpolate(glowPulse.value, [0, 1], [4, 7]),
  }));

  const orbitProps = useAnimatedProps(() => ({
    rotation: orbitRotation.value,
  }));

  const dashRingProps = useAnimatedProps(() => ({
    rotation: dashRotation.value,
  }));

  const buttonPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const nextSlideIndexRef = useRef<number | null>(null);

  // Called when typewriter text finishes typing in
  const onTypewriterComplete = useCallback(() => {
    setIsVisualReady(true);
    setVisualActivationKey((key) => key + 1);

    // Reveal visual, subtitle, and nav elements
    visualOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });
    visualTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
    subtitleOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });
    subtitleTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
    navOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) });

    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;
    }
  }, []);

  // Called when typewriter text finishes typing out
  const onTypewriterExitComplete = useCallback(() => {
    const nextIndex = nextSlideIndexRef.current;
    if (nextIndex === null) return;

    const idx = currentIndexRef.current;
    const goingForward = nextIndex > idx;

    // Swap content now that the exit is totally complete
    currentIndexRef.current = nextIndex;
    setIsVisualReady(false);
    setCurrentIndex(nextIndex);

    // Reset positions for entrance (will be triggered by onTypewriterComplete)
    visualTranslateY.value = goingForward ? 20 : -20;
    subtitleTranslateY.value = goingForward ? 12 : -12;

    // Small delay to let React render the new slide before triggering the entrance animation
    setTimeout(() => {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
      nextSlideIndexRef.current = null;
    }, 50);
  }, []);

  const goToSlide = useCallback((nextIndex: number) => {
    const idx = currentIndexRef.current;
    if (isTransitioningRef.current || nextIndex < 0 || nextIndex >= slides.length) return;
    if (nextIndex === idx) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);
    nextSlideIndexRef.current = nextIndex;

    const goingForward = nextIndex > idx;

    // Fade out visual + subtitle + nav
    visualOpacity.value = withTiming(0, { duration: 250, easing: Easing.inOut(Easing.quad) });
    visualTranslateY.value = withTiming(goingForward ? -20 : 20, { duration: 250, easing: Easing.inOut(Easing.quad) });
    subtitleOpacity.value = withTiming(0, { duration: 200, easing: Easing.inOut(Easing.quad) });
    subtitleTranslateY.value = withTiming(goingForward ? 12 : -12, { duration: 200, easing: Easing.inOut(Easing.quad) });
    navOpacity.value = withTiming(0, { duration: 200, easing: Easing.inOut(Easing.quad) });
    
    // The rest of the swap logic is now handled in onTypewriterExitComplete
  }, []);

  const nextSlide = useCallback(() => {
    const idx = currentIndexRef.current;
    if (idx < slides.length - 1) {
      goToSlide(idx + 1);
    } else {
      router.push("/auth/create-account");
    }
  }, [goToSlide]);

  const prevSlide = useCallback(() => {
    const idx = currentIndexRef.current;
    if (idx > 0) {
      goToSlide(idx - 1);
    }
  }, [goToSlide]);

  const skip = () => {
    router.push("/auth/create-account");
  };

  // Swipe detection — uses refs internally so it never goes stale
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 15 && Math.abs(gestureState.dy) < Math.abs(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const idx = currentIndexRef.current;
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Swipe left → next
          if (idx < slides.length - 1) {
            goToSlide(idx + 1);
          } else {
            router.push("/auth/create-account");
          }
        } else if (gestureState.dx > SWIPE_THRESHOLD) {
          // Swipe right → previous
          if (idx > 0) {
            goToSlide(idx - 1);
          }
        }
      }
    })
  ).current;

  const slide = slides[currentIndex];
  const SlideVisual = slide.Visual as React.ComponentType<{ activationKey?: number; isVisualReady?: boolean }>;
  const typewriterSpeed = hasEnteredRef.current ? 9 : 14;
  const typewriterEnterDelay = hasEnteredRef.current ? 35 : 80;

  // Animated styles for visual area
  const visualAnimStyle = useAnimatedStyle(() => ({
    opacity: visualOpacity.value,
    transform: [{ translateY: visualTranslateY.value }]
  }));

  const subtitleAnimStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }]
  }));

  const navAnimStyle = useAnimatedStyle(() => ({
    opacity: navOpacity.value
  }));

  // Button position: fixed at bottom-right across every onboarding step
  const btnStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: SCREEN_WIDTH - 128 },
        { translateY: SCREEN_HEIGHT - 104 - insets.bottom }
      ]
    };
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Content Area */}
      <View style={styles.contentArea}>
        {slide.layout === 'text-top' ? (
          <>
            <View style={[styles.textContainerTop, { marginTop: 60 + insets.top }]}>
              <TypewriterText
                style={[styles.title, slide.id === 1 && styles.titleLarge]}
                text={slide.title}
                segments={(slide as any).titleSegments}
                isActive={!isTransitioning}
                typingSpeed={typewriterSpeed}
                enterDelay={typewriterEnterDelay}
                exitSpeed={5}
                maxExitDuration={180}
                onTypeComplete={onTypewriterComplete}
                onExitComplete={onTypewriterExitComplete}
              />
              {!!slide.subtitle && (
                <Animated.View style={subtitleAnimStyle}>
                  <Text style={styles.subtitle}>{slide.subtitle}</Text>
                </Animated.View>
              )}
            </View>
            <Animated.View style={[styles.visualContainerBottom, visualAnimStyle]}>
              <SlideVisual activationKey={visualActivationKey} isVisualReady={isVisualReady} />
            </Animated.View>
          </>
        ) : (
          <>
            <Animated.View style={[styles.visualContainerTop, { paddingTop: 40 + insets.top }, visualAnimStyle]}>
              <SlideVisual activationKey={visualActivationKey} isVisualReady={isVisualReady} />
            </Animated.View>
            <View style={[styles.textContainerBottom, { paddingBottom: 120 + insets.bottom }]}>
              <TypewriterText
                style={[styles.title, slide.id === 1 && styles.titleLarge]}
                text={slide.title}
                segments={(slide as any).titleSegments}
                isActive={!isTransitioning}
                typingSpeed={typewriterSpeed}
                enterDelay={typewriterEnterDelay}
                exitSpeed={5}
                maxExitDuration={180}
                onTypeComplete={onTypewriterComplete}
                onExitComplete={onTypewriterExitComplete}
              />
              {!!slide.subtitle && (
                <Animated.View style={subtitleAnimStyle}>
                  <Text style={styles.subtitle}>{slide.subtitle}</Text>
                </Animated.View>
              )}
            </View>
          </>
        )}
      </View>

      {/* Floating Skip Button */}
      <Animated.View style={[styles.skipWrapper, { bottom: 30 + insets.bottom }, navAnimStyle]}>
        <TouchableOpacity onPress={skip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Floating Animated Next Button */}
      <Animated.View style={[styles.nextButtonWrapper, btnStyle, navAnimStyle]}>
        <Animated.View style={buttonPressStyle}>
        <TouchableOpacity 
          onPress={nextSlide} 
          onPressIn={() => { buttonScale.value = withSpring(0.88, { damping: 15, stiffness: 400 }); }}
          onPressOut={() => { buttonScale.value = withSpring(1, { damping: 12, stiffness: 300 }); }}
          style={styles.nextButton} 
          activeOpacity={1}
        >
          <Svg width="82" height="82" viewBox="0 0 82 82">
            <Defs>
              <LinearGradient id="btnGrad" x1="0" y1="0" x2="0.8" y2="1">
                <Stop offset="0" stopColor="#0a1a0f" stopOpacity="1" />
                <Stop offset="1" stopColor="#022c22" stopOpacity="1" />
              </LinearGradient>
              <LinearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#1ED760" stopOpacity="0.6" />
                <Stop offset="1" stopColor="#86efac" stopOpacity="0.3" />
              </LinearGradient>
            </Defs>
            
            {/* Outer breathing glow ring */}
            {/* <AnimatedCircle 
              cx="41" cy="41" r="38" 
              stroke="url(#glowGrad)"  
              fill="none"
              animatedProps={glowRingProps}
            /> */}

            {/* Rotating dashed ring */}
            <AnimatedG animatedProps={dashRingProps} origin="41, 41">
              <Circle 
                cx="41" cy="41" r="35" 
                stroke="#1ED760" 
                strokeWidth="1" 
                fill="none" 
                strokeDasharray="6 12" 
                opacity={0.25}
              />
            </AnimatedG>

            {/* Progress track */}
            <Circle cx="41" cy="41" r="26" stroke="#F3F4F6" strokeWidth="2.5" fill="none" />
            
            {/* Progress fill (animated green ring) */}
            <AnimatedCircle 
              cx="41" cy="41" r="26" 
              stroke="#1ED760"  
              strokeWidth="3" 
              strokeDasharray={CIRCLE_LENGTH} 
              animatedProps={animatedProps} 
              strokeLinecap="round" 
              fill="none" 
              rotation="-90" origin="41, 41"
            />

            {/* Orbiting dots */}
            {/* <AnimatedG animatedProps={orbitProps} origin="41, 41">
              <Circle cx="41" cy="5" r="2.5" fill="#1ED760" opacity={0.7} />
              <Circle cx="77" cy="41" r="1.8" fill="#86efac" opacity={0.5} />
              <Circle cx="41" cy="77" r="2" fill="#1ED760" opacity={0.4} />
            </AnimatedG> */}
            
            {/* Inner dark button */}
            <Circle cx="41" cy="41" r="23" fill="url(#btnGrad)" />
            
            {/* Subtle inner border ring */}
            <Circle cx="41" cy="41" r="23" stroke="#1ED760" strokeWidth="0.8" fill="none" opacity={0.3} />
            
            {/* Arrow in accent green */}
            <Path d="M33 41H49M44 36L49 41L44 46" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  // -- Slide 1: Text Top --
  textContainerTop: {
    paddingHorizontal: 32,
    top: 60,
  },
  visualContainerBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  // -- Slide 2/3: Visual Top --
  visualContainerTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainerBottom: {
    paddingHorizontal: 12,
  },
  
  // -- Typography --
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 52,
    color: '#020805',
    lineHeight: 60,
    marginBottom: 16,
    letterSpacing: -1,
  },
  titleLarge: {
    fontSize: 68,
    lineHeight: 72,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    color: '#4B5563',
    lineHeight: 26,
    maxWidth: '95%',
  },

  // -- Navigation Elements --
  skipWrapper: {
    position: 'absolute',
    left: 32,
  },
  skipButton: {
    padding: 10,
    marginLeft: -10,
  },
  skipText: {
    fontFamily: 'Inter_700Bold',
    color: '#020805',
    fontSize: 20,
  },
  nextButtonWrapper: {
    position: 'absolute',
    top: -10,
    left: 28,
    width: 82,
    height: 82,
    zIndex: 100,
  },
  nextButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
