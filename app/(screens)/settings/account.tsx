import { Feather } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/shared/AppButton';
import AppInput from '@/components/shared/AppInput';
import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { changePassword, getIdentities, setPassword } from '@/lib/account-api';
import { getBootstrap } from '@/lib/mobile-api';
import { linkSocialIdentity, unlinkSocialIdentity, type SocialProvider } from '@/lib/social-auth';
import { useAuthStore } from '@/store/authStore';

export default function AccountSettingsScreen() {
  const queryClient = useQueryClient();
  const bootstrap = useQuery({ queryKey: ['mobile-bootstrap'], queryFn: getBootstrap });
  const identities = useQuery({ queryKey: ['identities'], queryFn: getIdentities });
  const logout = useAuthStore((state) => state.logout);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');

  const refreshIdentities = async () => queryClient.invalidateQueries({ queryKey: ['identities'] });
  const link = useMutation({
    mutationFn: (provider: SocialProvider) => linkSocialIdentity(provider),
    onSuccess: async () => { await refreshIdentities(); Alert.alert('Account linked', 'You can now use this provider to sign in.'); },
    onError: (error) => Alert.alert('Could not link account', error.message),
  });
  const unlink = useMutation({
    mutationFn: ({ provider, email }: { provider: SocialProvider; email: string }) => unlinkSocialIdentity(provider, email),
    onSuccess: async () => { await refreshIdentities(); Alert.alert('Account unlinked', 'The provider can no longer be used to sign in.'); },
    onError: (error) => Alert.alert('Could not unlink account', error.message),
  });
  const password = useMutation({
    mutationFn: async () => { if (identities.data?.passwordLoginEnabled) await changePassword(current, next); else await setPassword(next); },
    onSuccess: async () => { setCurrent(''); setNext(''); await refreshIdentities(); Alert.alert('Password updated', 'Other signed-in devices were securely revoked.'); },
    onError: (error) => Alert.alert('Password not updated', error.message),
  });

  const confirmUnlink = (provider: SocialProvider, email: string, canUnlink: boolean) => {
    if (!canUnlink) {
      Alert.alert('Add another sign-in method', 'Set a password or link another provider before removing your only sign-in method.');
      return;
    }
    Alert.alert(`Unlink ${provider === 'google' ? 'Google' : 'Apple'}?`, `You will no longer be able to sign in as ${email} using this provider.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unlink', style: 'destructive', onPress: () => unlink.mutate({ provider, email }) },
    ]);
  };

  const linked = identities.data?.items ?? [];
  const linkedProviders = new Set(linked.map((item) => item.provider));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconButton}><Feather name="arrow-left" size={22} color={Colors.mainText} /></Pressable>
          <View><Text style={styles.heading}>Account</Text><Text style={styles.subheading}>Profile and sign-in methods</Text></View>
        </View>
        <RemoteState loading={bootstrap.isLoading || identities.isLoading} error={(bootstrap.error || identities.error) as Error | null} onRetry={() => { void bootstrap.refetch(); void identities.refetch(); }}>
          <View style={styles.card}>
            <Text style={styles.eyebrow}>ONTIVER ACCOUNT</Text>
            <Text style={styles.email}>{bootstrap.data?.profile.email}</Text>
            <Text style={styles.copy}>Verified account details are used for security alerts and recovery.</Text>
          </View>

          <View style={styles.sectionHeader}><View><Text style={styles.section}>Linked sign-in methods</Text><Text style={styles.copy}>Use more than one method to avoid losing access.</Text></View><View style={styles.countBadge}><Text style={styles.countText}>{identities.data?.signInMethodCount ?? 0}</Text></View></View>
          {linked.map((item) => (
            <View key={item.id} style={styles.identityCard}>
              <View style={styles.providerIcon}><Feather name={item.provider === 'google' ? 'chrome' : 'smartphone'} size={20} color={Colors.primary} /></View>
              <View style={styles.identityText}><Text style={styles.title}>{item.provider === 'google' ? 'Google' : 'Apple'}</Text><Text style={styles.copy}>{item.email}</Text><Text style={styles.status}>{item.status === 'active' || item.status === 'active_no_grant' ? 'Connected' : item.status.replaceAll('_', ' ')}</Text></View>
              <Pressable accessibilityRole="button" accessibilityLabel={`Unlink ${item.provider}`} onPress={() => confirmUnlink(item.provider, item.email, item.canUnlink)} hitSlop={10}><Text style={[styles.unlink, !item.canUnlink && styles.muted]}>Unlink</Text></Pressable>
            </View>
          ))}
          {!linkedProviders.has('google') ? <AppButton title="Link Google account" variant="outline" loading={link.isPending && link.variables === 'google'} disabled={link.isPending} onPress={() => link.mutate('google')} /> : null}
          {Platform.OS === 'ios' && !linkedProviders.has('apple') ? <AppButton title="Link Apple account" variant="outline" loading={link.isPending && link.variables === 'apple'} disabled={link.isPending} onPress={() => link.mutate('apple')} /> : null}

          <View style={styles.card}>
            <Text style={styles.section}>{identities.data?.passwordLoginEnabled ? 'Change password' : 'Set a password'}</Text>
            <Text style={styles.copy}>{identities.data?.passwordLoginEnabled ? 'Changing it signs out your other devices.' : 'Add email and password as a backup sign-in method.'}</Text>
            {identities.data?.passwordLoginEnabled ? <AppInput label="Current password" value={current} onChangeText={setCurrent} isPassword /> : null}
            <AppInput label="New password" value={next} onChangeText={setNext} isPassword />
            <AppButton title={identities.data?.passwordLoginEnabled ? 'Change password' : 'Set password'} loading={password.isPending} disabled={(identities.data?.passwordLoginEnabled && !current) || next.length < 12} onPress={() => password.mutate()} />
          </View>

          <View style={styles.dangerCard}>
            <Text style={styles.dangerTitle}>Account access</Text>
            <Text style={styles.copy}>Sign out here or manage permanent account deletion from Privacy & data.</Text>
            <AppButton title="Privacy & data controls" variant="outline" onPress={() => router.push('/settings/privacy' as never)} />
            <AppButton title="Sign out" style={styles.signOut} textStyle={styles.signOutText} onPress={() => void logout()} />
          </View>
        </RemoteState>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F8F6' },
  page: { padding: 20, paddingBottom: 48, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 4 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E4EBE7' },
  heading: { color: Colors.mainText, fontSize: 28, fontWeight: '800' },
  subheading: { color: Colors.secondaryText, marginTop: 2 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 18, gap: 14, borderWidth: 1, borderColor: '#E4EBE7' },
  eyebrow: { color: Colors.primary, fontWeight: '800', fontSize: 11, letterSpacing: 1.1 },
  email: { color: Colors.mainText, fontWeight: '800', fontSize: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  section: { color: Colors.mainText, fontSize: 18, fontWeight: '800' },
  copy: { color: Colors.secondaryText, fontSize: 13, lineHeight: 19 },
  countBadge: { backgroundColor: '#E9F7EF', borderRadius: 12, minWidth: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  countText: { color: Colors.primary, fontWeight: '800' },
  identityCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E4EBE7' },
  providerIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#EDF8F1', alignItems: 'center', justifyContent: 'center' },
  identityText: { flex: 1, gap: 2 },
  title: { color: Colors.mainText, fontWeight: '800', fontSize: 16 },
  status: { color: '#16803C', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  unlink: { color: '#B42318', fontWeight: '800', fontSize: 13 },
  muted: { color: '#98A2B3' },
  dangerCard: { backgroundColor: '#FFFDFC', borderRadius: 20, padding: 18, gap: 12, borderWidth: 1, borderColor: '#F1D7D2' },
  dangerTitle: { color: '#7A271A', fontSize: 18, fontWeight: '800' },
  signOut: { backgroundColor: '#FEE4E2' },
  signOutText: { color: '#B42318' },
});
