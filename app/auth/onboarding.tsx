import AppButton from '@/components/shared/AppButton';
import { BodySmallText, H3Text } from '@/components/shared/AppTexts';
import { ASSETS } from '@/utils/assets';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDesignSystem } from '../../utils/design-system';

export default function OnboardingScreen() {
  const router = useRouter();
  const ds = useDesignSystem();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const handleNext = () => {
    if (currentSlideIndex < onboardinData.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      router.push("/auth/create-account");
    }
  }

  const onboardinData = [
    {
      id: 1,
      image: ASSETS.AUTH.ONBOARDING_1,
      title: "Verify Once. Share Forever",
      subTitle: "Stop submitting your ID over and over. Verify once and share instantly with any platform",
      btnText: "Get Started",
    },
    {
      id: 2,
      image: ASSETS.AUTH.ONBOARDING_2,
      title: "Your Identity. All in One Place.",
      subTitle: "Store your government ID, phone, address, and more — safely encrypted on your device.",
      btnText: "Next",
    },
    {
      id: 3,
      image: ASSETS.AUTH.ONBOARDING_3,
      title: "You Decide Who Sees What.",
      subTitle: "Share only what's needed — nothing more. Zero-knowledge proofs protect your privacy.",
      btnText: "Next",
    },
  ]


  const currentSlideData = onboardinData[currentSlideIndex];
  const SlideImage = currentSlideData.image;

  return (
    <SafeAreaView
      style={{
        backgroundColor: ds.colors.background,
        flex: 1,
        padding: ds.space.xl,

      }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={SlideImage} style={{
          width: ds.width * 0.9,
          height: "100%",
        }}
          resizeMode='contain'
        />
      </View>

      <View style={{ gap: ds.space.lg }}>
        <View
          style={{
            flexDirection: "row",
            gap: ds.space.sm,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {onboardinData.map((_, index) => (
            <View
              key={index}
              style={{
                height: ds.space.xs,
                width: ds.width * 0.1,
                backgroundColor: currentSlideIndex === index ? ds.colors.primary : ds.colors.backgroundTint,
                borderRadius: ds.space.xs / 2,
              }}
            />
          ))}
        </View>
        <H3Text>
          {currentSlideData.title}
        </H3Text>
        <BodySmallText>
          {currentSlideData.subTitle}
        </BodySmallText>
        <AppButton
          title={currentSlideData.btnText}
          variant='primary'
          onPress={handleNext}
        />
        <BodySmallText
          onPress={() => router.push("/auth/login")}
          style={{ textAlign: "center" }}
          color={ds.colors.primary}
        >
          Already have an account? Log in
        </BodySmallText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
