import AppButton from '@/components/shared/AppButton';
import { BodyLargeText, BodySmallText, Label } from '@/components/shared/AppTexts';
import { Fonts } from '@/constants/fonts';
import { ASSETS } from '@/utils/assets';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../context/ThemeContext';
import { useDesignSystem } from '../../utils/design-system';
import { getFloatingTabBarContentPadding } from '../../utils/responsive-spacing';
import { useAuthStore } from '@/store/authStore';

function ListRow({
  title,
  detail,
  icon,
  color,
  onPress,
}: {
  title: string;
  detail?: string;
  icon?: keyof typeof Feather.glyphMap;
  color?: string;
  onPress?: () => void;
}) {
  const ds = useDesignSystem();
  const rowStyle = {
    minHeight: detail ? 66 : 56,
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
      {icon && (
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(5,21,14,0.04)', justifyContent: 'center', alignItems: 'center' }}>
          <Feather name={icon} size={20} color={color ?? 'rgba(5,21,14,0.72)'} />
        </View>
      )}
      <View style={{ flex: 1, gap: 2 }}>
        <BodyLargeText style={{ color: color ?? '#05150E', fontFamily: Fonts.semiBold, fontSize: 16 }}>{title}</BodyLargeText>
        {detail && <BodySmallText style={{ color: 'rgba(5,21,14,0.46)', fontSize: 12 }}>{detail}</BodySmallText>}
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Feather name="chevron-right" size={20} color="rgba(5,21,14,0.32)" />
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
    <View style={{ gap: ds.space.sm }}>
      <Label style={{ color: 'rgba(5,21,14,0.52)', fontSize: 13, marginLeft: ds.space.xs, fontFamily: Fonts.semiBold }}>{title}</Label>
      <View style={{
        backgroundColor: Colors.white,
        borderRadius: ds.radius.xl,
        paddingVertical: ds.space.sm,
        paddingHorizontal: ds.space.lg,
        borderWidth: 1,
        borderColor: 'rgba(5,21,14,0.06)'
      }}>
        {children}
      </View>
    </View>
  );
}

function SettingsProfileCard() {
  const ds = useDesignSystem();
  const user = useAuthStore((state) => state.user);

  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: ds.radius.xl,
        padding: ds.space.lg,
        borderWidth: 1,
        borderColor: 'rgba(5,21,14,0.06)',
        flexDirection: "row",
        alignItems: "center",
        gap: ds.space.md,
      }}
    >
      <Image
        source={user?.avatarUrl ? { uri: user.avatarUrl } : ASSETS.IMAGES.PROFILE_IMG}
        style={{ width: 64, height: 64, borderRadius: ds.radius.full, borderWidth: 1, borderColor: '#F3F4F6' }}
      />
      <View style={{ flex: 1, gap: ds.space.xs }}>
        <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 18, color: '#05150E' }}>{user?.fullName || 'Ontiver user'}</BodyLargeText>
        <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.52)', fontSize: 13, marginBottom: ds.space.xs }}>{user?.email || ''}</BodySmallText>
        <AppButton
          title='Edit Profile'
          onPress={() => router.push("/settings/profile" as any)}
          style={{ alignSelf: "flex-start", backgroundColor: "#ECFDF3", borderColor: "transparent", borderWidth: 0, height: 32, paddingTop: 2, borderRadius: ds.radius.full, paddingHorizontal: 16 }}
          textStyle={{ fontSize: 12, color: "#166534", fontFamily: Fonts.bold }}
        />
      </View>
      <View style={{ alignSelf: 'flex-start' }}>
        <ASSETS.ICONS.SILVER_BADGE width={24} height={24} />
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const ds = useDesignSystem();
  const { top, bottom } = useSafeAreaInsets();
  const { isDark, setTheme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const tabSafePadding = getFloatingTabBarContentPadding(bottom, ds.space['5xl']);

  const accountActions = [
    {
      title: "Account & sign-in",
      icon: "user" as const,
      route: "/settings/account" as const,
    },
    {
      title: "Security",
      icon: "shield" as const,
      route: "/settings/security" as const,
    },
    {
      title: "KYC",
      icon: "check-circle" as const,
      route: "/(screens)/kyc" as const,
    },
  ];

  const preferenceActions = [
    {
      title: "Notifications",
      icon: "bell" as const,
      route: "/settings/notification" as const,
    },
    {
      title: "Privacy",
      icon: "lock" as const,
      route: "/settings/privacy" as const,
    },
  ];

  const supportActions = [
    // {
    //   title: "Ontiver Pro",
    //   icon: "star" as const,
    //   route: "/settings/ontiver-pro" as const,
    // },
    {
      title: "Help & Support",
      icon: "help-circle" as const,
      route: "/(screens)/help-support" as const,
    },
    {
      title: "About",
      icon: "info" as const,
      route: "/settings/about" as const,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC', paddingTop: top }}>
      <View style={{ paddingHorizontal: ds.space.lg, paddingVertical: ds.space.md }}>
        <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 24, color: '#05150E' }}>Settings</BodyLargeText>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: ds.space.lg,
          paddingBottom: tabSafePadding,
          gap: ds.space.xl
        }}
      >
        <Animated.View entering={FadeInDown.duration(360)}>
          <SettingsProfileCard />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(70).duration(360)}>
          <PlainListSection title="Account">
            {accountActions.map((action, index) => (
              <View key={action.title}>
                <ListRow
                  title={action.title}
                  icon={action.icon}
                  onPress={() => router.push(action.route as any)}
                />
                {index < accountActions.length - 1 && (
                  <View style={{ height: 1, backgroundColor: 'rgba(5,21,14,0.04)', marginHorizontal: ds.space.sm }} />
                )}
              </View>
            ))}
          </PlainListSection>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(360)}>
          <PlainListSection title="Preferences">
            {preferenceActions.map((action, index) => (
              <View key={action.title}>
                <ListRow
                  title={action.title}
                  icon={action.icon}
                  onPress={() => router.push(action.route as any)}
                />
                {index < preferenceActions.length - 1 && (
                  <View style={{ height: 1, backgroundColor: 'rgba(5,21,14,0.04)', marginHorizontal: ds.space.sm }} />
                )}
              </View>
            ))}
          </PlainListSection>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(170).duration(360)}>
          <PlainListSection title="Support & More">
            {supportActions.map((action, index) => (
              <View key={action.title}>
                <ListRow
                  title={action.title}
                  icon={action.icon}
                  onPress={() => router.push(action.route as any)}
                />
                {index < supportActions.length - 1 && (
                  <View style={{ height: 1, backgroundColor: 'rgba(5,21,14,0.04)', marginHorizontal: ds.space.sm }} />
                )}
              </View>
            ))}
          </PlainListSection>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(220).duration(360)} style={{ marginTop: ds.space.md }}>
          <AppButton
            title='Sign Out'
            textStyle={{ color: "rgba(156, 0, 0, 1)", fontFamily: Fonts.bold }}
            style={{ backgroundColor: "rgba(255, 219, 219, 0.4)", borderRadius: ds.radius.xl, borderWidth: 0 }}
            onPress={() => void logout()}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
