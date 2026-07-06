import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export function Slide1Visual() {
  const float = useSharedValue(0);

  React.useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value * -20 }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.svgWrapper, animatedStyle]}>
        <Svg width="400" height="400" viewBox="0 0 400 400">
          <Defs>
            <LinearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#d1fae5" stopOpacity="1" />
              <Stop offset="1" stopColor="#f0fdf4" stopOpacity="0.3" />
            </LinearGradient>
            <LinearGradient id="grad2" x1="1" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#a7f3d0" stopOpacity="1" />
              <Stop offset="1" stopColor="#dcfce7" stopOpacity="0.5" />
            </LinearGradient>
          </Defs>

          {/* Thick abstract M / Ribbon shape overlapping and bleeding off edge */}
          <Path 
            d="M 50,350 C 50,150 150,150 200,220 C 250,100 350,100 350,250 C 350,350 400,380 400,380" 
            fill="none" 
            stroke="url(#grad1)" 
            strokeWidth="90" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Inner ribbon fold to give depth */}
          <Path 
            d="M 120,400 C 120,250 250,250 300,350" 
            fill="none" 
            stroke="url(#grad2)" 
            strokeWidth="70" 
            strokeLinecap="round" 
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 350,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    // Push it off the right edge to mimic the reference image layout
    marginRight: -60,
    marginBottom: -20,
  },
  svgWrapper: {
    width: 400,
    height: 400,
  }
});
