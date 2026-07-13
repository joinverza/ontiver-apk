import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';

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

  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.68, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [2, -2]) },
      { scale: interpolate(progress.value, [0, 1], [0.94, 1.1]) },
    ],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    width: interpolate(progress.value, [0, 1], [8, 30]),
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', position: 'relative' }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: -5,
            height: 4,
            backgroundColor: '#0F1A24',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          },
          indicatorStyle,
        ]}
      />
      <Animated.View style={[{ marginTop: 8 }, iconStyle]}>
        <CustomTabGlyph type={type} width={size} height={size} focused={focused} />
      </Animated.View>
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
  const color = focused ? '#0F1A24' : '#6B7280';

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

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondaryText,
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: ds.space['7xl'] + bottomInset,
          paddingBottom: ds.space.sm,
        },
        tabBarBackground: () => (
          <BlurView intensity={1900} tint="light" style={StyleSheet.absoluteFill} />
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
