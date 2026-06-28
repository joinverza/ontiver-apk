import { Fonts } from '@/constants/fonts';
import { ASSETS } from '@/utils/assets';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BodyLargeText, BodySmallText, Label } from '../../components/shared/AppTexts';
import { Colors } from '../../constants/Colors';
import { useToast } from '../../context/ToastContext';
import { useDesignSystem } from '../../utils/design-system';

export default function HomeScreen() {
  const ds = useDesignSystem();
  const { showToast } = useToast();
  const router = useRouter();
  const [activeSlider, setActiveSlider] = useState(0);
  const { top } = useSafeAreaInsets()

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

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeSlider + 1;
      if (nextIndex >= homeSliderData.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * (ds.width * 0.9 + ds.space.lg),
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSlider, homeSliderData.length, ds.width, ds.space.lg]);

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(248, 250, 252, 1)", paddingHorizontal: ds.space.lg, paddingTop: top }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <BodySmallText>Welcome Back</BodySmallText>
          <BodyLargeText style={{ fontFamily: Fonts.bold }}>Gracious</BodyLargeText>
        </View>
        <TouchableOpacity onPress={() => router.push('/(screens)/notifications')}>
          <ASSETS.ICONS.NOTIFICATION_ICON width={28} height={28} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentActivities}
        renderItem={({ item, index }) => {
          const renderColors = () => {
            if (item.status === "Verified") return { bg: "rgba(208, 255, 221, 1)", text: "rgba(0, 125, 33, 1)", icon: ASSETS.ICONS.HOME_CHECKMARK }
            if (item.status === "Pending") return { bg: "rgba(255, 230, 208, 1)", text: "rgba(170, 81, 2, 1)", icon: ASSETS.ICONS.HOME_ALERT }
            if (item.status === "Declined") return { bg: "rgba(255, 208, 209, 1)", text: "rgba(125, 0, 2, 1)", icon: ASSETS.ICONS.HOME_CANCEL }
          }

          const colors = renderColors()
          const Icon = colors?.icon

          return (
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: ds.space.md, padding: ds.space.md, backgroundColor: Colors.white, borderRadius: ds.space.md }}>
              <ASSETS.ICONS.HOME_RECENT_ACTIVITY />
              <View style={{ flex: 1 }}>
                <BodyLargeText>{item.title}</BodyLargeText>
                <BodySmallText>{item.date}</BodySmallText>
              </View>
              <View style={{ flexDirection: "row", width: 90, backgroundColor: colors?.bg, height: 40, justifyContent: "center", alignItems: "center", borderRadius: 30, gap: ds.space.xs }}>
                {Icon && <Icon width={14} height={14} />}
                <BodySmallText style={{ color: colors?.text }} size={12}>{item.status}</BodySmallText>
              </View>
            </TouchableOpacity>
          )
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: ds.space.lg }} />}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: ds.space.xl, gap: ds.space.lg }}>
            {/* Home Slider */}
            <FlatList
              ref={flatListRef}
              data={homeSliderData}
              renderItem={({ item, index }) => {
                return (<TouchableOpacity
                  style={{}}
                  onPress={() => { }}
                >
                  <Image
                    source={item.image}
                    resizeMode="contain"
                    style={{ width: ds.width * 0.9, height: ds.width * 0.4, borderRadius: ds.space.md }}
                  />
                </TouchableOpacity>)
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: ds.space.lg }} />}
              snapToInterval={ds.width * 0.9 + ds.space.lg}
              decelerationRate="fast"
              // snapToAlignment="start"
              onScroll={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / (ds.width * 0.9 + ds.space.lg));
                setActiveSlider(index);
              }}
              scrollEventThrottle={16}
            />
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: ds.space.xs }}>
              {homeSliderData.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: index === activeSlider ? Colors.mainText : "rgba(225, 225, 225, 1)",
                  }}
                />
              ))}
            </View>


            <FlatList
              data={info}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity onPress={item.onPress} style={{ borderWidth: 1, flexDirection: "row", alignItems: "center", gap: ds.space.md, padding: ds.space.md, backgroundColor: Colors.white, borderRadius: ds.space.md, width: ds.width * 0.75, borderColor: "rgba(255, 211, 142, 1)" }}>
                    <ASSETS.ICONS.NOTIFICATION_ICON width={20} />
                    <View style={{ flex: 1 }}>
                      <Label>{item.title}</Label>
                      <BodySmallText size={10}>{item.description}</BodySmallText>
                    </View>
                  </TouchableOpacity>
                )
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: ds.space.lg }} />}
            />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BodyLargeText style={{ fontFamily: Fonts.semiBold, flex: 1 }}>My Credentials</BodyLargeText>
              <BodySmallText color={"rgba(5, 21, 14, 0.4)"}>See all</BodySmallText>
            </View>

            <FlatList
              data={myCredentials}
              renderItem={({ item, index }) => {
                const renderColors = () => {
                  if (item.status === "Verified") return { bg: "rgba(208, 255, 221, 1)", text: "rgba(0, 125, 33, 1)", icon: ASSETS.ICONS.HOME_CHECKMARK }
                  if (item.status === "Pending") return { bg: "rgba(255, 230, 208, 1)", text: "rgba(170, 81, 2, 1)", icon: ASSETS.ICONS.HOME_ALERT }
                  if (item.status === "Declined") return { bg: "rgba(255, 208, 209, 1)", text: "rgba(125, 0, 2, 1)", icon: ASSETS.ICONS.HOME_CANCEL }
                }

                const colors = renderColors()
                const Icon = colors?.icon

                return (
                  <TouchableOpacity style={{ gap: ds.space.md, padding: ds.space.md, backgroundColor: Colors.white, borderRadius: ds.space.md, width: ds.width * 0.5 }}>
                    <BodySmallText>{item.country}</BodySmallText>
                    <View style={{ flex: 1 }}>
                      <BodyLargeText>{item.title}</BodyLargeText>
                      <BodySmallText>{item.date}</BodySmallText>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: ds.space.xs }}>
                      {Icon && <Icon width={14} height={14} />}
                      <BodySmallText style={{ color: colors?.text }} size={12}>{item.status}</BodySmallText>
                    </View>
                  </TouchableOpacity>
                )
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: ds.space.lg }} />}
            />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BodyLargeText style={{ fontFamily: Fonts.semiBold, flex: 1 }}>Recent Activities</BodyLargeText>
              <TouchableOpacity onPress={() => router.push('/(screens)/activities')}>
                <BodySmallText color={"rgba(5, 21, 14, 0.4)"}>See all</BodySmallText>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: ds.space.xl, paddingBottom: ds.space['10xl'] }}
      />

      <TouchableOpacity style={{ position: "absolute", bottom: ds.space.xl, right: ds.space.xl }} onPress={() => router.push('/(screens)/scan')}>
        <ASSETS.ICONS.FLOATING_ACTION_ICON />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
