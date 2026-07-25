import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import { useAuthStore } from '@/store/authStore';

export function AppLockScreen() {
  const user = useAuthStore((state) => state.user);
  const unlock = useAuthStore((state) => state.unlock);
  const logout = useAuthStore((state) => state.logout);
  const [authenticating, setAuthenticating] = useState(false);

  const authenticate = async () => {
    setAuthenticating(true);
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert('Device security unavailable', 'Set up biometrics or a device passcode before unlocking Ontiver.');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Ontiver',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use device passcode',
        disableDeviceFallback: false,
      });
      if (result.success) unlock();
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.eyebrow}>ONTIVER LOCKED</Text>
      <Text style={styles.title}>{user?.fullName ? `Welcome back, ${user.fullName}` : 'Welcome back'}</Text>
      <Text style={styles.copy}>Use this device's security to unlock your identity wallet. Your backend session remains protected separately.</Text>
      <Pressable disabled={authenticating} style={[styles.primary, authenticating && styles.disabled]} onPress={() => void authenticate()}>
        <Text style={styles.primaryText}>{authenticating ? 'Checking…' : 'Unlock with device security'}</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => void logout()}><Text style={styles.secondaryText}>Log out instead</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: 'center', padding: 28, gap: 18, backgroundColor: '#052E22' },
  eyebrow: { color: '#6CE9A6', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  copy: { color: '#D1FADF', fontSize: 16, lineHeight: 24 },
  primary: { marginTop: 12, borderRadius: 14, padding: 16, alignItems: 'center', backgroundColor: '#17B26A' },
  primaryText: { color: '#FFFFFF', fontWeight: '800' },
  secondary: { borderRadius: 14, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#47CD89' },
  secondaryText: { color: '#D1FADF', fontWeight: '700' },
  disabled: { opacity: 0.55 },
});
