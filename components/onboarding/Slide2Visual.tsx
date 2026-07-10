import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withDelay,
  Easing,
  interpolate,
  SharedValue
} from 'react-native-reanimated';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';

const CARD_W = 340;
const CARD_H = 188;
const R = 28;
const STEP = 90;

function cardPath(w: number, h: number, r: number) {
  const dipDepth = 16;
  const dipTopWidth = 140;
  const dipBottomWidth = 60;
  
  const center = w / 2;
  const dipStart = center - (dipTopWidth / 2);
  const dipBottomLeft = center - (dipBottomWidth / 2);
  const dipBottomRight = center + (dipBottomWidth / 2);
  const dipEnd = center + (dipTopWidth / 2);

  const cpOffset = 24; // Control point offset for smooth curves

  return `
    M ${r} 0
    L ${dipStart} 0
    C ${dipStart + cpOffset} 0, ${dipBottomLeft - cpOffset} ${dipDepth}, ${dipBottomLeft} ${dipDepth}
    L ${dipBottomRight} ${dipDepth}
    C ${dipBottomRight + cpOffset} ${dipDepth}, ${dipEnd - cpOffset} 0, ${dipEnd} 0
    L ${w - r} 0
    A ${r} ${r} 0 0 1 ${w} ${r}
    L ${w} ${h - r}
    A ${r} ${r} 0 0 1 ${w - r} ${h}
    L ${r} ${h}
    A ${r} ${r} 0 0 1 0 ${h - r}
    L 0 ${r}
    A ${r} ${r} 0 0 1 ${r} 0
    Z
  `.trim();
}

const pathD = cardPath(CARD_W, CARD_H, R);

export function Slide2Visual() {
  // We want the front card (slot 2) to be on the bottom of the screen (highest Y).
  // Slot 0 (top of screen, lowest Y) will be in the back (zIndex 1).
  // Slot 1 (middle of screen) will be in the middle (zIndex 2).
  // Slot 2 (bottom of screen) will be in the front (zIndex 3).
  
  // Start state: C1 is front (slot 2), C2 is middle (slot 1), C3 is back (slot 0)
  const c1Slot = useSharedValue(2); 
  const c2Slot = useSharedValue(1);
  const c3Slot = useSharedValue(0);
  
  const c1ZIndex = useSharedValue(3);
  const c2ZIndex = useSharedValue(2);
  const c3ZIndex = useSharedValue(1);

  const c1Mounted = useSharedValue(0);
  const c2Mounted = useSharedValue(0);
  const c3Mounted = useSharedValue(0);
  const pressScale = useSharedValue(1);

  React.useEffect(() => {
    c3Mounted.value = withDelay(400, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));
    c2Mounted.value = withDelay(600, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));
    c1Mounted.value = withDelay(800, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));
  }, []);

  const handlePressIn = () => {
    pressScale.value = withTiming(1.04, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  const handlePressOut = () => {
    pressScale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.5)) });
  };

  const stackStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }]
  }));

  const shuffle = () => {
    const move = (slotSv: SharedValue<number>, zIndexSv: SharedValue<number>) => {
      const current = Math.round(slotSv.value);
      if (current === 2) {
        // Front moving to back
        zIndexSv.value = 1;
        slotSv.value = withTiming(0, { duration: 600, easing: Easing.bezier(0.22, 0.9, 0.32, 1.15) });
      } else if (current === 1) {
        // Middle moving to front
        zIndexSv.value = 3;
        slotSv.value = withTiming(2, { duration: 600, easing: Easing.bezier(0.22, 0.9, 0.32, 1.15) });
      } else if (current === 0) {
        // Back moving to middle
        zIndexSv.value = 2;
        slotSv.value = withTiming(1, { duration: 600, easing: Easing.bezier(0.22, 0.9, 0.32, 1.15) });
      }
    };
    move(c1Slot, c1ZIndex);
    move(c2Slot, c2ZIndex);
    move(c3Slot, c3ZIndex);
  };

  const getStyle = (slotSv: SharedValue<number>, zIndexSv: SharedValue<number>, mountedSv: SharedValue<number>) => useAnimatedStyle(() => {
    const current = slotSv.value;
    
    // Flourish animation when moving from front (2) to back (0)
    const isGoingToBack = current < 1.9 && current > 0.1 && zIndexSv.value === 1;
    const sineVal = Math.sin((current / 2) * Math.PI);
    const flourishY = isGoingToBack ? sineVal * -25 : 0; 
    
    // Cards get physically smaller as they go back, giving depth and different widths
    const depthScale = interpolate(current, [0, 1, 2], [0.84, 0.92, 1]);
    const flourishScale = isGoingToBack ? 1 - sineVal * 0.05 : 1;
    
    const flourishRotate = isGoingToBack ? sineVal * -3 : 0;
    
    const targetY = current * STEP;
    const initialY = 300 + current * 40;
    const animatedY = interpolate(mountedSv.value, [0, 1], [initialY, targetY]);
    const initialRotate = interpolate(mountedSv.value, [0, 1], [(current - 1) * 8, 0]);

    return {
      top: animatedY,
      zIndex: zIndexSv.value,
      opacity: interpolate(mountedSv.value, [0, 0.5, 1], [0, 1, 1]),
      transform: [
        { translateY: flourishY },
        { scale: depthScale * flourishScale },
        { rotate: `${flourishRotate + initialRotate}deg` }
      ]
    };
  });

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.stack} 
        onPress={shuffle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[StyleSheet.absoluteFill, stackStyle]}>
          
          {/* Card 3: Back -> Indigo (Academic Diploma) */}
        <Animated.View style={[styles.card, getStyle(c3Slot, c3ZIndex, c3Mounted)]}>
          <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${CARD_W} ${CARD_H}`}>
            <Path d={pathD} fill="#3801E5" />
          </Svg>
          <View style={[styles.badge, { backgroundColor: '#ffffff' }]}>
              <Svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <Rect x="4" y="2" width="16" height="20" rx="2" stroke="#3801E5" />
                <Path d="M9 22v-4h6v4" stroke="#3801E5" />
                <Path d="M8 6h.01 M16 6h.01 M8 10h.01 M16 10h.01 M8 14h.01 M16 14h.01" stroke="#3801E5" strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>
            <View style={styles.content}>
              <Text style={[styles.value, { color: 'rgba(255, 255, 255, 1)' }]}>Passport</Text>
              <Text style={[styles.label, { color: 'rgba(255, 255, 255, 0.8)' }]}>International Passport</Text>
            </View>
          </Animated.View>

          {/* Card 2: Middle -> Lime (Health Record) */}
        <Animated.View style={[styles.card, getStyle(c2Slot, c2ZIndex, c2Mounted)]}>
          <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${CARD_W} ${CARD_H}`}>
            <Path d={pathD} fill="#00ff40" />
          </Svg>
          <View style={[styles.badge, { backgroundColor: '#ffffff' }]}>
              <Svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#8a9c00" />
                <Path d="M9 12l2 2 4-4" stroke="#8a9c00" />
              </Svg>
            </View>
            <View style={styles.content}>
              <Text style={[styles.value, { color: 'rgba(22, 26, 6, 1)' }]}>BVN</Text>
              <Text style={[styles.label, { color: 'rgba(22, 26, 6, 0.7)' }]}>Bank Verification</Text>
            </View>
          </Animated.View>

          {/* Card 1: Front -> Dark (Digital Identity) */}
        <Animated.View style={[styles.card, getStyle(c1Slot, c1ZIndex, c1Mounted)]}>
          <MaskedView
            style={StyleSheet.absoluteFill}
            maskElement={
              <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${CARD_W} ${CARD_H}`}>
                <Path d={pathD} fill="black" />
              </Svg>
            }
          >
            <BlurView intensity={1000} tint="dark" style={StyleSheet.absoluteFill} />
          </MaskedView>
          <BlurView intensity={10} tint="light" style={[styles.badge, { overflow: 'hidden' }]}>
              <Svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <Rect x="2" y="4" width="20" height="16" rx="2" stroke="#ffffff" />
                <Circle cx="8" cy="11" r="3" stroke="#ffffff" />
                <Path d="M14 10h4 M14 14h4" stroke="#ffffff" />
                <Path d="M4 18c0-2.5 8-2.5 8 0" stroke="#ffffff" />
              </Svg>
            </BlurView>
            <View style={styles.content}>
              <Text style={[styles.value, { color: 'rgba(255, 255, 255, 1)' }]}>NIN</Text>
              <Text style={[styles.label, { color: 'rgba(255, 255, 255, 0.7)' }]}>National Identification</Text>
            </View>
          </Animated.View>

        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 420,
  },
  stack: {
    width: CARD_W,
    height: CARD_H + (STEP * 2),
  },
  card: {
    position: 'absolute',
    left: 0,
    width: CARD_W,
    height: CARD_H,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 26,
    elevation: 10,
  },
  badge: {
    position: 'absolute',
    top: 32,
    right: 22,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 24,
    paddingTop: 32,
  },
  value: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1.5,
    marginBottom: 4,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  hint: {
    marginTop: 24,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#8a8272',
  }
});
