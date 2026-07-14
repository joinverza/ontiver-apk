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
const NAV_ACCENT_SHADOW = 'rgba(22,101,52,0.28)';
const INACTIVE_ICON = '#C8C8C8';
const TAB_BAR_SIDE_INSET = 16;
const TAB_BAR_INNER_PADDING = 10;
const TAB_SLOT_COUNT = 5;
const TAB_BAR_HEIGHT = 76;
const TAB_DOCK_TOP_PADDING = 36;
const CENTER_BUTTON_SIZE = 66;
const ACTIVE_UNDERLINE_SLOT_WIDTH = 68;
const ACTIVE_UNDERLINE_WIDTH = 58;
const ACTIVE_UNDERLINE_POINT_WIDTH = 6;
const ACTIVE_TAB_SLOT_BY_ROUTE: Record<string, number> = {
  index: 0,
  vault: 1,
  share: 3,
  settings: 4,
};

type TabIconType = 'home' | 'vault' | 'share' | 'profile';
type ActionIconType = 'verify' | 'credential' | 'proof';

type TabItemConfig = {
  routeName: string;
  icon: TabIconType;
  label: string;
};

const TAB_ITEMS: TabItemConfig[] = [
  { routeName: 'index', icon: 'home', label: 'Home' },
  { routeName: 'vault', icon: 'vault', label: 'Vault' },
  { routeName: 'share', icon: 'share', label: 'Share' },
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
    key: 'proof',
    label: 'Share',
    icon: 'proof' as const,
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
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M4.5 10.5 12 4l7.5 6.5v7.4c0 1.1-.9 2-2 2H6.5c-1.1 0-2-.9-2-2v-7.4Z" fill={NAV_ACCENT} />
          <Path d="M9.2 17.6h5.6" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" opacity="0.9" />
        </Svg>
      );
    }

    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M4.5 10.5 12 4l7.5 6.5v7.4c0 1.1-.9 2-2 2H6.5c-1.1 0-2-.9-2-2v-7.4Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
        <Path d="M9.3 20v-6.2h5.4V20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'vault') {
    if (focused) {
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M12 3.6 19.2 6.6v5.7c0 4.2-2.8 7.2-7.2 8.9-4.4-1.7-7.2-4.7-7.2-8.9V6.6L12 3.6Z" fill={NAV_ACCENT} />
          <Rect x="8.1" y="11" width="7.8" height="5.5" rx="1.5" fill="#FFFFFF" />
          <Path d="M9.8 11V9.7A2.2 2.2 0 0 1 12 7.5a2.2 2.2 0 0 1 2.2 2.2V11" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <Circle cx="12" cy="13.7" r="0.8" fill={NAV_ACCENT} />
        </Svg>
      );
    }

    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3.8 19 6.8v5.4c0 4.1-2.8 7.1-7 8.9-4.2-1.8-7-4.8-7-8.9V6.8l7-3Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
        <Rect x="8.5" y="11" width="7" height="5.1" rx="1.4" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M10 11V9.8A2 2 0 0 1 12 7.8a2 2 0 0 1 2 2V11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'share') {
    if (focused) {
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="16" height="16" rx="4" fill={NAV_ACCENT} />
          <Rect x="7" y="7" width="3.5" height="3.5" rx="0.8" fill="#FFFFFF" />
          <Rect x="13.5" y="7" width="3.5" height="3.5" rx="0.8" fill="#FFFFFF" />
          <Rect x="7" y="13.5" width="3.5" height="3.5" rx="0.8" fill="#FFFFFF" />
          <Path d="M13.8 14h3M14 17h2.6M17 13.6v3.2" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" />
        </Svg>
      );
    }

    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="4" width="16" height="16" rx="4" stroke={color} strokeWidth={strokeWidth} />
        <Rect x="7.2" y="7.2" width="3.2" height="3.2" rx="0.7" stroke={color} strokeWidth="1.8" />
        <Rect x="13.6" y="7.2" width="3.2" height="3.2" rx="0.7" stroke={color} strokeWidth="1.8" />
        <Rect x="7.2" y="13.6" width="3.2" height="3.2" rx="0.7" stroke={color} strokeWidth="1.8" />
        <Path d="M13.8 14h3M14 17h2.8M17 13.7v3.1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    );
  }

  if (focused) {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8.2" r="4.2" fill={NAV_ACCENT} />
        <Path d="M4.8 20c1.2-4.5 13.2-4.5 14.4 0" fill={NAV_ACCENT} />
        <Circle cx="10.5" cy="7.8" r="0.7" fill="#FFFFFF" opacity="0.9" />
        <Circle cx="13.5" cy="7.8" r="0.7" fill="#FFFFFF" opacity="0.9" />
        <Path d="M9.8 12.8c1.1.8 3.3.8 4.4 0" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      </Svg>
    );
  }

  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8.2" r="4.2" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M4.8 20c1.2-4.5 13.2-4.5 14.4 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

function ActionGlyph({ type }: { type: ActionIconType }) {
  if (type === 'credential') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Rect x="5" y="3.5" width="14" height="17" rx="3" stroke={NAV_ACCENT} strokeWidth="2" />
        <Path d="M8.4 8h7.2M8.4 12h4.4M8.4 16h5.8" stroke={NAV_ACCENT} strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
        <Path d="M14 12.4 15.3 13.7 18 10.7" stroke={NAV_ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'proof') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M8.2 12.6 15.8 8.2M8.2 11.4l7.6 4.4" stroke={NAV_ACCENT} strokeWidth="2" strokeLinecap="round" />
        <Circle cx="6.5" cy="12" r="2.7" stroke={NAV_ACCENT} strokeWidth="2" />
        <Circle cx="17.5" cy="7.5" r="2.7" stroke={NAV_ACCENT} strokeWidth="2" />
        <Circle cx="17.5" cy="16.5" r="2.7" stroke={NAV_ACCENT} strokeWidth="2" />
      </Svg>
    );
  }

  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x="3.6" y="5" width="16.8" height="14" rx="3" stroke={NAV_ACCENT} strokeWidth="2" />
      <Path d="M7 5v14M10 9h6M10 13h4.5" stroke={NAV_ACCENT} strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      <Path d="M5.9 3.7h3.2M14.9 20.3h3.2" stroke={NAV_ACCENT} strokeWidth="1.7" strokeLinecap="round" />
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
        <Animated.View
          style={[
            styles.activeDot,
            {
              opacity: focusedAnim,
              transform: [{ scale: dotScale }],
            },
          ]}
        />
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

  const centerButtonBottom = tabBarBottom + TAB_BAR_HEIGHT - (CENTER_BUTTON_SIZE / 2);
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
    dockEntranceAnim.stopAnimation();
    dockEntranceAnim.setValue(0);
    Animated.timing(dockEntranceAnim, {
      toValue: 1,
      duration: 680,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [dockEntranceAnim, focusedRouteName]);

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
            toValue: x,
            tension: 160,
            friction: 11,
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateY, {
            toValue: y,
            tension: 160,
            friction: 11,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.labelOpacity, {
          toValue: 1,
          duration: 120,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
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
            toValue: 0,
            tension: 240,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateY, {
            toValue: 0,
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

          return (
            <Animated.View
              key={item.key}
              pointerEvents={menuVisible ? 'auto' : 'none'}
              style={[
                styles.subMenuItemWrap,
                {
                  opacity: anim.opacity,
                  transform: [
                    { translateX: anim.translateX },
                    { translateY: anim.translateY },
                    { scale: anim.scale },
                  ],
                },
              ]}
            >
              <Pressable accessibilityRole="button" accessibilityLabel={item.label} onPress={() => handleMenuItemPress(item.route)}>
                <View style={styles.subMenuGlow} />
                <View style={styles.subMenuButton}>
                  <ActionGlyph type={item.icon} />
                </View>
                <Animated.Text style={[styles.subMenuLabel, { opacity: anim.labelOpacity }]}>{item.label}</Animated.Text>
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
              <Svg width={27} height={27} viewBox="0 0 27 27" fill="none">
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
        animation: 'shift',
        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 260,
            easing: Easing.out(Easing.cubic),
          },
        },
        sceneStyleInterpolator: ({ current }) => ({
          sceneStyle: {
            opacity: current.progress.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [0.82, 1, 0.82],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-22, 0, 22],
                  extrapolate: 'clamp',
                }),
              },
              {
                scale: current.progress.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0.985, 1, 0.985],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        }),
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="vault" options={{ title: 'Vault' }} />
      <Tabs.Screen name="share" options={{ title: 'Share' }} />
      <Tabs.Screen name="privacy" options={{ href: null, title: 'Privacy' }} />
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
    marginLeft: -24,
    width: 48,
    height: 48,
    zIndex: 3,
  },
  subMenuItemWrap: {
    position: 'absolute',
    width: 48,
    alignItems: 'center',
  },
  subMenuGlow: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: NAV_ACCENT_SOFT,
  },
  subMenuButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 4,
  },
  tabBar: {
    position: 'absolute',
    left: TAB_BAR_SIDE_INSET,
    right: TAB_BAR_SIDE_INSET,
    height: TAB_BAR_HEIGHT,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: TAB_BAR_INNER_PADDING,
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.86)',
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
    height: 27,
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
