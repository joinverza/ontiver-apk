import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  useAnimatedScrollHandler, 
  interpolate, 
  Extrapolation,
  useAnimatedProps,
  useDerivedValue
} from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Slide1Visual } from '../../components/onboarding/Slide1Visual';
import { Slide2Visual } from '../../components/onboarding/Slide2Visual';
import { Slide3Visual } from '../../components/onboarding/Slide3Visual';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const slides = [
  {
    id: 1,
    title: "Verify Once.\nShare\nForever",
    subtitle: "Stop submitting your ID over and over. Verify once and share instantly.",
    Visual: Slide1Visual,
    layout: 'text-top'
  },
  {
    id: 2,
    title: "Your Identity.\nAll in One Place",
    subtitle: "Store your government ID, phone, address, and more — safely encrypted.",
    Visual: Slide2Visual,
    layout: 'visual-top'
  },
  {
    id: 3,
    title: "You Decide\nWho Sees What",
    subtitle: "Share only what's needed — nothing more. Zero-knowledge privacy.",
    Visual: Slide3Visual,
    layout: 'visual-top'
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    }
  });

  const handleScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * SCREEN_WIDTH, animated: true });
    } else {
      router.push("/auth/create-account");
    }
  };

  const skip = () => {
    router.push("/auth/create-account");
  };

  // Button Animation Styles (Sweeps from Top-Left to Bottom-Right)
  const btnTopBase = 290 + (insets.top > 0 ? insets.top : 20); 
  const btnStyle = useAnimatedStyle(() => {
    const tx = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH],
      [0, SCREEN_WIDTH - 128], // From left: 32 -> right: 32 (base left is 32)
      Extrapolation.CLAMP
    );
    const ty = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH],
      [btnTopBase, SCREEN_HEIGHT - 104 - insets.bottom], // From below text -> bottom right
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: tx },
        { translateY: ty }
      ]
    };
  });

  // Progress Ring Animation
  const CIRCLE_LENGTH = 2 * Math.PI * 30; // r=30
  const progress = useDerivedValue(() => {
    const slideProgress = scrollX.value / SCREEN_WIDTH; 
    return interpolate(slideProgress, [0, 1, 2], [0.33, 0.66, 1], Extrapolation.CLAMP);
  });
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value)
  }));

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => {
          return (
            <View key={slide.id} style={styles.slide}>
              {slide.layout === 'text-top' ? (
                <>
                  <View style={[styles.textContainerTop, { marginTop: 60 + insets.top }]}>
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.subtitle}>{slide.subtitle}</Text>
                  </View>
                  <View style={styles.visualContainerBottom}>
                    <slide.Visual />
                  </View>
                </>
              ) : (
                <>
                  <View style={[styles.visualContainerTop, { paddingTop: 40 + insets.top }]}>
                    <slide.Visual />
                  </View>
                  <View style={[styles.textContainerBottom, { paddingBottom: 120 + insets.bottom }]}>
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.subtitle}>{slide.subtitle}</Text>
                  </View>
                </>
              )}
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Floating Skip Button (Bottom Left) */}
      <Animated.View style={[styles.skipWrapper, { bottom: 30 + insets.bottom }]}>
        <TouchableOpacity onPress={skip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Floating Animated Next Button */}
      <Animated.View style={[styles.nextButtonWrapper, btnStyle]}>
        <TouchableOpacity onPress={nextSlide} style={styles.nextButton} activeOpacity={0.8}>
          <Svg width="68" height="68" viewBox="0 0 68 68">
            <Defs>
              <LinearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#1ED760" stopOpacity="1" />
                <Stop offset="1" stopColor="#064e3b" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            
            {/* Progress track (grey) */}
            <Circle cx="34" cy="34" r="30" stroke="#F3F4F6" strokeWidth="3" fill="none" />
            
            {/* Progress fill (animated green ring) */}
            <AnimatedCircle 
              cx="34" cy="34" r="30" 
              stroke="#1ED760" 
              strokeWidth="3.5" 
              strokeDasharray={CIRCLE_LENGTH} 
              animatedProps={animatedProps} 
              strokeLinecap="round" 
              fill="none" 
              rotation="-90" origin="34, 34"
            />
            
            {/* Inner green button */}
            <Circle cx="34" cy="34" r="23" fill="url(#btnGrad)" />
            
            {/* Arrow */}
            <Path d="M30,26 L38,34 L30,42" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background as requested
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'space-between',
  },
  // -- Slide 1: Text Top --
  textContainerTop: {
    paddingHorizontal: 32,
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
    paddingHorizontal: 32,
  },
  
  // -- Typography --
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: '#020805', // Almost black
    lineHeight: 52,
    marginBottom: 16,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 17,
    color: '#4B5563', // Gray-600
    lineHeight: 26,
    maxWidth: '95%',
    fontWeight: '500',
  },

  // -- Navigation Elements --
  skipWrapper: {
    position: 'absolute',
    left: 32,
  },
  skipButton: {
    padding: 10,
    marginLeft: -10, // negative margin for easier tap target without shifting text
  },
  skipText: {
    color: '#020805',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButtonWrapper: {
    position: 'absolute',
    top: 0,
    left: 32,
    width: 68,
    height: 68,
    zIndex: 100,
  },
  nextButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
