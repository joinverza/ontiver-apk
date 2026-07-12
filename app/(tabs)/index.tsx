import { Fonts } from '@/constants/fonts';
import { ASSETS } from '@/utils/assets';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BodyLargeText, BodySmallText, Label } from '../../components/shared/AppTexts';
import { HomeBannerSlider } from '../../components/shared/HomeBannerSlider';
import { CredentialCard } from '../../components/shared/CredentialCard';
import { useTheme } from '../../context/ThemeContext';
import { useDesignSystem } from '../../utils/design-system';

export default function HomeScreen() {
  const ds = useDesignSystem();
  const { isDark } = useTheme();
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets()

  const recentActivities = [
    {
      id: 1,
      title: "Credential Added",
      date: "15th April, 2026",
      status: "Verified"
    },
    {
      id: 2,
      title: "Credential Added",
      date: "15th April, 2026",
      status: "Pending"
    },
    {
      id: 3,
      title: "Credential Added",
      date: "15th April, 2026",
      status: "Declined"
    },
  ]

  const myCredentials = [
    {
      id: 1,
      label: 'NIN',
      title: 'National Identification',
      country: 'Nigeria',
      status: 'Verified',
      date: '15th April, 2026',
      bgColor: '#000000',
      credentialType: 'kyc' as const,
    },
    {
      id: 2,
      label: 'BVN',
      title: 'Bank Verification',
      country: 'Nigeria',
      status: 'Verified',
      date: '15th April, 2026',
      bgColor: '#00ff40',
      credentialType: 'aml' as const,
    },
    {
      id: 3,
      label: 'Passport',
      title: 'International Passport',
      country: 'Nigeria',
      status: 'Pending',
      date: '15th April, 2026',
      bgColor: '#3801E5',
      credentialType: 'kyb' as const,
    },
  ]

  const info = [
    {
      id: 1,
      title: "2 new request waiting",
      description: "Paystack and 2 others want to verify...",
      onPress: () => router.push('/(screens)/notifications')
    },
    {
      id: 2,
      title: "New Credential Added",
      description: "Your First Bank National ID is ready",
      onPress: () => router.push('/(screens)/activities')
    },
  ]

  const homeSliderData = [
    {
      image: ASSETS.IMAGES.HOME_SLIDER_1,
      onPress: () => { }
    },
    {
      image: ASSETS.IMAGES.HOME_SLIDER_2,
      onPress: () => { }
    },
    {
      image: ASSETS.IMAGES.HOME_SLIDER_3,
      onPress: () => { }
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: ds.colors.background }}>
      <LinearGradient
        colors={[isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(22, 101, 52, 0.08)', 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 250 }}
      />

      <View style={{ paddingHorizontal: ds.space.lg, paddingTop: top }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: ds.space.md, marginBottom: ds.space.sm }}>
          <View style={{ flex: 1 }}>
            <BodySmallText style={{ color: ds.colors.secondaryText, fontSize: 18 }}>Welcome Back</BodySmallText>
            <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 34, marginTop: 4, color: ds.colors.mainText }}>Gracious</BodyLargeText>
          </View>
          <TouchableOpacity style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : ds.colors.white, padding: ds.space.sm, borderRadius: ds.radius.full, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(226, 232, 240, 1)' }} onPress={() => router.push('/(screens)/notifications')}>
            <ASSETS.ICONS.NOTIFICATION_ICON width={24} height={24} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={recentActivities}
          renderItem={({ item, index }) => {
            const renderColors = () => {
              if (item.status === "Verified") return { bg: isDark ? "rgba(34, 197, 94, 0.14)" : "rgba(232, 255, 238, 1)", text: isDark ? "#86efac" : "rgba(0, 125, 33, 1)", border: isDark ? "rgba(74, 222, 128, 0.25)" : "rgba(0, 125, 33, 0.14)", dot: "#22c55e" }
              if (item.status === "Pending") return { bg: isDark ? "rgba(251, 146, 60, 0.14)" : "rgba(255, 246, 235, 1)", text: isDark ? "#fdba74" : "rgba(170, 81, 2, 1)", border: isDark ? "rgba(251, 146, 60, 0.25)" : "rgba(170, 81, 2, 0.14)", dot: "#fb923c" }
              if (item.status === "Declined") return { bg: isDark ? "rgba(239, 68, 68, 0.14)" : "rgba(255, 241, 242, 1)", text: isDark ? "#fca5a5" : "rgba(125, 0, 2, 1)", border: isDark ? "rgba(239, 68, 68, 0.25)" : "rgba(125, 0, 2, 0.14)", dot: "#ef4444" }
            }

            const colors = renderColors()
            const activityIcon = item.status === "Verified" ? "check-circle" : item.status === "Pending" ? "clock" : "x-circle"

            const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
            return (
              <AnimatedTouchableOpacity
                entering={FadeInUp.delay(index * 100).duration(400)}
                style={{ minHeight: 74, flexDirection: "row", alignItems: "center", gap: ds.space.md, padding: ds.space.md, backgroundColor: ds.colors.white, borderRadius: ds.radius.lg, borderColor: colors?.border, borderWidth: 1 }}>
                <View style={{ backgroundColor: colors?.bg, width: 44, height: 44, borderRadius: ds.radius.full, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: colors?.border }}>
                  <Feather name={activityIcon} size={20} color={colors?.text} />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <BodyLargeText style={{ fontFamily: Fonts.semiBold, color: ds.colors.mainText, fontSize: 15 }}>{item.title}</BodyLargeText>
                  <BodySmallText style={{ color: ds.colors.secondaryText, fontSize: 12 }}>{item.date}</BodySmallText>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <View style={{ flexDirection: "row", backgroundColor: colors?.bg, borderColor: colors?.border, borderWidth: 1, paddingHorizontal: ds.space.sm, paddingVertical: 5, justifyContent: "center", alignItems: "center", borderRadius: ds.radius.full, gap: 6 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors?.dot }} />
                    <BodySmallText style={{ color: colors?.text, fontFamily: Fonts.bold, fontSize: 11 }}>{item.status}</BodySmallText>
                  </View>
                  <Feather name="arrow-right" size={16} color={ds.colors.secondaryText} />
                </View>
              </AnimatedTouchableOpacity>
            )
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: ds.space.md }} />}
          ListHeaderComponent={() => (
            <View style={{ marginBottom: ds.space.xl, gap: ds.space.lg }}>
              {/* Home Slider */}
              <HomeBannerSlider data={homeSliderData} />

              <FlatList
                data={info}
                renderItem={({ item, index }) => {
                  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
                  const accent = index === 0
                    ? {
                      icon: "shield" as const,
                      iconColor: isDark ? "#86efac" : "rgba(0, 125, 33, 1)",
                      surface: isDark ? "rgba(34, 197, 94, 0.12)" : "rgba(232, 255, 238, 1)",
                      border: isDark ? "rgba(74, 222, 128, 0.24)" : "rgba(0, 125, 33, 0.16)",
                    }
                    : {
                      icon: "bell" as const,
                      iconColor: isDark ? "#7dd3fc" : "rgba(2, 132, 199, 1)",
                      surface: isDark ? "rgba(56, 189, 248, 0.12)" : "rgba(239, 250, 255, 1)",
                      border: isDark ? "rgba(125, 211, 252, 0.24)" : "rgba(2, 132, 199, 0.16)",
                    }

                  return (
                    <AnimatedTouchableOpacity
                      entering={FadeInRight.delay(index * 150).duration(400)}
                      onPress={item.onPress}
                      style={{ borderWidth: 1, flexDirection: "row", alignItems: "center", gap: ds.space.md, padding: ds.space.md, backgroundColor: ds.colors.white, borderRadius: ds.radius.lg, width: Math.min(ds.width * 0.78, 320), borderColor: accent.border }}>
                      <View style={{ backgroundColor: accent.surface, width: 44, height: 44, borderRadius: ds.radius.md, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: accent.border }}>
                        <Feather name={accent.icon} size={20} color={accent.iconColor} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Label style={{ fontFamily: Fonts.semiBold, fontSize: 13, color: ds.colors.mainText }}>{item.title}</Label>
                        <BodySmallText style={{ color: ds.colors.secondaryText, marginTop: 2 }} size={11}>{item.description}</BodySmallText>
                      </View>
                      <Feather name="chevron-right" size={18} color={ds.colors.secondaryText} />
                    </AnimatedTouchableOpacity>
                  )
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: ds.space.lg }} />}
              />

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: ds.space.sm }}>
                <BodyLargeText style={{ fontFamily: Fonts.bold, flex: 1, fontSize: 18, color: ds.colors.mainText }}>My Credentials</BodyLargeText>
                <TouchableOpacity onPress={() => router.push('/vault')}>

                  <BodySmallText color={ds.colors.primary} style={{ fontFamily: Fonts.medium }}>See all</BodySmallText>
                </TouchableOpacity>
              </View>

              {/* Stacked Credentials */}
              <View style={{ marginTop: ds.space.md, height: 158 + 170, width: '100%', alignItems: 'center', position: 'relative' }}>
                {myCredentials.map((item, index) => {
                  const AnimatedView = Animated.createAnimatedComponent(View);
                  const isFront = index === 0;
                  const isMiddle = index === 1;

                  const topOffset = isFront ? 170 : isMiddle ? 85 : 0;
                  const zIndex = 3 - index;

                  return (
                    <AnimatedView
                      key={item.id}
                      entering={FadeInUp.delay(index * 150).duration(400)}
                      style={{
                        position: 'absolute',
                        top: topOffset,
                        zIndex,
                        width: '100%',
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.88}
                        onPress={() => router.push({
                          pathname: '/vault',
                          params: {
                            credentialId: String(item.id),
                            openCredentialAt: String(Date.now()),
                          },
                        })}
                        style={{ width: '100%', alignItems: 'center' }}
                      >
                        <CredentialCard
                          label={item.label}
                          title={item.title}
                          bgColor={item.bgColor}
                          credentialType={item.credentialType}
                          status={item.status}
                          width={ds.width - ds.space.lg * 2}
                          height={158}
                        />
                      </TouchableOpacity>
                    </AnimatedView>
                  );
                })}
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: ds.space.md }}>
                <BodyLargeText style={{ fontFamily: Fonts.bold, flex: 1, fontSize: 18, color: ds.colors.mainText }}>Recent Activities</BodyLargeText>
                <TouchableOpacity onPress={() => router.push('/(screens)/activities')}>
                  <BodySmallText color={ds.colors.primary} style={{ fontFamily: Fonts.medium }}>See all</BodySmallText>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: ds.space.sm, paddingBottom: 140 + bottom }}
        />

        <Animated.View
          entering={FadeInUp.delay(500).springify()}
          style={{ position: "absolute", bottom: ds.space['8xl'] * 2 + bottom, right: ds.space.xl, zIndex: 100 }}
        >
          <TouchableOpacity
            style={{ backgroundColor: ds.colors.primary, width: 64, height: 64, borderRadius: 32, justifyContent: "center", alignItems: "center", shadowColor: ds.colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }}
            onPress={() => router.push('/(screens)/scan')}>
            <Feather name="plus" size={32} color={ds.colors.white} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

