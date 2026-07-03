import AppButton from '@/components/shared/AppButton';
import AppCheckmark from '@/components/shared/AppCheckmark';
import AppInput from '@/components/shared/AppInput';
import { BodySmallText, H1Text } from '@/components/shared/AppTexts';
import { ASSETS } from '@/utils/assets';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';

export default function CreateAccountScreen() {
  const router = useRouter();
  const ds = useDesignSystem();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const socialLoginData = [
    {
      id: 1,
      image: ASSETS.ICONS.GOOGLE_LOGO,
      title: "Google",
    },
    {
      id: 2,
      image: ASSETS.ICONS.APPLE_LOGO,
      title: "Apple",
    }
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            height: ds.space['6xl'],
            width: ds.space['6xl'],
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => router.back()}
        >
          <ASSETS.ICONS.ARROW_LEFT_WHITE />
        </TouchableOpacity>
        <Animated.View entering={FadeInDown.duration(400)} style={{ flex: 1 }}>
          <H1Text color={Colors.white}
            style={{ textAlign: "center", paddingVertical: ds.space.xl }}
          >
            Log In
          </H1Text>
        </Animated.View>
        <View
          style={{
            height: ds.space['6xl'],
            width: ds.space['6xl'],
            justifyContent: "center",
            alignItems: "center"
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          borderTopLeftRadius: ds.radius['4xl'],
          borderTopRightRadius: ds.radius['4xl'],
          padding: ds.space.xl,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: ds.space.xl
            }}
          >
            <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ gap: ds.space.xl }}>
            <AppInput
              label='Email Address'
              placeholder='yourname@email.com'
              value={email}
              onChangeText={setEmail}
            />
            <AppInput
              label='Password'
              placeholder='Min. 8 characters'
              value={password}
              onChangeText={setPassword}
              isPassword
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: ds.space.sm
              }}
            >
              <AppCheckmark
                isChecked={isChecked}
                onPress={() => setIsChecked(!isChecked)}
              />
              <BodySmallText
                style={{
                  flex: 1
                }}
              >
                I agree to Ontiver's Terms of Service and Privacy Policy.
              </BodySmallText>
            </View>

            <AppButton
              title='Log in'
              onPress={() => router.push("/auth/biometric-auth")}
              disabled={!isChecked || !email || !password}
            />

            <View
              style={{
                paddingVertical: ds.space.xl,
                gap: ds.space.xl
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ds.space.sm
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#E8E8E8"
                  }}
                />
                <BodySmallText>or continue with</BodySmallText>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#E8E8E8"
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ds.space.md
                }}
              >
                {socialLoginData.map((item, index) => (
                  <TouchableOpacity key={index}>
                    <Image
                      key={item.id}
                      style={{
                        height: ds.space['5xl'],
                        width: ds.space['5xl'],
                      }}
                      source={item.image}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                ))}

              </View>

              <BodySmallText
                style={{ textAlign: "center" }}
                color={Colors.mainText}
                onPress={() => router.push("/auth/create-account")}
              >
                New to Vault? <Text style={{ color: Colors.primary }}>Create Account</Text>
              </BodySmallText>
            </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary
  },
});
