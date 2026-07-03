import { Fonts } from '@/constants/fonts';
import { ASSETS } from '@/utils/assets';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BodyLargeText, BodySmallText, Label } from '../../components/shared/AppTexts';
import { HomeBannerSlider } from '../../components/shared/HomeBannerSlider';
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
      country: "Nigeria",
      title: "National ID Card",
      status: "Verified",
      date: "15th April, 2026"
    },
    {
      id: 2,
      country: "Nigeria",
      title: "National ID Card",
      status: "Pending",
      date: "15th April, 2026"
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
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: ds.space.lg }}>
          <View style={{ flex: 1 }}>
            <BodySmallText style={{ color: ds.colors.secondaryText }}>Welcome Back</BodySmallText>
            <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 24, marginTop: 4, color: ds.colors.mainText }}>Gracious</BodyLargeText>
          </View>
          <TouchableOpacity style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : ds.colors.white, padding: ds.space.sm, borderRadius: ds.radius.full, shadowColor: ds.colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'transparent' }} onPress={() => router.push('/(screens)/notifications')}>
            <ASSETS.ICONS.NOTIFICATION_ICON width={24} height={24} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={recentActivities}
          renderItem={({ item, index }) => {
            const renderColors = () => {
              if (item.status === "Verified") return { bg: isDark ? "rgba(34, 197, 94, 0.2)" : "rgba(208, 255, 221, 1)", text: isDark ? "#4ade80" : "rgba(0, 125, 33, 1)", icon: ASSETS.ICONS.HOME_CHECKMARK }
              if (item.status === "Pending") return { bg: isDark ? "rgba(251, 146, 60, 0.2)" : "rgba(255, 230, 208, 1)", text: isDark ? "#fb923c" : "rgba(170, 81, 2, 1)", icon: ASSETS.ICONS.HOME_ALERT }
              if (item.status === "Declined") return { bg: isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 208, 209, 1)", text: isDark ? "#ef4444" : "rgba(125, 0, 2, 1)", icon: ASSETS.ICONS.HOME_CANCEL }
            }

            const colors = renderColors()
            const Icon = colors?.icon

            const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
            return (
              <AnimatedTouchableOpacity
                entering={FadeInUp.delay(index * 100).duration(400)}
                style={{ flexDirection: "row", alignItems: "center", gap: ds.space.md, padding: ds.space.md, backgroundColor: ds.colors.white, borderRadius: ds.radius.xl, borderColor: ds.colors.inputBorder, borderWidth: 1, shadowColor: ds.colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.03, shadowRadius: 8, elevation: 2 }}>
                <View style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : "rgba(248, 250, 252, 1)", padding: ds.space.sm, borderRadius: ds.radius.lg }}>
                  <ASSETS.ICONS.HOME_RECENT_ACTIVITY />
                </View>
                <View style={{ flex: 1 }}>
                  <BodyLargeText style={{ fontFamily: Fonts.medium, color: ds.colors.mainText }}>{item.title}</BodyLargeText>
                  <BodySmallText style={{ color: ds.colors.secondaryText, marginTop: 2 }}>{item.date}</BodySmallText>
                </View>
                <View style={{ flexDirection: "row", backgroundColor: colors?.bg, paddingHorizontal: ds.space.sm, paddingVertical: 6, justifyContent: "center", alignItems: "center", borderRadius: ds.radius.full, gap: 4 }}>
                  {Icon && <Icon width={12} height={12} />}
                  <BodySmallText style={{ color: colors?.text, fontFamily: Fonts.medium }} size={12}>{item.status}</BodySmallText>
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
                  return (
                    <AnimatedTouchableOpacity
                      entering={FadeInRight.delay(index * 150).duration(400)}
                      onPress={item.onPress}
                      style={{ borderWidth: 1, flexDirection: "row", alignItems: "center", gap: ds.space.md, padding: ds.space.md, backgroundColor: ds.colors.white, borderRadius: ds.radius.xl, width: ds.width * 0.75, borderColor: isDark ? "rgba(255, 211, 142, 0.4)" : "rgba(255, 211, 142, 1)", shadowColor: "rgba(255, 211, 142, 0.4)", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 }}>
                      <View style={{ backgroundColor: isDark ? "rgba(255, 211, 142, 0.15)" : "rgba(255, 240, 219, 1)", padding: ds.space.sm, borderRadius: ds.radius.full }}>
                        <ASSETS.ICONS.NOTIFICATION_ICON width={18} height={18} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Label style={{ fontFamily: Fonts.semiBold, fontSize: 13, color: ds.colors.mainText }}>{item.title}</Label>
                        <BodySmallText style={{ color: ds.colors.secondaryText, marginTop: 2 }} size={11}>{item.description}</BodySmallText>
                      </View>
                    </AnimatedTouchableOpacity>
                  )
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: ds.space.lg }} />}
              />

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: ds.space.sm }}>
                <BodyLargeText style={{ fontFamily: Fonts.bold, flex: 1, fontSize: 18, color: ds.colors.mainText }}>My Credentials</BodyLargeText>
                <BodySmallText color={ds.colors.primary} style={{ fontFamily: Fonts.medium }}>See all</BodySmallText>
              </View>

              <FlatList
                data={myCredentials}
                renderItem={({ item, index }) => {
                  const renderColors = () => {
                    if (item.status === "Verified") return { bg: isDark ? "rgba(34, 197, 94, 0.2)" : "rgba(208, 255, 221, 1)", text: isDark ? "#4ade80" : "rgba(0, 125, 33, 1)", icon: ASSETS.ICONS.HOME_CHECKMARK }
                    if (item.status === "Pending") return { bg: isDark ? "rgba(251, 146, 60, 0.2)" : "rgba(255, 230, 208, 1)", text: isDark ? "#fb923c" : "rgba(170, 81, 2, 1)", icon: ASSETS.ICONS.HOME_ALERT }
                    if (item.status === "Declined") return { bg: isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 208, 209, 1)", text: isDark ? "#ef4444" : "rgba(125, 0, 2, 1)", icon: ASSETS.ICONS.HOME_CANCEL }
                  }

                  const colors = renderColors()
                  const Icon = colors?.icon

                  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
                  return (
                    <AnimatedTouchableOpacity
                      entering={FadeInRight.delay(index * 150).duration(400)}
                      style={{ gap: ds.space.sm, padding: ds.space.lg, backgroundColor: ds.colors.white, borderRadius: ds.radius.xl, borderColor: ds.colors.inputBorder, borderWidth: 1, width: ds.width * 0.45, shadowColor: ds.colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.03, shadowRadius: 8, elevation: 2 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <BodySmallText style={{ color: ds.colors.secondaryText, fontFamily: Fonts.medium }}>{item.country}</BodySmallText>
                      </View>
                      <View style={{ flex: 1, marginVertical: ds.space.xs }}>
                        <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 15, color: ds.colors.mainText }}>{item.title}</BodyLargeText>
                        <BodySmallText style={{ color: ds.colors.secondaryText, marginTop: 4, fontSize: 11 }}>{item.date}</BodySmallText>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", backgroundColor: colors?.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: ds.radius.full }}>
                        {Icon && <Icon width={10} height={10} />}
                        <BodySmallText style={{ color: colors?.text, fontFamily: Fonts.medium }} size={10}>{item.status}</BodySmallText>
                      </View>
                    </AnimatedTouchableOpacity>
                  )
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: ds.space.lg }} />}
                contentContainerStyle={{ paddingVertical: ds.space.md }}
              />

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
            <ASSETS.ICONS.FLOATING_ACTION_ICON />
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

