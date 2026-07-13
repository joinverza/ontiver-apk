import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, interpolate, type SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import {
  FLOATING_TAB_BAR_HEIGHT,
  FLOATING_TAB_BAR_RADIUS,
  getFloatingTabBarBottomOffset,
} from '../../utils/responsive-spacing';

type TabIconType = 'home' | 'vault' | 'share' | 'privacy' | 'menu';

const TabBarIcon = ({
  focused,
  type,
  size,
}: {
  focused: boolean;
  type: TabIconType;
  size: number;
}) => {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused, progress]);

  if (type === 'share') {
    return <CenterPlusTab focused={focused} progress={progress} />;
  }

  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.54, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -5]) },
      { scale: interpolate(progress.value, [0, 1], [0.96, 1.08]) },
    ],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [2, 0]) },
      { scale: interpolate(progress.value, [0, 1], [0.2, 1]) },
    ],
  }));

  return (
    <View style={styles.tabIconShell}>
      <Animated.View style={iconStyle}>
        <CustomTabGlyph type={type} width={size} height={size} focused={focused} />
      </Animated.View>
      <Animated.View style={[styles.activeDot, dotStyle]} />
    </View>
  );
};

const CenterPlusTab = ({
  focused,
  progress,
}: {
  focused: boolean;
  progress: SharedValue<number>;
}) => {
  const centerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [-24, -30]) },
      { scale: interpolate(progress.value, [0, 1], [1, 1.08]) },
    ],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.22, 0.42]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.9, 1.15]) }],
  }));

  return (
    <View style={styles.centerTabShell}>
      <Animated.View style={[styles.centerHalo, haloStyle]} />
      <Animated.View style={[styles.centerPlusButton, centerStyle]}>
        <Svg width={31} height={31} viewBox="0 0 31 31" fill="none">
          <Path d="M15.5 6.2v18.6M6.2 15.5h18.6" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
        </Svg>
      </Animated.View>
      <View style={[styles.centerStatusDot, { opacity: focused ? 1 : 0 }]} />
    </View>
  );
};

const CustomTabGlyph = ({
  type,
  width = 24,
  height = 24,
  focused = false,
}: {
  type: TabIconType;
  width?: number;
  height?: number;
  focused?: boolean;
}) => {
  const color = focused ? Colors.primary : '#AAB3B6';

  if (type === 'home') {
    return (
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path d="M4.5 10.5 12 4l7.5 6.5v7.4c0 1.1-.9 2-2 2H6.5c-1.1 0-2-.9-2-2v-7.4Z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
        <Path d="M9.3 20v-6.2h5.4V20" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'vault') {
    return (
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="8" width="16" height="11.5" rx="3" stroke={color} strokeWidth="1.9" />
        <Path d="M8 8V6.8A4 4 0 0 1 12 3a4 4 0 0 1 4 3.8V8M12 12.2v3" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
        <Path d="M9.2 15.2h5.6" stroke={color} strokeWidth="1.9" strokeLinecap="round" opacity="0.55" />
      </Svg>
    );
  }

  if (type === 'share') {
    return (
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path d="M8.2 12.6 15.8 8.2M8.2 11.4l7.6 4.4" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
        <Rect x="4" y="9" width="4.8" height="4.8" rx="2.4" stroke={color} strokeWidth="1.9" />
        <Rect x="15.2" y="5.8" width="4.8" height="4.8" rx="2.4" stroke={color} strokeWidth="1.9" />
        <Rect x="15.2" y="13.4" width="4.8" height="4.8" rx="2.4" stroke={color} strokeWidth="1.9" />
      </Svg>
    );
  }

  if (type === 'privacy') {
    return (
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3.8 19 6.8v5.4c0 4.1-2.8 7.1-7 8.9-4.2-1.8-7-4.8-7-8.9V6.8l7-3Z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
        <Path d="M8.8 12.2 11 14.4l4.4-4.8" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4.5" width="6.5" height="6.5" rx="2" stroke={color} strokeWidth="1.9" />
      <Rect x="13.5" y="4.5" width="6.5" height="6.5" rx="2" stroke={color} strokeWidth="1.9" />
      <Path d="M5 15h14M5 19h9" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
};

export default function TabLayout() {
  const ds = useDesignSystem();
  const { bottom: bottomInset } = useSafeAreaInsets()
  const tabBarBottom = getFloatingTabBarBottomOffset(bottomInset);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondaryText,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: ds.space.lg,
          right: ds.space.lg,
          bottom: tabBarBottom,
          height: FLOATING_TAB_BAR_HEIGHT,
          backgroundColor: 'rgba(255,255,255,0.94)',
          borderRadius: FLOATING_TAB_BAR_RADIUS,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 13,
          paddingBottom: 14,
          paddingHorizontal: ds.space.sm,
          overflow: 'visible',
          boxShadow: '0 18px 38px rgba(5, 21, 14, 0.11)',
        },
        tabBarItemStyle: {
          height: 58,
          overflow: 'visible',
        },
        tabBarBackground: () => (
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: FLOATING_TAB_BAR_RADIUS, overflow: 'hidden' }]}>
            <BlurView intensity={48} tint="light" style={StyleSheet.absoluteFill} />
            <View style={styles.bottomRail} />
          </View>
        ),
        tabBarLabelStyle: {
          fontFamily: ds.typography.micro.fontFamily,
          fontSize: ds.typography.micro.fontSize,
          marginTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} type="home" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="vault"
        options={{
          title: 'Vault',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} type="vault" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: 'Share',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} type="share" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="privacy"
        options={{
          title: 'Privacy',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} type="privacy" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Menu',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} type="menu" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconShell: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    gap: 7,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  centerTabShell: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    overflow: 'visible',
  },
  centerHalo: {
    position: 'absolute',
    top: -31,
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(22, 101, 52, 0.15)',
  },
  centerPlusButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary,
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 14px 26px rgba(22, 101, 52, 0.25)',
  },
  centerStatusDot: {
    position: 'absolute',
    bottom: 1,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  bottomRail: {
    position: 'absolute',
    bottom: 13,
    alignSelf: 'center',
    width: 128,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(5, 21, 14, 0.12)',
  },
});
