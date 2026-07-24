import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ClaimedHandoff, cancelHandoff, claimHandoff, completeHandoff } from '../lib/handoff-api';
import { getOrCreateDeviceBinding } from '../lib/session';
import { useAuthStore } from '../store/authStore';

type State = 'claiming' | 'sign_in' | 'ready' | 'completing' | 'complete' | 'error';

export default function ContinueHandoffScreen() {
  const { handoff = '' } = useLocalSearchParams<{ handoff?: string }>();
  const router = useRouter();
  const authStatus = useAuthStore((value) => value.status);
  const [state, setState] = useState<State>('claiming');
  const [claimed, setClaimed] = useState<ClaimedHandoff | null>(null);
  const [binding, setBinding] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        if (!handoff.startsWith('handoff_')) throw new Error('This handoff link is invalid.');
        if (authStatus === 'restoring') return;
        if (authStatus === 'anonymous') {
          setState('sign_in');
          return;
        }
        setState('claiming');
        const deviceBinding = await getOrCreateDeviceBinding();
        const result = await claimHandoff(handoff, deviceBinding);
        if (!active) return;
        setBinding(deviceBinding);
        setClaimed(result);
        setState('ready');
      } catch (error) {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : 'The handoff could not be opened.');
        setState('error');
      }
    })();
    return () => {
      active = false;
    };
  }, [authStatus, handoff]);

  async function finish() {
    if (!claimed || !binding) return;
    setState('completing');
    try {
      await completeHandoff(claimed.handoffId, handoff, binding);
      setState('complete');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The handoff could not be completed.');
      setState('error');
    }
  }

  async function cancel() {
    if (claimed) {
      try {
        await cancelHandoff(claimed.handoffId);
      } catch {
        // The server-side five-minute expiry remains the fallback cancellation boundary.
      }
    }
    router.replace('/');
  }

  const busy = state === 'claiming' || state === 'completing';
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>CONTINUE WITH ONTIVER</Text>
        <Text style={styles.title}>
          {state === 'complete' ? 'You’re all set' : 'Confirm on this device'}
        </Text>
        {busy ? <ActivityIndicator size="large" color="#176b4d" style={styles.spinner} /> : null}
        {state === 'ready' ? (
          <>
            <Text style={styles.copy}>
              Continue the verified request for {claimed?.clientId}. The request is bound to this installation and can only be completed once.
            </Text>
            <Pressable accessibilityRole="button" style={styles.primary} onPress={() => void finish()}>
              <Text style={styles.primaryText}>Continue securely</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => void cancel()}>
              <Text style={styles.secondaryText}>Cancel</Text>
            </Pressable>
          </>
        ) : null}
        {state === 'sign_in' ? (
          <>
            <Text style={styles.copy}>Sign in to the same Personal Ontiver account that started this request. The handoff remains opaque and expires after five minutes.</Text>
            <Pressable
              accessibilityRole="button"
              style={styles.primary}
              onPress={() => router.push({ pathname: '/auth/login', params: { resumeHandoff: handoff } })}
            >
              <Text style={styles.primaryText}>Sign in to continue</Text>
            </Pressable>
          </>
        ) : null}
        {state === 'complete' ? (
          <>
            <Text style={styles.copy}>Return to the browser to finish. No identity or session token was placed in the link.</Text>
            <Pressable accessibilityRole="button" style={styles.primary} onPress={() => router.replace('/')}>
              <Text style={styles.primaryText}>Done</Text>
            </Pressable>
          </>
        ) : null}
        {state === 'error' ? (
          <>
            <Text accessibilityRole="alert" style={styles.error}>{message}</Text>
            <Pressable accessibilityRole="button" style={styles.secondary} onPress={() => router.replace('/')}>
              <Text style={styles.secondaryText}>Return home</Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: 'center', backgroundColor: '#f5f7f4', padding: 24 },
  card: { borderRadius: 24, borderWidth: 1, borderColor: '#d9e3de', backgroundColor: '#fff', padding: 28 },
  eyebrow: { color: '#176b4d', fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  title: { marginTop: 12, color: '#18342b', fontSize: 28, fontWeight: '700' },
  copy: { marginTop: 14, color: '#53665f', fontSize: 16, lineHeight: 24 },
  spinner: { marginVertical: 30 },
  primary: { marginTop: 24, borderRadius: 12, backgroundColor: '#176b4d', padding: 15, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondary: { marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: '#b8c9c1', padding: 14, alignItems: 'center' },
  secondaryText: { color: '#214e3e', fontSize: 16, fontWeight: '600' },
  error: { marginTop: 18, color: '#9d2d20', fontSize: 16, lineHeight: 24 },
});
