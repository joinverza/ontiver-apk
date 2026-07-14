import { BlurView } from 'expo-blur';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Colors } from '../../constants/Colors';

const NAV_ACCENT = Colors.primary;
const NAV_ACCENT_DARK = '#0F4A27';
const NAV_ACCENT_SOFT = 'rgba(22,101,52,0.16)';
const NAV_ACCENT_BORDER = 'rgba(22,101,52,0.24)';
const NAV_ACCENT_SHADOW = 'rgba(22, 101, 52, 0)';
const INACTIVE_ICON = '#C8C8C8';
const TAB_BAR_SIDE_INSET = 16;
const TAB_BAR_INNER_PADDING = 10;
const TAB_SLOT_COUNT = 5;
const TAB_BAR_HEIGHT = 76;
const TAB_DOCK_TOP_PADDING = 0.1;
const CENTER_BUTTON_SIZE = 66;
const CENTER_BUTTON_DOCK_DROP = 10;
const ACTIVE_UNDERLINE_SLOT_WIDTH = 68;
const ACTIVE_UNDERLINE_WIDTH = 58;
const ACTIVE_UNDERLINE_POINT_WIDTH = 6;
const ACTIVE_TAB_SLOT_BY_ROUTE: Record<string, number> = {
  index: 0,
  vault: 1,
  share: 2,
  privacy: 3,
  settings: 4,
};

type TabIconType = 'home' | 'vault' | 'share' | 'privacy' | 'profile';
type ActionIconType = 'verify' | 'credential' | 'share';

type TabItemConfig = {
  routeName: string;
  icon: TabIconType;
  label: string;
};

const TAB_ITEMS: TabItemConfig[] = [
  { routeName: 'index', icon: 'home', label: 'Home' },
  { routeName: 'vault', icon: 'vault', label: 'Vault' },
  { routeName: 'privacy', icon: 'privacy', label: 'Privacy' },
  { routeName: 'settings', icon: 'profile', label: 'Profile' },
];

const MENU_ITEMS = [
  {
    key: 'verify',
    label: 'Verify',
    icon: 'verify' as const,
    angle: -140,
    radius: 80,
    route: '/(screens)/scan' as const,
  },
  {
    key: 'credential',
    label: 'Credential',
    icon: 'credential' as const,
    angle: -90,
    radius: 90,
    route: '/(screens)/add-credential' as const,
  },
  {
    key: 'share',
    label: 'Share',
    icon: 'share' as const,
    angle: -40,
    radius: 80,
    route: '/share' as const,
  },
];

function getArcPosition(angle: number, radius: number) {
  return {
    x: Math.cos((angle * Math.PI) / 180) * radius,
    y: Math.sin((angle * Math.PI) / 180) * radius,
  };
}

function CustomTabGlyph({ type, focused }: { type: TabIconType; focused: boolean }) {
  const color = focused ? NAV_ACCENT : INACTIVE_ICON;
  const strokeWidth = focused ? 2.5 : 2.1;

  if (type === 'home') {
  if (focused) {
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <Path d="M4.5 10.5 12 4l7.5 6.5v7.4c0 1.1-.9 2-2 2H6.5c-1.1 0-2-.9-2-2v-7.4Z" fill={NAV_ACCENT} />
          <Path d="M9.2 17.6h5.6" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" opacity="0.9" />
        </Svg>
      );
    }

    return (
      <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
        <Path d="M4.5 10.5 12 4l7.5 6.5v7.4c0 1.1-.9 2-2 2H6.5c-1.1 0-2-.9-2-2v-7.4Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
        <Path d="M9.3 20v-6.2h5.4V20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'vault') {
    if (focused) {
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <Path d="M12 3.6 19.2 6.6v5.7c0 4.2-2.8 7.2-7.2 8.9-4.4-1.7-7.2-4.7-7.2-8.9V6.6L12 3.6Z" fill={NAV_ACCENT} />
          <Rect x="8.1" y="11" width="7.8" height="5.5" rx="1.5" fill="#FFFFFF" />
          <Path d="M9.8 11V9.7A2.2 2.2 0 0 1 12 7.5a2.2 2.2 0 0 1 2.2 2.2V11" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <Circle cx="12" cy="13.7" r="0.8" fill={NAV_ACCENT} />
        </Svg>
      );
    }

    return (
      <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3.8 19 6.8v5.4c0 4.1-2.8 7.1-7 8.9-4.2-1.8-7-4.8-7-8.9V6.8l7-3Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
        <Rect x="8.5" y="11" width="7" height="5.1" rx="1.4" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M10 11V9.8A2 2 0 0 1 12 7.8a2 2 0 0 1 2 2V11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'share') {
    if (focused) {
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="16" height="16" rx="4" fill={NAV_ACCENT} />
          <Rect x="7" y="7" width="3.5" height="3.5" rx="0.8" fill="#FFFFFF" />
          <Rect x="13.5" y="7" width="3.5" height="3.5" rx="0.8" fill="#FFFFFF" />
          <Rect x="7" y="13.5" width="3.5" height="3.5" rx="0.8" fill="#FFFFFF" />
          <Path d="M13.8 14h3M14 17h2.6M17 13.6v3.2" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" />
        </Svg>
      );
    }

    return (
      <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="4" width="16" height="16" rx="4" stroke={color} strokeWidth={strokeWidth} />
        <Rect x="7.2" y="7.2" width="3.2" height="3.2" rx="0.7" stroke={color} strokeWidth="1.8" />
        <Rect x="13.6" y="7.2" width="3.2" height="3.2" rx="0.7" stroke={color} strokeWidth="1.8" />
        <Rect x="7.2" y="13.6" width="3.2" height="3.2" rx="0.7" stroke={color} strokeWidth="1.8" />
        <Path d="M13.8 14h3M14 17h2.8M17 13.7v3.1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'privacy') {
    if (focused) {
      return (
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <Path d="M12 3.4 19.2 6.5v5.8c0 4.1-2.8 7.2-7.2 8.9-4.4-1.7-7.2-4.8-7.2-8.9V6.5L12 3.4Z" fill={NAV_ACCENT} />
          <Path d="M7.9 12.2c1.1-1.9 2.5-2.8 4.1-2.8s3 .9 4.1 2.8c-1.1 1.9-2.5 2.8-4.1 2.8s-3-.9-4.1-2.8Z" fill="#FFFFFF" opacity="0.95" />
          <Circle cx="12" cy="12.2" r="1.35" fill={NAV_ACCENT} />
          <Path d="M12 7.4v-1M12 18.2v-1" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
        </Svg>
      );
    }

    return (
      <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3.6 19 6.7v5.5c0 4.1-2.7 7.1-7 8.8-4.3-1.7-7-4.7-7-8.8V6.7l7-3.1Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
        <Path d="M7.8 12.1c1.1-1.8 2.5-2.7 4.2-2.7s3.1.9 4.2 2.7c-1.1 1.8-2.5 2.7-4.2 2.7s-3.1-.9-4.2-2.7Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        <Circle cx="12" cy="12.1" r="1.25" stroke={color} strokeWidth="1.7" />
      </Svg>
    );
  }

  if (focused) {
    return (
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8.2" r="4.2" fill={NAV_ACCENT} />
        <Path d="M4.8 20c1.2-4.5 13.2-4.5 14.4 0" fill={NAV_ACCENT} />
        <Circle cx="10.5" cy="7.8" r="0.7" fill="#FFFFFF" opacity="0.9" />
        <Circle cx="13.5" cy="7.8" r="0.7" fill="#FFFFFF" opacity="0.9" />
        <Path d="M9.8 12.8c1.1.8 3.3.8 4.4 0" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      </Svg>
    );
  }

  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8.2" r="4.2" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M4.8 20c1.2-4.5 13.2-4.5 14.4 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

function ActionGlyph({ type }: { type: ActionIconType }) {
  if (type === 'share') {
    return (
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Path d="M8.8 11.2 15.4 7.6M8.8 12.8l6.6 3.6" stroke={NAV_ACCENT} strokeWidth="2" strokeLinecap="round" />
        <Circle cx="6.4" cy="12" r="3" stroke={NAV_ACCENT} strokeWidth="2" />
        <Circle cx="17.6" cy="6.4" r="3" stroke={NAV_ACCENT} strokeWidth="2" />
        <Circle cx="17.6" cy="17.6" r="3" stroke={NAV_ACCENT} strokeWidth="2" />
      </Svg>
    );
  }

  if (type === 'credential') {
    return (
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Rect x="3.8" y="5" width="14.8" height="13.4" rx="3" stroke={NAV_ACCENT} strokeWidth="1.9" />
        <Circle cx="8.7" cy="10.5" r="2" stroke={NAV_ACCENT} strokeWidth="1.7" />
        <Path d="M6.1 15.3c.8-1.8 4.4-1.8 5.2 0" stroke={NAV_ACCENT} strokeWidth="1.7" strokeLinecap="round" />
        <Path d="M13.5 9.2h2.5M13.5 12.4h2.1" stroke={NAV_ACCENT} strokeWidth="1.7" strokeLinecap="round" opacity="0.8" />
        <Circle cx="18" cy="17.6" r="3.4" fill="#FFFFFF" stroke={NAV_ACCENT} strokeWidth="1.7" />
        <Path d="M18 15.9v3.4M16.3 17.6h3.4" stroke={NAV_ACCENT} strokeWidth="1.7" strokeLinecap="round" />
      </Svg>
    );
  }

  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M7.5 4.5H5.8c-.8 0-1.3.5-1.3 1.3v1.7M16.5 4.5h1.7c.8 0 1.3.5 1.3 1.3v1.7M7.5 19.5H5.8c-.8 0-1.3-.5-1.3-1.3v-1.7M16.5 19.5h1.7c.8 0 1.3-.5 1.3-1.3v-1.7" stroke={NAV_ACCENT} strokeWidth="1.8" strokeLinecap="round" />
      <Rect x="7.4" y="7.4" width="3.2" height="3.2" rx="0.8" fill={NAV_ACCENT} opacity="0.9" />
      <Rect x="13.4" y="7.4" width="3.2" height="3.2" rx="0.8" fill={NAV_ACCENT} opacity="0.9" />
      <Rect x="7.4" y="13.4" width="3.2" height="3.2" rx="0.8" fill={NAV_ACCENT} opacity="0.9" />
      <Path d="M13.2 15.1 14.5 16.4 17.2 12.9" stroke={NAV_ACCENT} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TabItem({
  item,
  focused,
  onPress,
}: {
  item: TabItemConfig;
  focused: boolean;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const focusedAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(focusedAnim, {
      toValue: focused ? 1 : 0,
      tension: focused ? 160 : 180,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [focused, focusedAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 160,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const iconTranslateY = focusedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });
  const iconScale = focusedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.14],
  });
  const dotScale = focusedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 1],
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabPressable}
    >
      <Animated.View style={[styles.tabItem, { transform: [{ scale: scaleAnim }] }]}>
        <Animated.View
          style={[
            styles.iconMotion,
            {
              transform: [
                { translateY: iconTranslateY },
                { scale: iconScale },
              ],
            },
          ]}
        >
          <CustomTabGlyph type={item.icon} focused={focused} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

function OntiverTabBar({ state, navigation }: { state: any; navigation: any }) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const tabBarBottom = bottom;
  const [isOpen, setIsOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const focusedRouteName = state.routes[state.index]?.name;
  const activeSlot = ACTIVE_TAB_SLOT_BY_ROUTE[focusedRouteName] ?? 0;

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const glowScaleAnim = useRef(new Animated.Value(1)).current;
  const glowOpacityAnim = useRef(new Animated.Value(0.18)).current;
  const activeSlotAnim = useRef(new Animated.Value(activeSlot)).current;
  const activeUnderlineWidthAnim = useRef(new Animated.Value(ACTIVE_UNDERLINE_POINT_WIDTH)).current;
  const dockEntranceAnim = useRef(new Animated.Value(0)).current;
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glowLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const menuAnimations = useRef(
    MENU_ITEMS.map(() => ({
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      labelOpacity: new Animated.Value(0),
    })),
  ).current;

  const centerButtonBottom = tabBarBottom + TAB_BAR_HEIGHT - (CENTER_BUTTON_SIZE / 2) - CENTER_BUTTON_DOCK_DROP;
  const centerButtonCenterBottom = centerButtonBottom + (CENTER_BUTTON_SIZE / 2);
  const anchorBottom = centerButtonCenterBottom;
  const tabBarContentWidth = Math.max(
    screenWidth - (TAB_BAR_SIDE_INSET * 2) - (TAB_BAR_INNER_PADDING * 2),
    0,
  );
  const tabSlotWidth = tabBarContentWidth / TAB_SLOT_COUNT;
  const activeUnderlineOutputRange = useMemo(
    () =>
      [0, 1, 2, 3, 4].map(
        (slot) =>
          TAB_BAR_SIDE_INSET +
          TAB_BAR_INNER_PADDING +
          slot * tabSlotWidth +
          (tabSlotWidth - ACTIVE_UNDERLINE_SLOT_WIDTH) / 2,
      ),
    [tabSlotWidth],
  );
  const activeUnderlineTranslateX = activeSlotAnim.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: activeUnderlineOutputRange,
    extrapolate: 'clamp',
  });
  const dockEntranceTranslateY = dockEntranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [tabBarBottom + TAB_BAR_HEIGHT + TAB_DOCK_TOP_PADDING + CENTER_BUTTON_SIZE, 0],
  });
  const dockEntranceOpacity = dockEntranceAnim.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 0.92, 1],
  });

  useEffect(() => {
    dockEntranceAnim.setValue(0);
    const entrance = Animated.timing(dockEntranceAnim, {
      toValue: 1,
      duration: 680,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    entrance.start();

    return () => {
      entrance.stop();
    };
  }, [dockEntranceAnim]);

  useEffect(() => {
    activeUnderlineWidthAnim.stopAnimation();
    activeUnderlineWidthAnim.setValue(ACTIVE_UNDERLINE_POINT_WIDTH);

    Animated.parallel([
      Animated.timing(activeSlotAnim, {
        toValue: activeSlot,
        duration: 460,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(190),
        Animated.timing(activeUnderlineWidthAnim, {
          toValue: ACTIVE_UNDERLINE_WIDTH,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [activeSlot, activeSlotAnim, activeUnderlineWidthAnim]);

  useEffect(() => {
    if (isOpen) {
      glowLoopRef.current?.stop();
      Animated.parallel([
        Animated.timing(glowScaleAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacityAnim, {
          toValue: 0,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    glowLoopRef.current = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(glowScaleAnim, {
            toValue: 1.18,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowScaleAnim, {
            toValue: 1,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowOpacityAnim, {
            toValue: 0.28,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacityAnim, {
            toValue: 0.18,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    glowLoopRef.current.start();

    return () => {
      glowLoopRef.current?.stop();
    };
  }, [glowOpacityAnim, glowScaleAnim, isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      glowLoopRef.current?.stop();
    };
  }, []);

  const animateOpen = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setMenuVisible(true);
    setIsOpen(true);

    Animated.parallel([
      Animated.spring(rotateAnim, {
        toValue: 1,
        tension: 180,
        friction: 12,
        useNativeDriver: false,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    MENU_ITEMS.forEach((item, index) => {
      const { x, y } = getArcPosition(item.angle, item.radius);
      const anim = menuAnimations[index];

      anim.translateX.setValue(-x);
      anim.translateY.setValue(-y);
      anim.scale.setValue(0);
      anim.opacity.setValue(0);
      anim.labelOpacity.setValue(0);

      Animated.sequence([
        Animated.delay(index * 55),
        Animated.parallel([
          Animated.spring(anim.scale, {
            toValue: 1,
            tension: 200,
            friction: 12,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 180,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateX, {
            toValue: 0,
            tension: 160,
            friction: 11,
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateY, {
            toValue: 0,
            tension: 160,
            friction: 11,
            useNativeDriver: true,
          }),
          Animated.timing(anim.labelOpacity, {
            toValue: 1,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  };

  const animateClose = () => {
    setIsOpen(false);

    Animated.parallel([
      Animated.spring(rotateAnim, {
        toValue: 0,
        tension: 180,
        friction: 12,
        useNativeDriver: false,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    MENU_ITEMS.slice().reverse().forEach((item, reverseIndex) => {
      const originalIndex = MENU_ITEMS.findIndex((menuItem) => menuItem.key === item.key);
      const anim = menuAnimations[originalIndex];
      const { x, y } = getArcPosition(item.angle, item.radius);

      Animated.sequence([
        Animated.delay(reverseIndex * 40),
        Animated.parallel([
          Animated.spring(anim.scale, {
            toValue: 0,
            tension: 240,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 140,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(anim.labelOpacity, {
            toValue: 0,
            duration: 90,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateX, {
            toValue: -x,
            tension: 240,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateY, {
            toValue: -y,
            tension: 240,
            friction: 10,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });

    closeTimerRef.current = setTimeout(() => {
      setMenuVisible(false);
    }, 280);
  };

  const toggleMenu = () => {
    if (isOpen) {
      animateClose();
    } else {
      animateOpen();
    }
  };

  const handleMenuItemPress = (route: (typeof MENU_ITEMS)[number]['route']) => {
    animateClose();
    setTimeout(() => {
      router.push(route);
    }, 160);
  };

  const handleTabPress = (routeName: string) => {
    if (isOpen) {
      animateClose();
    }

    const route = state.routes.find((item: any) => item.name === routeName);
    if (!route) return;

    const isFocused = focusedRouteName === routeName;
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  });

  const centerButtonBg = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [NAV_ACCENT, NAV_ACCENT_DARK],
  });

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {menuVisible && (
        <TouchableWithoutFeedback onPress={animateClose}>
          <Animated.View
            pointerEvents={isOpen ? 'auto' : 'none'}
            style={[
              styles.overlay,
              {
                opacity: overlayAnim,
              },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      <View pointerEvents="box-none" style={[styles.menuLayer, { bottom: anchorBottom - 24 }]}>
        {MENU_ITEMS.map((item, index) => {
          const anim = menuAnimations[index];
          const { x, y } = getArcPosition(item.angle, item.radius);

          return (
            <Animated.View
              key={item.key}
              pointerEvents={isOpen ? 'auto' : 'none'}
              style={[
                styles.subMenuItemWrap,
                {
                  opacity: anim.opacity,
                  transform: [
                    { translateX: x },
                    { translateY: y },
                  ],
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.label}
                hitSlop={10}
                onPress={() => handleMenuItemPress(item.route)}
                style={styles.subMenuPressable}
              >
                <Animated.View
                  style={[
                    styles.subMenuVisual,
                    {
                      transform: [
                        { translateX: anim.translateX },
                        { translateY: anim.translateY },
                        { scale: anim.scale },
                      ],
                    },
                  ]}
                >
                  <View style={styles.subMenuGlow} />
                  <View style={styles.subMenuButton}>
                    <ActionGlyph type={item.icon} />
                  </View>
                  <Animated.Text pointerEvents="none" style={[styles.subMenuLabel, { opacity: anim.labelOpacity }]}>
                    {item.label}
                  </Animated.Text>
                </Animated.View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.bottomDockWrap,
          {
            height: tabBarBottom + TAB_BAR_HEIGHT + TAB_DOCK_TOP_PADDING,
            opacity: dockEntranceOpacity,
            transform: [{ translateY: dockEntranceTranslateY }],
          },
        ]}
      >
        <View style={[styles.tabBar, { bottom: tabBarBottom }]}>
          <BlurView intensity={48} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.tabBarOverlay} />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeUnderlineSlot,
              {
                transform: [{ translateX: activeUnderlineTranslateX }],
              },
            ]}
          >
            <Animated.View style={[styles.activeUnderline, { width: activeUnderlineWidthAnim }]} />
          </Animated.View>
          <TabItem
            item={TAB_ITEMS[0]}
            focused={focusedRouteName === TAB_ITEMS[0].routeName}
            onPress={() => handleTabPress(TAB_ITEMS[0].routeName)}
          />
          <TabItem
            item={TAB_ITEMS[1]}
            focused={focusedRouteName === TAB_ITEMS[1].routeName}
            onPress={() => handleTabPress(TAB_ITEMS[1].routeName)}
          />
          <View style={styles.centerSlot} />
          <TabItem
            item={TAB_ITEMS[2]}
            focused={focusedRouteName === TAB_ITEMS[2].routeName}
            onPress={() => handleTabPress(TAB_ITEMS[2].routeName)}
          />
          <TabItem
            item={TAB_ITEMS[3]}
            focused={focusedRouteName === TAB_ITEMS[3].routeName}
            onPress={() => handleTabPress(TAB_ITEMS[3].routeName)}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open quick actions"
          onPress={toggleMenu}
          style={[styles.centerButtonHit, { bottom: centerButtonBottom }]}
        >
          <Animated.View style={[styles.centerButton, { backgroundColor: centerButtonBg }]}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Svg width={31} height={31} viewBox="0 0 27 27" fill="none">
                <Path d="M13.5 5.4v16.2M5.4 13.5h16.2" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </Svg>
            </Animated.View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <OntiverTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        animation: 'none',
        lazy: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="vault" options={{ title: 'Vault' }} />
      <Tabs.Screen name="share" options={{ href: null, title: 'Share' }} />
      <Tabs.Screen name="privacy" options={{ title: 'Privacy' }} />
      <Tabs.Screen name="settings" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
    zIndex: 1,
  },
  menuLayer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -130,
    width: 260,
    height: 190,
    zIndex: 3,
  },
  subMenuItemWrap: {
    position: 'absolute',
    left: 92,
    top: 124,
    width: 76,
    height: 92,
    alignItems: 'center',
  },
  subMenuPressable: {
    width: 76,
    height: 92,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  subMenuVisual: {
    width: 86,
    height: 98,
    alignItems: 'center',
  },
  subMenuGlow: {
    position: 'absolute',
    top: -1.0,
    left: 12,
    width: 62,
    height: 62,
    borderRadius: 30,
    backgroundColor: NAV_ACCENT_SOFT,
  },
  subMenuButton: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: NAV_ACCENT_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 22px rgba(5, 21, 14, 0.1)',
  },
  subMenuLabel: {
    marginTop: 4,
    color: NAV_ACCENT,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  bottomDockWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    zIndex: 4,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: TAB_BAR_SIDE_INSET + TAB_BAR_INNER_PADDING,
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  activeUnderlineSlot: {
    position: 'absolute',
    left: 0,
    bottom: 19,
    width: ACTIVE_UNDERLINE_SLOT_WIDTH,
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeUnderline: {
    height: 5,
    borderRadius: 3,
    backgroundColor: NAV_ACCENT,
  },
  bottomRail: {
    position: 'absolute',
    left: '50%',
    bottom: 7,
    width: 124,
    height: 5,
    marginLeft: -62,
    borderRadius: 3,
    backgroundColor: '#DADDE0',
  },
  tabPressable: {
    flex: 1,
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  iconMotion: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    backgroundColor: NAV_ACCENT,
  },
  centerSlot: {
    flex: 1,
    height: TAB_BAR_HEIGHT,
  },
  centerGlow: {
    position: 'absolute',
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: NAV_ACCENT_SOFT,
    zIndex: 5,
  },
  centerButtonHit: {
    position: 'absolute',
    alignSelf: 'center',
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    zIndex: 6,
  },
  centerButton: {
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    borderWidth: 8,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 12px 24px ${NAV_ACCENT_SHADOW}`,
  },
});
