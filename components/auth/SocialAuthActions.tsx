import * as AppleAuthentication from 'expo-apple-authentication';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/shared/AppButton';
import { Colors } from '@/constants/Colors';
import type { SocialMode, SocialProvider } from '@/lib/social-auth';
import { SocialAuthCancelledError } from '@/lib/social-auth';
import { useAuthStore } from '@/store/authStore';

export function SocialAuthActions({
  mode,
  consentAccepted = true,
  onSuccess,
}: {
  mode: SocialMode;
  consentAccepted?: boolean;
  onSuccess?: () => void | Promise<void>;
}) {
  const socialLogin = useAuthStore((state) => state.socialLogin);
  const [activeProvider, setActiveProvider] = useState<SocialProvider | null>(null);
  const disabled = activeProvider !== null || (mode === 'signup' && !consentAccepted);

  const run = async (provider: SocialProvider) => {
    setActiveProvider(provider);
    try {
      await socialLogin(provider, mode, consentAccepted);
      await onSuccess?.();
    } catch (error) {
      if (!(error instanceof SocialAuthCancelledError)) throw error;
    } finally {
      setActiveProvider(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider} accessibilityElementsHidden>
        <View style={styles.line} />
        <Text style={styles.dividerText}>or continue securely with</Text>
        <View style={styles.line} />
      </View>
      <AppButton
        title={activeProvider === 'google' ? 'Connecting to Google…' : 'Continue with Google'}
        variant="outline"
        disabled={disabled}
        loading={activeProvider === 'google'}
        onPress={() => void run('google')}
        accessibilityLabel={`${mode === 'signup' ? 'Sign up' : 'Sign in'} with Google`}
        leftIcon={<Feather name="chrome" size={20} color={Colors.mainText} />}
      />
      {Platform.OS === 'ios' ? (
        <View style={[styles.appleWrap, disabled && styles.disabled]} pointerEvents={disabled ? 'none' : 'auto'}>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={mode === 'signup' ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP : AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={14}
            style={styles.appleButton}
            onPress={() => void run('apple')}
          />
        </View>
      ) : null}
      {mode === 'signup' && !consentAccepted ? <Text style={styles.hint}>Accept the Terms and Privacy Policy to use social signup.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 2 },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#D8E0DC' },
  dividerText: { color: Colors.secondaryText, fontSize: 12, textAlign: 'center' },
  appleWrap: { minHeight: 50 },
  appleButton: { width: '100%', height: 50 },
  disabled: { opacity: 0.45 },
  hint: { color: Colors.secondaryText, fontSize: 12, textAlign: 'center' },
});
