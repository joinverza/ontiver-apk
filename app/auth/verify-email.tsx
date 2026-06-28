import AppButton from '@/components/shared/AppButton';
import { BodySmallText, H2Text } from '@/components/shared/AppTexts';
import BackButton from '@/components/shared/BackButton';
import OtpInput from '@/components/shared/OtpInput';
import Colors from '@/constants/Colors';
import { useToast } from '@/context/ToastContext';
import { ASSETS } from '@/utils/assets';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDesignSystem } from '../../utils/design-system';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const ds = useDesignSystem();
  const toast = useToast();
  const [countDown, setCountDown] = useState(59)
  const [code, setCode] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: ds.space.xl, backgroundColor: Colors.white }}>
      <KeyboardAvoidingView style={{
        flex: 1,
        padding: ds.space.xl,
        paddingTop: ds.space.xl,
      }}
        // keyboardVerticalOffset={100}
        behavior='height'
      >

        <View style={{ flex: 1, gap: ds.space['2xl'] }}>
          <BackButton />

          <ASSETS.AUTH.MAIL_SVG
            width={ds.width * 0.9}
            height={150}
          />
          <View
            style={{ paddingHorizontal: ds.space.xl, gap: ds.space.md }}
          >
            <H2Text style={{ textAlign: "center" }}>
              Check Your Email
            </H2Text>
            <BodySmallText
              style={{ textAlign: "center" }}
            >
              We sent a 6-digit code to designerslive@gmail.com. It expires in 10 minutes
            </BodySmallText>
          </View>

          <OtpInput
            length={6}
            code={code}
            setCode={setCode}
            inputContainerStyle={{
              backgroundColor: "transparent"
            }}
            inputStyle={{
            }}
            isSecure
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: ds.space.sm
            }}
          >
            <AntDesign name="clock-circle" size={16} color="#919191" />
            <BodySmallText
              color='#919191'
            >
              00:{countDown}
            </BodySmallText>

          </View>

          <BodySmallText
            color='#919191'
            style={{ textAlign: "center" }}
            onPress={() => toast.showToast({ message: "Success", type: "success" })}
          >
            Didn't get the code? Resend
          </BodySmallText>
        </View>
        <AppButton
          title='Verify Code'
          disabled={code.length !== 6}
          onPress={() => router.push("/auth/verification-success")}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
