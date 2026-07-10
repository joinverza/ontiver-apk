import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { Fonts } from '@/constants/fonts';

const DIAL_SIZE = 300;
const CX = 150;
const CY = 150;
const OUTER_R = 130;
const RING_THICKNESS = 24;
const LEVEL_ANGLES = [320, 245, 150];

const AnimatedG = Animated.createAnimatedComponent(G);

function toRad(degrees: number) {
  return ((degrees - 90) * Math.PI) / 180;
}

function arc(startDeg: number, endDeg: number, radius: number, thickness: number) {
  const delta = (endDeg - startDeg + 360) % 360;
  const largeArc = delta > 180 ? 1 : 0;
  const innerRadius = radius - thickness;

  const x1 = CX + radius * Math.cos(toRad(startDeg));
  const y1 = CY + radius * Math.sin(toRad(startDeg));
  const x2 = CX + radius * Math.cos(toRad(endDeg));
  const y2 = CY + radius * Math.sin(toRad(endDeg));
  const x3 = CX + innerRadius * Math.cos(toRad(endDeg));
  const y3 = CY + innerRadius * Math.sin(toRad(endDeg));
  const x4 = CX + innerRadius * Math.cos(toRad(startDeg));
  const y4 = CY + innerRadius * Math.sin(toRad(startDeg));

  return [
    `M ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}

function tickPath(angle: number) {
  const x1 = CX + (OUTER_R - RING_THICKNESS - 2) * Math.cos(toRad(angle));
  const y1 = CY + (OUTER_R - RING_THICKNESS - 2) * Math.sin(toRad(angle));
  const x2 = CX + (OUTER_R + 2) * Math.cos(toRad(angle));
  const y2 = CY + (OUTER_R + 2) * Math.sin(toRad(angle));

  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

export function Slide3Visual() {
  const entranceScale = useSharedValue(0.78);
  const entranceOpacity = useSharedValue(0);
  const indicatorRotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const levelIndex = React.useRef(0);

  React.useEffect(() => {
    entranceScale.value = withSpring(1, { damping: 12, stiffness: 92 });
    entranceOpacity.value = withTiming(1, {
      duration: 520,
      easing: Easing.out(Easing.cubic),
    });

    indicatorRotation.value = withDelay(
      400,
      withSequence(
        withTiming(360, { duration: 1120, easing: Easing.inOut(Easing.cubic) }),
        withSpring(LEVEL_ANGLES[0], { damping: 13, stiffness: 120 })
      )
    );

    glowOpacity.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.2, { duration: 1600, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, []);

  const wrapperStyle = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ scale: entranceScale.value }],
  }));

  const indicatorProps = useAnimatedProps(() => ({
    rotation: indicatorRotation.value,
  }));

  const glowProps = useAnimatedProps(() => ({
    opacity: 0.25 + glowOpacity.value * 0.55,
    strokeWidth: 2 + glowOpacity.value * 2,
  }));

  const handlePress = React.useCallback(() => {
    levelIndex.current = (levelIndex.current + 1) % LEVEL_ANGLES.length;
    const nextAngle = LEVEL_ANGLES[levelIndex.current];

    indicatorRotation.value = withSequence(
      withTiming(indicatorRotation.value + 360, {
        duration: 700,
        easing: Easing.inOut(Easing.cubic),
      }),
      withSpring(nextAngle, { damping: 12, stiffness: 125 })
    );
  }, [indicatorRotation]);

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <Animated.View style={[wrapperStyle]}>
          <Svg width={DIAL_SIZE} height={DIAL_SIZE} viewBox="0 0 300 300">
            <Defs>
              <RadialGradient id="outerMetal" cx="38%" cy="27%" r="74%">
                <Stop offset="0%" stopColor="#B9B9B9" />
                <Stop offset="34%" stopColor="#696969" />
                <Stop offset="70%" stopColor="#202326" />
                <Stop offset="100%" stopColor="#08090B" />
              </RadialGradient>

              <LinearGradient id="outerSweep" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.36" />
                <Stop offset="42%" stopColor="#FFFFFF" stopOpacity="0.08" />
                <Stop offset="53%" stopColor="#000000" stopOpacity="0.06" />
                <Stop offset="100%" stopColor="#000000" stopOpacity="0.56" />
              </LinearGradient>

              <LinearGradient id="silverRing" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="22%" stopColor="#9DA3AA" />
                <Stop offset="50%" stopColor="#F4F7FB" />
                <Stop offset="75%" stopColor="#6B7280" />
                <Stop offset="100%" stopColor="#FFFFFF" />
              </LinearGradient>

              <RadialGradient id="centerKnob" cx="38%" cy="28%" r="75%">
                <Stop offset="0%" stopColor="#55585D" />
                <Stop offset="48%" stopColor="#27292C" />
                <Stop offset="100%" stopColor="#0A0B0D" />
              </RadialGradient>

              <LinearGradient id="arrowGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#60A5FA" />
                <Stop offset="100%" stopColor="#2563EB" />
              </LinearGradient>
            </Defs>

            <Circle cx={CX} cy={CY} r={OUTER_R + 9} fill="#101216" opacity="0.95" />
            <Circle cx={CX} cy={CY} r={OUTER_R + 5} fill="url(#outerMetal)" />
            <Circle cx={CX} cy={CY} r={OUTER_R + 5} fill="url(#outerSweep)" opacity="0.78" />
            <Circle cx={CX} cy={CY} r={OUTER_R + 8} fill="none" stroke="url(#silverRing)" strokeWidth="2" opacity="0.68" />

            <Path d="M 150 150 L 283 118 A 137 137 0 0 1 232 255 Z" fill="#020407" opacity="0.48" />
            <Path d="M 150 150 L 282 122 A 137 137 0 0 1 269 184 Z" fill="#FFFFFF" opacity="0.08" />

            <Path d={arc(306, 45, OUTER_R, RING_THICKNESS)} fill="#2F7D24" />
            <Path d={arc(306, 45, OUTER_R - 4, 5)} fill="#83C766" opacity="0.64" />

            <Path d={arc(205, 299, OUTER_R, RING_THICKNESS)} fill="#E89A18" />
            <Path d={arc(205, 299, OUTER_R - 4, 5)} fill="#FFC451" opacity="0.76" />

            <Path d={arc(132, 181, OUTER_R, RING_THICKNESS)} fill="#A81414" />
            <Path d={arc(132, 181, OUTER_R - 4, 5)} fill="#EF4444" opacity="0.7" />

            {[45, 132, 181, 205, 299, 306].map((angle) => (
              <Path key={angle} d={tickPath(angle)} stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" />
            ))}

            <Circle cx={CX} cy={CY} r={84} fill="#080A0D" opacity="0.84" />
            <Circle cx={CX} cy={CY} r={78} fill="url(#silverRing)" />
            <Circle cx={CX} cy={CY} r={72} fill="#14161A" />
            <AnimatedG animatedProps={glowProps}>
              <Circle cx={CX} cy={CY} r={76} fill="none" stroke="#2563EB" />
            </AnimatedG>
            <Circle cx={CX} cy={CY} r={62} fill="url(#centerKnob)" />
            <Circle cx={CX} cy={CY} r={62} fill="url(#outerSweep)" opacity="0.36" />
            <Circle cx={CX} cy={CY} r={62} fill="none" stroke="#4B5563" strokeWidth="1.4" opacity="0.68" />

            <Path
              d="M 111 111 C 130 99, 161 101, 180 119 C 154 113, 129 122, 113 147 C 108 133, 107 121, 111 111 Z"
              fill="#FFFFFF"
              opacity="0.12"
            />

            <AnimatedG animatedProps={indicatorProps} origin={`${CX}, ${CY}`}>
              <Polygon
                points={`${CX},${CY - 50} ${CX - 15},${CY - 4} ${CX + 15},${CY - 4}`}
                fill="url(#arrowGrad)"
                opacity="0.98"
              />
              <Circle cx={CX} cy={CY} r="7" fill="#1F2937" opacity="0.88" />
              <SvgText
                x={CX}
                y={CY + 29}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="16"
                fontWeight="800"
                fontFamily={Fonts.bold}
                letterSpacing="1.4"
                opacity="0.94"
              >
                TRUST
              </SvgText>
            </AnimatedG>

            <SvgText
              x={CX}
              y={CY - OUTER_R + 22}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="16"
              fontWeight="800"
              fontFamily={Fonts.extraBold}
            >
              HIGH
            </SvgText>

            <G transform={`rotate(-90, ${CX}, ${CY})`}>
              <SvgText
                x={CX}
                y={CY - OUTER_R + 22}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="15"
                fontWeight="800"
                fontFamily={Fonts.extraBold}
              >
                MEDIUM
              </SvgText>
            </G>

            <G transform={`rotate(180, ${CX}, ${CY})`}>
              <SvgText
                x={CX}
                y={CY - OUTER_R + 23}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="16"
                fontWeight="800"
                fontFamily={Fonts.extraBold}
              >
                LOW
              </SvgText>
            </G>
          </Svg>
        </Animated.View>
      </Pressable>
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
  pressable: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialShadow: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 18px 32px rgba(0, 0, 0, 0.28)',
  },
});
