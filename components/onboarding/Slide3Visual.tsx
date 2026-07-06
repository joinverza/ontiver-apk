import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Rect, Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';

export function Slide3Visual() {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1, false
    );
    pulse.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.1 }],
    opacity: 0.8 + pulse.value * 0.2,
  }));

  return (
    <View style={styles.container}>
      {/* Spinning dashed ring */}
      <Animated.View style={[styles.ring, spinStyle]}>
        <Svg width="300" height="300" viewBox="0 0 300 300">
           <Circle cx="150" cy="150" r="130" stroke="#1ED760" strokeWidth="2" strokeDasharray="15, 10" fill="none" opacity="0.4" />
           <Circle cx="150" cy="150" r="100" stroke="#A8E63D" strokeWidth="1" strokeDasharray="5, 5" fill="none" opacity="0.6" />
        </Svg>
      </Animated.View>

      {/* Pulsing Lock Icon */}
      <Animated.View style={[styles.lockWrapper, pulseStyle]}>
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#1ED760" stopOpacity="1" />
              <Stop offset="1" stopColor="#064e3b" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          {/* Shackle */}
          <Path d="M40,50 L40,35 C40,15 80,15 80,35 L80,50" fill="none" stroke="#A8E63D" strokeWidth="12" strokeLinecap="round" />
          {/* Body */}
          <Rect x="20" y="50" width="80" height="60" rx="15" fill="url(#grad)" />
          {/* Keyhole */}
          <Circle cx="60" cy="75" r="8" fill="#041A0B" />
          <Path d="M55,80 L65,80 L62,95 L58,95 Z" fill="#041A0B" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  lockWrapper: {
    position: 'absolute',
    shadowColor: '#1ED760',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  }
});
