import AppButton from '@/components/shared/AppButton';
import { BodyLargeText, BodySmallText, H2Text } from '@/components/shared/AppTexts';
import { Fonts } from '@/constants/fonts';
import { ASSETS } from '@/utils/assets';
import { router } from 'expo-router';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';

const width = Dimensions.get("window").width

export default function SettingsScreen() {
  const ds = useDesignSystem();
  const insets = useSafeAreaInsets()

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
      <H2Text style={{ textAlign: "center", color: Colors.white, paddingTop: insets.top + ds.space.lg, paddingBottom: ds.space['6xl'] }}>Settings</H2Text>
      <View style={{ flex: 1, backgroundColor: Colors.white, borderTopLeftRadius: ds.radius.xl, borderTopRightRadius: ds.radius.xl, padding: ds.space.xl }}>
        <View
          style={{
            paddingHorizontal: ds.space.xl,
            position: "absolute",
            top: -(ds.space['4xl']),
            left: ds.space.xl,
            backgroundColor: Colors.white,
            zIndex: 100,
            borderRadius: ds.radius['4xl'],
            width: width - (2 * ds.space.xl),
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 20,
            paddingVertical: ds.space.sm,
            flexDirection: "row",
            alignItems: "center",
            gap: ds.space.md
          }}
        >
          <Image
            source={ASSETS.IMAGES.PROFILE_IMG}
            style={{ width: ds.width * 0.17, height: ds.width * 0.17, borderRadius: ds.radius['2xl'] }}
          />
          <View style={{ flex: 1, gap: ds.space.xs }}>
            <BodyLargeText>Nathan Adeyemi</BodyLargeText>
            <BodySmallText size={12}>nathan.adeyemi@gmail.com</BodySmallText>
            <AppButton
              title='Edit Profile'
              style={{ width: "80%", backgroundColor: "transparent", borderColor: Colors.primary, borderWidth: 0.5 }}
              textStyle={{ fontSize: 12, color: Colors.primary, fontFamily: Fonts.regular }}
            />
          </View>
          <ASSETS.ICONS.SILVER_BADGE />
        </View>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={item.onPress}
              style={{
                flexDirection: "row",
                gap: ds.space.lg,
                paddingVertical: ds.space.lg,
                alignItems: "center"
              }}
            >
              <item.icon />
              <BodyLargeText style={{ flex: 1 }}>{item.title}</BodyLargeText>
              <View style={{ transform: [{ rotate: "180deg" }] }}>
                <ASSETS.ICONS.ARROW_LEFT_PRIMARY />
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: Colors.grey200 }} />
          )}
          contentContainerStyle={{
            // paddingHorizontal: ds.space.xl,
            paddingTop: ds.space['7xl'],
            // paddingVertical: ds.space.xl,
          }}
          ListFooterComponent={<View style={{ marginVertical: ds.space.xl }}>
            <AppButton
              title='Signout'
              textStyle={{ color: "rgba(156, 0, 0, 1)" }}
              style={{ backgroundColor: "rgba(255, 219, 219, 0.4)" }}
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
