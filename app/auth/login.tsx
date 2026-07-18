import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import AppButton from '@/components/shared/AppButton';
import AppInput from '@/components/shared/AppInput';
import { SocialAuthActions } from '@/components/auth/SocialAuthActions';
import { BodySmallText, H1Text } from '@/components/shared/AppTexts';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { useDesignSystem } from '@/utils/design-system';

export default function LoginScreen() {
  const ds = useDesignSystem();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.lastError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await login(email, password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <H1Text color={Colors.white} style={{ textAlign: 'center', paddingVertical: ds.space.xl }}>
        Log in
      </H1Text>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.panel}>
        <View style={{ gap: ds.space.xl }}>
          <AppInput
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <AppInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <AppButton
            title={submitting ? 'Signing in…' : 'Log in'}
            onPress={() => void submit()}
            disabled={submitting || !email.trim() || !password}
          />
          <SocialAuthActions mode="login" />
          <Link href="/auth/account-recovery/enter-email" asChild>
            <BodySmallText color={Colors.primary} style={{ textAlign: 'center' }}>Forgot password?</BodySmallText>
          </Link>
          <Link href="/auth/create-account" asChild>
            <BodySmallText style={{ textAlign: 'center' }}>
              New to Ontiver? <Text style={{ color: Colors.primary }}>Create account</Text>
            </BodySmallText>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  panel: {
    flex: 1,
    gap: 24,
    padding: 24,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  error: { color: '#B42318', fontSize: 14 },
});
