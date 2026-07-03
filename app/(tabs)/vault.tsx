import AppButton from '@/components/shared/AppButton';
import { BodyLargeText, BodySmallText, H1Text } from '@/components/shared/AppTexts';
import BackButton from '@/components/shared/BackButton';
import { FilterTabs } from '@/components/shared/FilterTabs';
import { Fonts } from '@/constants/fonts';
import { ASSETS } from '@/utils/assets';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';

export default function VaultScreen() {
  const ds = useDesignSystem();
  const insets = useSafeAreaInsets();
  const width = Dimensions.get('window').width;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Verified', 'Pending 05', 'Expired'];

  const data = [
    { id: 1, title: "National Identification", date: "15th Apr. 2026", status: "Verified" },
    { id: 2, title: "Passport", date: "15th Apr. 2026", status: "Pending" },
    { id: 3, title: "National Identification", date: "15th Apr. 2026", status: "Verified" },
    { id: 4, title: "Passport", date: "15th Apr. 2026", status: "Pending" },
    { id: 5, title: "National Identification", date: "15th Apr. 2026", status: "Verified" },
    { id: 6, title: "Passport", date: "15th Apr. 2026", status: "Pending" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: insets.top, paddingHorizontal: ds.space.lg }}>
        <BackButton color='white' />
        <H1Text style={{ textAlign: "center", color: Colors.white, flex: 1, fontFamily: Fonts.bold }}>My Vault</H1Text>
        <View style={{ width: 40 }} />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          borderTopLeftRadius: ds.radius['4xl'],
          borderTopRightRadius: ds.radius['4xl'],
          marginTop: ds.space.md
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -(ds.space.xl),
            left: ds.space.xl,
            backgroundColor: Colors.white,
            zIndex: 100,
            borderRadius: ds.radius.xl,
            width: width - (2 * ds.space.xl),
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 5,
            paddingHorizontal: ds.space.md,
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#E5E7EB',
            borderWidth: 1
          }}
        >
          <Feather name="search" size={20} color="rgba(0, 0, 0, 0.4)" />
          <TextInput
            placeholder='Search Vault'
            placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
            style={{
              flex: 1,
              fontFamily: Fonts.regular,
              fontSize: ds.typography.bodySmall.fontSize,
              color: Colors.black,
              paddingVertical: ds.space.md,
              paddingHorizontal: ds.space.sm,
            }}
          />
          <Feather name="x" size={20} color="rgba(0, 0, 0, 0.4)" />
        </View>

        <FlatList
          data={data}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", gap: ds.space.md }}
          renderItem={({ item, index }) => {
            const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
            return (
              <AnimatedTouchableOpacity
                entering={FadeInUp.delay(index * 100).duration(400)}
                onPress={() => router.push('/(screens)/credential-details')}
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: ds.radius.xl,
                  borderColor: '#E5E7EB',
                  borderWidth: 1,
                  paddingVertical: ds.space.md,
                  paddingHorizontal: ds.space.md,
                  flex: 1,
                  gap: ds.space.sm,
                  shadowColor: Colors.black,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.03,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <ASSETS.ICONS.CONTACT_ICON />
                  <View style={{
                    paddingHorizontal: ds.space.sm,
                    paddingVertical: ds.space.xs / 2,
                    borderRadius: ds.radius.full,
                    backgroundColor: item.status == "Verified" ? "rgba(208, 255, 221, 1)" : "rgba(255, 230, 208, 1)",
                  }}>
                    <BodySmallText size={10} color={item.status == "Verified" ? "rgba(0, 125, 33, 1)" : "rgba(170, 81, 2, 1)"} style={{ fontFamily: Fonts.medium }}>
                      {item.status}
                    </BodySmallText>
                  </View>
                </View>
                <View style={{ marginVertical: ds.space.xs }}>
                  <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 14 }}>{item.title}</BodyLargeText>
                  <BodySmallText size={11} color="rgba(5, 21, 14, 0.5)" style={{ marginTop: 2 }}>{item.date}</BodySmallText>
                </View>
                <AppButton
                  title='View'
                  onPress={() => router.push('/(screens)/credential-details')}
                  variant='outline'
                  style={{ borderColor: "#E5E7EB", height: 32, paddingTop: 4, borderRadius: ds.radius.md }}
                  textStyle={{ color: "rgba(5, 21, 14, 1)", opacity: 0.5, fontSize: 12, fontFamily: Fonts.medium }}
                />
              </AnimatedTouchableOpacity>
            )
          }}
          ListHeaderComponent={() => (
            <View style={{ marginBottom: ds.space.lg }}>
              <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: ds.space.md }} />
          )}
          contentContainerStyle={{
            paddingHorizontal: ds.space.lg,
            paddingTop: ds.space['4xl'] + ds.space.lg,
            paddingBottom: 140 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        />

        {/* Floating Action Button */}
        <Animated.View 
          entering={FadeInUp.delay(500).springify()}
          style={{ position: "absolute", bottom: ds.space['7xl'] + insets.bottom + ds.space.lg, right: ds.space.xl, zIndex: 100 }}
        >
          <TouchableOpacity
            style={{ backgroundColor: Colors.primary, width: 64, height: 64, borderRadius: 32, justifyContent: "center", alignItems: "center", shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }}
            onPress={() => router.push('/(screens)/add-credential')}>
            <Feather name="plus" size={32} color={Colors.white} />
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

