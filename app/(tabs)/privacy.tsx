import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { BodyLargeText, BodySmallText, H2Text, Label } from '../../components/shared/AppTexts';
import Colors from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { useDesignSystem } from '../../utils/design-system';
import { getFloatingTabBarContentPadding } from '../../utils/responsive-spacing';

const weeklyBars = [
  { value: 62, label: 'Mon' },
  { value: 66, label: 'Tue' },
  { value: 70, label: 'Wed' },
  { value: 78, label: 'Thu' },
  { value: 81, label: 'Fri' },
  { value: 84, label: 'Sat' },
  { value: 86, label: 'Sun' },
];

const quickActions = [
  {
    title: 'Exposure',
    route: '/(screens)/who-has-data' as const,
    icon: 'map' as const,
    color: '#0E7490',
    bg: '#ECFEFF',
  },
  {
    title: 'Improve',
    route: '/(screens)/improve-score' as const,
    icon: 'trend' as const,
    color: '#166534',
    bg: '#F0FDF4',
  },
  {
    title: 'Revoke',
    route: '/(screens)/revoke-shares' as const,
    icon: 'revoke' as const,
    color: '#BE123C',
    bg: '#FFF1F2',
  },
  {
    title: 'Alerts',
    route: '/(screens)/notifications' as const,
    icon: 'alerts' as const,
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
];

const actions = [
  {
    title: 'Exposure Map',
    subtitle: 'See who currently has your data',
    route: '/(screens)/who-has-data' as const,
    value: '6 apps',
  },
  {
    title: 'Improve Score',
    subtitle: 'Review the highest impact privacy steps',
    route: '/(screens)/improve-score' as const,
    value: '+5 pts',
  },
  {
    title: 'Revoke Shares',
    subtitle: 'Remove old access from connected services',
    route: '/(screens)/revoke-shares' as const,
    value: '1 due',
  },
];

const scoreFactors = [
  {
    title: 'Active Shares',
    detail: '3 companies have current access',
    value: '-12 pts',
    color: '#BE123C',
    route: '/(screens)/who-has-data' as const,
  },
  {
    title: 'Credential Completeness',
    detail: 'Core credentials are verified',
    value: '+8 pts',
    color: '#166534',
    route: '/vault' as const,
  },
  {
    title: 'Breach History',
    detail: 'No active breach alert',
    value: '+10 pts',
    color: '#0E7490',
    route: '/(screens)/privacy/breach-alert' as const,
  },
];

function PrivacyIcon({ type, color, size = 24 }: { type: string; color: string; size?: number }) {
  if (type === 'map') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 6.5 9 4l6 2.5 5-2.5v13.5L15 20l-6-2.5L4 20V6.5Z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
        <Path d="M9 4v13.5M15 6.5V20" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'trend') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 16.5 9 11.5l3.4 3.4L20 7.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M15 7.5h5v5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'revoke') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3.8 19.5 7v5.5c0 4-2.9 6.9-7.5 8.6-4.6-1.7-7.5-4.6-7.5-8.6V7L12 3.8Z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
        <Path d="M9 9.8 15 15.8M15 9.8 9 15.8" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'alerts') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 4.2a5.2 5.2 0 0 0-5.2 5.2v2.9L5 15.5h14l-1.8-3.2V9.4A5.2 5.2 0 0 0 12 4.2Z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
        <Path d="M10 18a2.2 2.2 0 0 0 4 0" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'score') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="8.4" stroke={color} strokeWidth="1.8" />
        <Path d="M8.3 12.1 10.8 14.6 16.1 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'credential') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="5" width="16" height="14" rx="3" stroke={color} strokeWidth="1.9" />
        <Circle cx="9.2" cy="11" r="2.1" stroke={color} strokeWidth="1.7" />
        <Path d="M14 10h3M14 14h3M6.8 16.2c.7-1.5 4.1-1.5 4.8 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3.8 19 7v5.2c0 4.2-2.8 7.2-7 9-4.2-1.8-7-4.8-7-9V7l7-3.2Z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
      <Path d="M8.8 12.1 11 14.2l4.4-4.6" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PrivacyScoreMark({ color = '#166534', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d="M14 3.4 22.2 6.8v6.3c0 4.8-3.2 8.4-8.2 10.4-5-2-8.2-5.6-8.2-10.4V6.8L14 3.4Z" stroke={color} strokeWidth="2.1" strokeLinejoin="round" />
      <Path d="M9.7 14.2 12.5 17l6-6.5" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9.6 8.8c2.4-1.2 6.4-1.2 8.8 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
    </Svg>
  );
}

function PrivacyPass() {
  const ds = useDesignSystem();

  return (
    <View style={{ gap: ds.space.xl }}>
      <View
        style={{
          minHeight: 62,
          // borderRadius: ds.radius.sm,
          borderTopLeftRadius: ds.radius.lg,
          borderTopRightRadius: ds.radius.lg,
          backgroundColor: Colors.white,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          paddingHorizontal: ds.space.lg,
          paddingVertical: ds.space.lg,
          justifyContent: 'center',
        }}
      >
        <Svg width="132" height="72" viewBox="0 0 132 72" style={{ position: 'absolute', right: 68, top: -3 }} fill="none">
          {Array.from({ length: 9 }).map((_, index) => (
            <Path
              key={index}
              d={`M${12 + index * 8} -6 C${32 + index * 8} 18 ${25 + index * 8} 44 ${48 + index * 8} 78`}
              stroke="rgba(5, 21, 14, 0.08)"
              strokeWidth="1"
            />
          ))}
        </Svg>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.sm }}>
          <View style={{ flex: 1, gap: 3 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 18, color: '#05150E' }}>Privacy Pass</BodyLargeText>
              <Feather name="chevron-right" size={15} color="rgba(5,21,14,0.42)" />
            </View>
            <BodySmallText style={{ color: 'rgba(5,21,14,0.52)', fontSize: 11 }}>Active shares are masked and monitored</BodySmallText>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 3 }}>
            <BodySmallText style={{ color: 'rgba(5,21,14,0.46)', fontFamily: Fonts.medium, fontSize: 10 }}>**** **** **** 086</BodySmallText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <BodyLargeText style={{ color: '#166534', fontFamily: Fonts.bold, fontSize: 18 }}>86%</BodyLargeText>
              <View style={{ paddingHorizontal: 7, paddingVertical: 3, borderRadius: ds.radius.full, backgroundColor: '#ECFDF3' }}>
                <BodySmallText style={{ color: '#166534', fontFamily: Fonts.bold, fontSize: 9 }}>STRONG</BodySmallText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function QuickActionDock() {
  const ds = useDesignSystem();
  const router = useRouter();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: ds.space.sm }}>
      {quickActions.map((action) => (
        <TouchableOpacity
          key={action.title}
          activeOpacity={0.82}
          onPress={() => router.push(action.route)}
          style={{ flex: 1, alignItems: 'center', gap: ds.space.sm }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: ds.radius.full,
              borderWidth: 1,
              borderColor: 'rgba(5,21,14,0.08)',
              backgroundColor: action.bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PrivacyIcon type={action.icon} color={action.color} size={22} />
          </View>
          <BodySmallText numberOfLines={1} adjustsFontSizeToFit style={{ color: '#05150E', fontFamily: Fonts.semiBold, fontSize: 11 }}>
            {action.title}
          </BodySmallText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function MetricTile({
  title,
  value,
  detail,
  icon,
  color,
  bg,
  compact,
}: {
  title: string;
  value: string;
  detail: string;
  icon: string;
  color: string;
  bg: string;
  compact?: boolean;
}) {
  const ds = useDesignSystem();

  return (
    <View
      style={{
        flex: 1,
        minHeight: compact ? 82 : 178,
        borderRadius: ds.radius.lg,
        backgroundColor: Colors.white,
        padding: ds.space.md,
        justifyContent: 'space-between',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: `${color}30`,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: ds.space.sm }}>
        <View
          style={{
            width: compact ? 32 : 42,
            height: compact ? 32 : 42,
            borderRadius: ds.radius.full,
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PrivacyIcon type={icon} color={color} size={compact ? 18 : 24} />
        </View>
        {!compact ? (
          <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: ds.radius.full, backgroundColor: '#F8FAFC' }}>
            <BodySmallText style={{ color: 'rgba(5,21,14,0.54)', fontFamily: Fonts.medium, fontSize: 10 }}>1 / 2</BodySmallText>
          </View>
        ) : null}
      </View>
      <View style={{ gap: compact ? 1 : 5 }}>
        <BodySmallText style={{ color: 'rgba(5,21,14,0.5)', fontFamily: Fonts.medium, fontSize: compact ? 10 : 12 }}>{title}</BodySmallText>
        <H2Text style={{ color: '#05150E', fontFamily: Fonts.bold, fontSize: compact ? 19 : 32, lineHeight: compact ? 23 : 36 }}>{value}</H2Text>
        <BodySmallText numberOfLines={compact ? 1 : 2} style={{ color, fontFamily: Fonts.semiBold, fontSize: compact ? 11 : 12 }}>
          {detail}
        </BodySmallText>
      </View>
    </View>
  );
}

function PrivacyScoreCarouselTile() {
  const ds = useDesignSystem();
  const [activeSlide, setActiveSlide] = useState(0);
  const slideWidth = Math.max((ds.width - ds.space.lg * 2 - ds.space.md) / 2 - ds.space.md * 2, 128);
  const slides = [
    {
      title: 'Privacy score',
      value: '86%',
      detail: '+5 possible today',
      color: '#166534',
      bg: '#ECFDF3',
    },
    {
      title: 'Share health',
      value: 'Low',
      detail: '3 active shares',
      color: '#0E7490',
      bg: '#ECFEFF',
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        minHeight: 178,
        borderRadius: ds.radius.lg,
        backgroundColor: Colors.white,
        padding: ds.space.md,
        justifyContent: 'space-between',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#16653430',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: ds.space.sm }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: ds.radius.full,
            backgroundColor: slides[activeSlide].bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PrivacyScoreMark color={slides[activeSlide].color} size={24} />
        </View>
        <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: ds.radius.full, backgroundColor: '#F8FAFC' }}>
          <BodySmallText style={{ color: 'rgba(5,21,14,0.54)', fontFamily: Fonts.medium, fontSize: 10 }}>
            {activeSlide + 1} / {slides.length}
          </BodySmallText>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={slideWidth}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const nextSlide = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
          setActiveSlide(Math.max(0, Math.min(slides.length - 1, nextSlide)));
        }}
        style={{ flexGrow: 0 }}
      >
        {slides.map((slide) => (
          <View key={slide.title} style={{ width: slideWidth, gap: 5 }}>
            <BodySmallText style={{ color: 'rgba(5,21,14,0.5)', fontFamily: Fonts.medium, fontSize: 12 }}>{slide.title}</BodySmallText>
            <H2Text style={{ color: '#05150E', fontFamily: Fonts.bold, fontSize: 32, lineHeight: 36 }}>{slide.value}</H2Text>
            <BodySmallText numberOfLines={2} style={{ color: slide.color, fontFamily: Fonts.semiBold, fontSize: 12 }}>
              {slide.detail}
            </BodySmallText>
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 5 }}>
        {slides.map((slide, index) => (
          <View
            key={slide.title}
            style={{
              width: activeSlide === index ? 18 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: activeSlide === index ? slide.color : 'rgba(5,21,14,0.16)',
            }}
          />
        ))}
      </View>
    </View>
  );
}

function MetricGrid() {
  const ds = useDesignSystem();

  return (
    <View style={{ flexDirection: 'row', gap: ds.space.md, minHeight: 178 }}>
      <PrivacyScoreCarouselTile />
      <View style={{ flex: 1, gap: ds.space.md }}>
        <MetricTile title="Shared apps" value="6" detail="3 active" icon="map" color="#0E7490" bg="#ECFEFF" compact />
        <MetricTile title="Risk level" value="Low" detail="0 breach alerts" icon="credential" color="#7C3AED" bg="#F5F3FF" compact />
      </View>
    </View>
  );
}

function PrivacyBarChart() {
  const ds = useDesignSystem();
  const chartHeight = 160;
  const chartMax = 100;

  return (
    <View style={{ backgroundColor: Colors.white, borderRadius: ds.radius.lg, padding: ds.space.lg, gap: ds.space.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: ds.space.md }}>
        <BodyLargeText style={{ color: '#05150E', fontFamily: Fonts.semiBold, fontSize: 16 }}>Weekly score trend</BodyLargeText>
        <BodySmallText style={{ color: '#166534', fontFamily: Fonts.bold }}>+5 today</BodySmallText>
      </View>
      <View style={{ flexDirection: 'row', gap: ds.space.md, minHeight: chartHeight + 30 }}>
        <View style={{ width: 42, height: chartHeight, justifyContent: 'space-between', paddingTop: 2 }}>
          {['100', '75', '50', '25', '0'].map((item) => (
            <BodySmallText key={item} style={{ color: 'rgba(5,21,14,0.32)', fontSize: 11, textAlign: 'right', fontVariant: ['tabular-nums'] }}>
              {item}
            </BodySmallText>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ height: chartHeight, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(22,101,52,0.18)' }}>
            {weeklyBars.map((bar) => {
              const barHeight = Math.max(12, (bar.value / chartMax) * chartHeight);

              return (
                <View key={bar.label} style={{ flex: 1, height: chartHeight, alignItems: 'center', justifyContent: 'flex-end' }}>
                  <BodySmallText style={{ color: '#166534', fontFamily: Fonts.bold, fontSize: 10, marginBottom: 5 }}>{bar.value}%</BodySmallText>
                  <View
                    style={{
                      width: 22,
                      height: barHeight,
                      borderTopLeftRadius: ds.radius.xs,
                      borderTopRightRadius: ds.radius.xs,
                      backgroundColor: '#166534',
                    }}
                  />
                </View>
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: ds.space.sm }}>
            {weeklyBars.map((bar) => (
              <BodySmallText key={bar.label} style={{ flex: 1, color: 'rgba(5,21,14,0.46)', textAlign: 'center', fontFamily: Fonts.medium, fontSize: 11 }}>
                {bar.label}
              </BodySmallText>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function ListRow({
  title,
  detail,
  value,
  color,
  onPress,
}: {
  title: string;
  detail: string;
  value: string;
  color?: string;
  onPress?: () => void;
}) {
  const ds = useDesignSystem();
  const rowStyle = {
    minHeight: 66,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: ds.space.lg,
    paddingVertical: ds.space.sm,
    paddingHorizontal: ds.space.sm,
    marginHorizontal: -ds.space.sm,
    borderRadius: ds.radius.md,
  };
  const content = (
    <>
      <View style={{ flex: 1, gap: 3 }}>
        <BodyLargeText style={{ color: '#05150E', fontFamily: Fonts.semiBold, fontSize: 15 }}>{title}</BodyLargeText>
        <BodySmallText style={{ color: 'rgba(5,21,14,0.46)', fontSize: 12 }}>{detail}</BodySmallText>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <BodyLargeText style={{ color: color ?? 'rgba(5,21,14,0.72)', fontFamily: Fonts.bold, fontSize: 14 }}>{value}</BodyLargeText>
        <Feather name="arrow-right" size={18} color="rgba(5,21,14,0.42)" />
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        hitSlop={8}
        android_ripple={{ color: 'rgba(22,101,52,0.08)', borderless: false }}
        style={({ pressed }) => [
          rowStyle,
          {
            backgroundColor: pressed ? 'rgba(22,101,52,0.06)' : 'transparent',
            opacity: pressed ? 0.82 : 1,
          },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={rowStyle}>{content}</View>;
}

function PlainListSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const ds = useDesignSystem();

  return (
    <View style={{ gap: ds.space.md }}>
      <Label style={{ color: 'rgba(5,21,14,0.52)', fontSize: 12 }}>{title}</Label>
      <View style={{ gap: ds.space.md }}>{children}</View>
    </View>
  );
}

export default function PrivacyDashboard() {
  const ds = useDesignSystem();
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const tabSafePadding = getFloatingTabBarContentPadding(bottom, ds.space['5xl']);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC', paddingTop: top }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: ds.space.lg, paddingTop: ds.space.lg, paddingBottom: tabSafePadding, gap: ds.space['2xl'] }}
      >
        <Animated.View entering={FadeInDown.duration(360)} style={{ gap: ds.space.xl }}>
          <PrivacyPass />
          <QuickActionDock />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(70).duration(360)}>
          <MetricGrid />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(360)}>
          <PrivacyBarChart />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(170).duration(360)}>
          <PlainListSection title="Privacy actions">
            {actions.map((action) => (
              <ListRow
                key={action.title}
                title={action.title}
                detail={action.subtitle}
                value={action.value}
                onPress={() => router.push(action.route)}
              />
            ))}
          </PlainListSection>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(220).duration(360)}>
          <PlainListSection title="Score factors">
            {scoreFactors.map((factor) => (
              <ListRow
                key={factor.title}
                title={factor.title}
                detail={factor.detail}
                value={factor.value}
                color={factor.color}
                onPress={() => router.push(factor.route)}
              />
            ))}
          </PlainListSection>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
