import AppButton from '@/components/shared/AppButton';
import AppCheckmark from '@/components/shared/AppCheckmark';
import AppInput from '@/components/shared/AppInput';
import { BodySmallText, H1Text } from '@/components/shared/AppTexts';
import { ASSETS } from '@/utils/assets';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <H1Text color={Colors.white}
        style={{ textAlign: "center", paddingVertical: ds.space.xl }}
      >
        Create Account
      </H1Text>

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
          behavior='height'
          style={{ flex: 1 }}
          keyboardVerticalOffset={100}
        >
          <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: ds.space.xl
            }}
          >
            <AppInput
              label='Full Name'
              placeholder='e.g. Adaeze Okonkwo'
              value={fullName}
              onChangeText={setFullName}
            />
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
            <AppInput
              label='Confirm Password'
              placeholder='Re-enter password'
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
              title='Create Account'
              onPress={() => router.push("/auth/verify-email")}
              disabled={!isChecked || !fullName || !email || !password || !confirmPassword}
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
                onPress={() => router.push("/auth/login")}
              >
                Already have an account? <Text style={{ color: Colors.primary }}>Log in</Text>
              </BodySmallText>
            </View>
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
