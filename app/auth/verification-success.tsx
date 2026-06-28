import AppButton from '@/components/shared/AppButton';
import { BodySmallText, H2Text } from '@/components/shared/AppTexts';
import Colors from '@/constants/Colors';
import { ASSETS } from '@/utils/assets';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDesignSystem } from '../../utils/design-system';

export default function VerificationSuccess() {
  const router = useRouter();
  const ds = useDesignSystem();

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: ds.space.xl, backgroundColor: Colors.white }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: ds.space.xl,
          gap: ds.space.xl
        }}
      >
        <ASSETS.AUTH.VERIFICATION_SUCCESS
          width={ds.width * 0.4}
          height={ds.width * 0.4}
        />
        <View style={{ gap: ds.space.md }}>
          <H2Text style={{ textAlign: "center" }}>
            You have been verified
          </H2Text>
          <BodySmallText style={{ textAlign: "center" }}>
            Your email has been successfully confirmed. Let’s secure your vault.
          </BodySmallText>
        </View>
        <AppButton
          title='Continue'
          onPress={() => router.push('/(tabs)')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
