import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing, withDelay } from 'react-native-reanimated';
import Svg, { Rect, Defs, LinearGradient, Stop, Text as SvgText, Circle, Path } from 'react-native-svg';

export function Slide2Visual() {
  const float1 = useSharedValue(0);
  const float2 = useSharedValue(0);

  React.useEffect(() => {
    float1.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
    float2.value = withDelay(1000, withRepeat(
      withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
      -1, true
    ));
  }, []);

  const style1 = useAnimatedStyle(() => ({
    transform: [{ translateY: float1.value * -15 }, { rotate: '-12deg' }],
  }));
  
  const style2 = useAnimatedStyle(() => ({
    transform: [{ translateY: float2.value * 12 }, { rotate: '8deg' }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.cardWrapper, { zIndex: 1 }, style2]}>
         <Svg width="200" height="260" viewBox="0 0 200 260">
           <Defs>
             <LinearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#ffffff" stopOpacity="1" />
                <Stop offset="1" stopColor="#f0fdf4" stopOpacity="1" />
             </LinearGradient>
           </Defs>
           <Rect x="0" y="0" width="200" height="260" rx="20" fill="url(#bg2)" stroke="#1ED760" strokeWidth="2" />
           <Rect x="20" y="30" width="60" height="60" rx="30" fill="#1ED760" opacity="0.2" />
           <Rect x="90" y="40" width="90" height="10" rx="5" fill="#1ED760" opacity="0.5" />
           <Rect x="90" y="60" width="60" height="10" rx="5" fill="#1ED760" opacity="0.3" />
           
           <Rect x="20" y="120" width="160" height="8" rx="4" fill="#d1fae5" />
           <Rect x="20" y="140" width="140" height="8" rx="4" fill="#d1fae5" />
           <Rect x="20" y="160" width="150" height="8" rx="4" fill="#d1fae5" />
         </Svg>
      </Animated.View>

      <Animated.View style={[styles.cardWrapper, { zIndex: 2, position: 'absolute' }, style1]}>
         <Svg width="220" height="280" viewBox="0 0 220 280">
           <Defs>
             <LinearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#041A0B" stopOpacity="1" />
                <Stop offset="1" stopColor="#064e3b" stopOpacity="1" />
             </LinearGradient>
           </Defs>
           <Rect x="0" y="0" width="220" height="280" rx="24" fill="url(#bg1)" stroke="#A8E63D" strokeWidth="1" />
           <SvgText x="110" y="60" fill="#A8E63D" fontSize="24" fontWeight="bold" textAnchor="middle">ID VAULT</SvgText>
           
           <Rect x="30" y="100" width="160" height="100" rx="12" fill="#1ED760" opacity="0.1" />
           
           {/* Abstract Face / ID icon */}
           <Circle cx="110" cy="140" r="20" fill="#1ED760" />
           <Path d="M70,190 C70,160 150,160 150,190" fill="#1ED760" />
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
  cardWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  }
});
