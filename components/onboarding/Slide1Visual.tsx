import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  Easing,
  useAnimatedProps
} from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop, ClipPath, Rect, G } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export function Slide1Visual() {
  const float = useSharedValue(0);
  const shine = useSharedValue(40);

  useEffect(() => {
    // Float animation
    float.value = withRepeat(
      withTiming(1, { duration: 3750, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Shine animation (moves from 40 to 320 to cross the 80-310 viewBox X-bounds)
    shine.value = withRepeat(
      withTiming(320, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: float.value * -12 }
      ],
    };
  });

  const shineProps = useAnimatedProps(() => {
    let op = 0;
    const progress = (shine.value - 40) / (320 - 40); // 0 to 1
    if (progress < 0.15) op = (progress / 0.15) * 0.55;
    else if (progress < 0.5) op = 0.55 - ((progress - 0.15) / 0.35 * 0.4);
    else if (progress < 0.85) op = 0.15 + ((progress - 0.5) / 0.35 * 0.35);
    else op = 0.5 - ((progress - 0.85) / 0.15 * 0.5);

    return {
      x: shine.value,
      opacity: Math.max(0, op)
    };
  });

  const pathData = "M 275.0 340.5 L 234.0 325.5 Q 219.0 320.0 204.0 325.7 L 197.0 328.3 Q 182.0 334.0 170.3 344.9 L 164.7 350.1 Q 153.0 361.0 152.1 375.9 L 151.9 379.1 Q 151.0 394.0 161.2 406.3 L 164.8 410.7 Q 175.0 423.0 160.5 429.9 L 130.5 444.1 Q 116.0 451.0 109.7 459.1 L 108.3 460.9 Q 102.0 469.0 100.7 479.4 L 100.3 481.6 Q 99.0 492.0 107.9 505.3 L 110.1 508.7 Q 119.0 522.0 133.6 528.6 L 263.4 587.4 Q 278.0 594.0 281.1 587.7 L 281.9 586.3 Q 285.0 580.0 270.5 573.3 L 144.5 515.7 Q 130.0 509.0 123.7 500.4 L 122.3 498.6 Q 116.0 490.0 121.0 478.3 L 122.0 475.7 Q 127.0 464.0 136.0 462.6 L 138.0 462.4 Q 147.0 461.0 161.6 467.6 L 275.4 519.4 Q 290.0 526.0 290.0 510.0 L 290.0 469.0 Q 290.0 453.0 275.3 446.7 L 206.7 417.3 Q 192.0 411.0 180.8 401.6 L 178.2 399.4 Q 167.0 390.0 169.2 377.9 L 169.8 375.1 Q 172.0 363.0 182.3 359.4 L 184.7 358.6 Q 195.0 355.0 209.7 361.3 L 276.3 389.7 Q 291.0 396.0 290.7 380.0 L 290.3 362.0 Q 290.0 346.0 275.0 340.5 Z";

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.svgWrapper, animatedStyle]}>
        <Svg width="100%" height="100%" viewBox="80 300 230 310" style={styles.svg}>
          <Defs>
            <LinearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              {/* App's Green Theme */}
              <Stop offset="0%" stopColor="#dcfce7" />
              <Stop offset="100%" stopColor="#1ED760" />
            </LinearGradient>
            <ClipPath id="ribbonClip">
              <Path d={pathData} />
            </ClipPath>
          </Defs>
          
          <Path d={pathData} fill="url(#ribbonGrad)" />

          <G clipPath="url(#ribbonClip)">
            <AnimatedRect 
              y="300" width="34" height="320" 
              fill="#ffffff" 
              transform="skewX(-18)" 
              animatedProps={shineProps}
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 380,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWrapper: {
    width: '160%',
    height: '130%',
    marginRight: -350,
  },
  svg: {
    overflow: 'visible'
  }
});
