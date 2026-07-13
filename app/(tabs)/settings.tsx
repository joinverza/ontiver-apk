import AppButton from '@/components/shared/AppButton';
import { BodyLargeText, BodySmallText, H2Text } from '@/components/shared/AppTexts';
import { Fonts } from '@/constants/fonts';
import { ASSETS } from '@/utils/assets';
import { router } from 'expo-router';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../context/ThemeContext';
import { useDesignSystem } from '../../utils/design-system';
import { getFloatingTabBarContentPadding } from '../../utils/responsive-spacing';

export default function SettingsScreen() {
  const ds = useDesignSystem();
  const insets = useSafeAreaInsets();
  const { bottom } = insets;
  const { isDark, setTheme } = useTheme();
  const tabSafePadding = getFloatingTabBarContentPadding(bottom, ds.space['5xl']);

  const data = [
    {
      icon: ASSETS.ICONS.USER_ICON,
      title: "Account",
      onPress: () => router.push("/settings/account")
    },
    {
      icon: ASSETS.ICONS.USER_ICON,
      title: "Security",
      onPress: () => router.push("/settings/security")
    },
    {
      icon: ASSETS.ICONS.USER_ICON,
      title: "Notifications",
      onPress: () => router.push("/settings/notification")
    },
    {
      icon: ASSETS.ICONS.USER_ICON,
      title: "Privacy",
      onPress: () => router.push("/settings/privacy")
    },
    {
      icon: ASSETS.ICONS.USER_ICON,
      title: "Ontiver Pro",
      onPress: () => router.push("/settings/ontiver-pro" as any)
    },
    {
      icon: ASSETS.ICONS.USER_ICON,
      title: "Help & Support",
      onPress: () => router.push("/(screens)/help-support")
    },
    {
      icon: ASSETS.ICONS.USER_ICON,
      title: "About",
      onPress: () => router.push("/")
    },
    {
      icon: ASSETS.ICONS.USER_ICON,
      title: "KYC",
      onPress: () => router.push("/(screens)/kyc" as any)
    },
  ]

  return (
    <View style={[styles.container, { backgroundColor: Colors.primary }]}>
      <H2Text style={{ textAlign: "center", color: Colors.white, paddingTop: insets.top + ds.space.lg, paddingBottom: ds.space['7xl'], fontFamily: Fonts.bold }}>Settings</H2Text>
      <View style={{ flex: 1, backgroundColor: Colors.white, borderTopLeftRadius: ds.radius['4xl'], borderTopRightRadius: ds.radius['4xl'], padding: ds.space.xl }}>
        <View
          style={{
            paddingHorizontal: ds.space.xl,
            position: "absolute",
            top: -(ds.space['5xl']),
            left: ds.space.xl,
            backgroundColor: Colors.white,
            zIndex: 100,
            borderRadius: ds.radius.xl,
            width: ds.width - (2 * ds.space.xl),
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 20,
            paddingVertical: ds.space.lg,
            flexDirection: "row",
            alignItems: "center",
            gap: ds.space.md,
            borderWidth: 1,
            borderColor: '#F3F4F6'
          }}
        >
          <Image
            source={ASSETS.IMAGES.PROFILE_IMG}
            style={{ width: ds.width * 0.18, height: ds.width * 0.18, borderRadius: ds.radius.full, borderWidth: 2, borderColor: '#F3F4F6' }}
          />
          <View style={{ flex: 1, gap: ds.space.xs }}>
            <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 18 }}>Nathan Adeyemi</BodyLargeText>
            <BodySmallText size={12} style={{ color: 'rgba(5, 21, 14, 0.6)' }}>nathan.adeyemi@gmail.com</BodySmallText>
            <AppButton
              title='Edit Profile'
              style={{ width: "80%", backgroundColor: "rgba(255, 211, 142, 0.2)", borderColor: "transparent", borderWidth: 0, height: 32, paddingTop: 4, borderRadius: ds.radius.full }}
              textStyle={{ fontSize: 11, color: Colors.primary, fontFamily: Fonts.bold }}
            />
          </View>
          <View style={{ alignSelf: 'flex-start' }}>
            <ASSETS.ICONS.SILVER_BADGE />
          </View>
        </View>

        {/* {__DEV__ && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: ds.space.md, paddingTop: ds.space['6xl'], paddingBottom: ds.space.md }}>
            <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 16 }}>Dark Mode (Dev Only)</BodyLargeText>
            <Switch 
              value={isDark} 
              onValueChange={(val) => setTheme(val ? 'dark' : 'light')} 
            />
          </View>
        )} */}

        <FlatList
          data={data}
          contentInsetAdjustmentBehavior="automatic"
          renderItem={({ item, index }) => {
            const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
            return (
              <AnimatedTouchableOpacity onPress={item.onPress}
                entering={FadeInUp.delay(index * 50).duration(400)}
                style={{
                  flexDirection: "row",
                  gap: ds.space.lg,
                  paddingVertical: ds.space.md,
                  paddingHorizontal: ds.space.md,
                  alignItems: "center",
                  borderRadius: ds.radius.lg,
                  backgroundColor: 'transparent'
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(243, 244, 246, 0.8)', justifyContent: 'center', alignItems: 'center' }}>
                  <item.icon />
                </View>
                <BodyLargeText style={{ flex: 1, fontFamily: Fonts.medium, fontSize: 16 }}>{item.title}</BodyLargeText>
                <View style={{ transform: [{ rotate: "180deg" }] }}>
                  <ASSETS.ICONS.ARROW_LEFT_PRIMARY width={20} height={20} />
                </View>
              </AnimatedTouchableOpacity>
            )
          }}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: '#F3F4F6', marginHorizontal: ds.space.lg }} />
          )}
          contentContainerStyle={{
            paddingTop: ds.space['7xl'],
            paddingBottom: tabSafePadding,
          }}
          ListFooterComponent={<View style={{ marginVertical: ds.space.xl, marginHorizontal: ds.space.md }}>
            <AppButton
              title='Sign Out'
              textStyle={{ color: "rgba(156, 0, 0, 1)", fontFamily: Fonts.bold }}
              style={{ backgroundColor: "rgba(255, 219, 219, 0.4)", borderRadius: ds.radius.lg }}
              onPress={() => router.replace("/auth/splash")}
            />
          </View>}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
