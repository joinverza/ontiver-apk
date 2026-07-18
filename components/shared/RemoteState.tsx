import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';

export function RemoteState({
  loading,
  error,
  empty,
  onRetry,
  children,
}: {
  loading: boolean;
  error: Error | null;
  empty?: boolean;
  onRetry: () => void;
  children: ReactNode;
}) {
  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.primary} /><Text>Loading…</Text></View>;
  if (error) return <View style={styles.center}><Text style={styles.title}>Unable to load</Text><Text style={styles.copy}>{error.message}</Text><Pressable style={styles.button} onPress={onRetry}><Text style={styles.buttonText}>Retry</Text></Pressable></View>;
  if (empty) return <View style={styles.center}><Text style={styles.title}>Nothing here yet</Text><Text style={styles.copy}>Pull to refresh when new information is available.</Text></View>;
  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, minHeight: 240, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { color: Colors.mainText, fontSize: 18, fontWeight: '700' },
  copy: { color: Colors.secondaryText, textAlign: 'center' },
  button: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
