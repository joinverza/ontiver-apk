import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/shared/AppHeader';
import AppSwitch from '@/components/shared/AppSwitch';
import { RemoteState } from '@/components/shared/RemoteState';
import { getPrivacySettings, requestAccountDeletion, requestDataExport, updatePrivacySettings } from '@/lib/account-api';
import { legalUrls } from '@/lib/config';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['privacy-settings'], queryFn: getPrivacySettings });
  const update = useMutation({
    mutationFn: updatePrivacySettings,
    onSuccess: (settings) => queryClient.setQueryData(['privacy-settings'], settings),
    onError: (error) => Alert.alert('Could not update privacy settings', error.message),
  });
  const exportRequest = useMutation({
    mutationFn: requestDataExport,
    onSuccess: () => Alert.alert('Export requested', 'Your request was submitted for privacy review. You will be notified when it is ready.'),
    onError: (error) => Alert.alert('Could not request export', error.message),
  });
  const deletionRequest = useMutation({
    mutationFn: requestAccountDeletion,
    onSuccess: (result) => Alert.alert('Deletion request received', `Request ${result.requestId} is pending retention review. Linked sign-in provider access is being revoked.`),
    onError: (error) => Alert.alert('Could not request deletion', error.message),
  });
  const settings = query.data;

  const confirmDeletion = () => Alert.alert(
    'Request permanent account deletion?',
    'Ontiver will revoke linked sign-in providers, end active sessions, and delete or legally anonymize account data after retention review. This cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Request deletion', style: 'destructive', onPress: () => deletionRequest.mutate() },
    ],
  );

  return (
    <SafeAreaView style={styles.page}>
      <AppHeader title="Privacy & data" />
      <RemoteState loading={query.isLoading} error={query.error as Error | null} empty={!settings} onRetry={() => void query.refetch()}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.intro}><Text style={styles.introTitle}>You control your identity data</Text><Text style={styles.copy}>Review sharing permissions, request a copy of your information, and manage deletion from one place.</Text></View>
          <View style={styles.card}>
            <View style={styles.switchCopy}><Text style={styles.title}>Share product analytics</Text><Text style={styles.copy}>Allow minimized usage analytics. Identity documents and biometric material are never analytics data.</Text></View>
            <AppSwitch isOn={Boolean(settings?.analyticsSharing)} onToggle={() => settings && update.mutate({ ...settings, analyticsSharing: !settings.analyticsSharing })} />
          </View>
          <View style={styles.card}>
            <View style={styles.switchCopy}><Text style={styles.title}>Partner sharing</Text><Text style={styles.copy}>Allow approved connected apps to request reusable proofs. Every disclosure still requires your consent.</Text></View>
            <AppSwitch isOn={Boolean(settings?.partnerSharing)} onToggle={() => settings && update.mutate({ ...settings, partnerSharing: !settings.partnerSharing })} />
          </View>
          <Pressable style={styles.action} onPress={() => router.push('/(screens)/privacy/who-has-data')}><Text style={styles.title}>Manage connected apps</Text><Text style={styles.chevron}>›</Text></Pressable>
          <Pressable disabled={exportRequest.isPending} style={[styles.action, exportRequest.isPending && styles.disabled]} onPress={() => exportRequest.mutate()}><Text style={styles.title}>{exportRequest.isPending ? 'Requesting export…' : 'Request my data export'}</Text><Text style={styles.chevron}>›</Text></Pressable>

          <Text style={styles.section}>Legal and privacy information</Text>
          <Pressable style={styles.action} onPress={() => void Linking.openURL(legalUrls.privacy)}><Text style={styles.title}>Privacy Policy</Text><Text style={styles.external}>↗</Text></Pressable>
          <Pressable style={styles.action} onPress={() => void Linking.openURL(legalUrls.terms)}><Text style={styles.title}>Terms of Use</Text><Text style={styles.external}>↗</Text></Pressable>
          <Pressable style={styles.action} onPress={() => void Linking.openURL(legalUrls.cookies)}><Text style={styles.title}>Cookie Policy</Text><Text style={styles.external}>↗</Text></Pressable>
          <Pressable style={styles.action} onPress={() => void Linking.openURL(legalUrls.accountDeletion)}><Text style={styles.title}>How account deletion works</Text><Text style={styles.external}>↗</Text></Pressable>
          <Text style={styles.note}>Security and disclosure audit history is retained according to Ontiver’s legal and fraud-prevention obligations; it is not presented as a locally clearable activity log.</Text>

          <View style={styles.danger}>
            <Text style={styles.dangerTitle}>Delete Ontiver account</Text>
            <Text style={styles.copy}>Request permanent deletion directly in the app. Narrowly required fraud, security, or legal records may be retained as explained in the Privacy Policy.</Text>
            <Pressable disabled={deletionRequest.isPending} style={[styles.deleteButton, deletionRequest.isPending && styles.disabled]} onPress={confirmDeletion}><Text style={styles.deleteText}>{deletionRequest.isPending ? 'Submitting request…' : 'Request permanent deletion'}</Text></Pressable>
          </View>
        </ScrollView>
      </RemoteState>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: 20, backgroundColor: '#F8FAFC' },
  content: { gap: 12, paddingTop: 14, paddingBottom: 48 },
  intro: { padding: 18, borderRadius: 18, backgroundColor: '#ECFDF3', gap: 6 },
  introTitle: { color: '#14532D', fontSize: 18, fontWeight: '800' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EAECF0' },
  switchCopy: { flex: 1, gap: 5 },
  title: { color: '#101828', fontSize: 15, fontWeight: '700' },
  copy: { color: '#667085', fontSize: 13, lineHeight: 18 },
  action: { minHeight: 56, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 17, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EAECF0' },
  chevron: { color: '#168A5B', fontSize: 26 },
  external: { color: '#168A5B', fontSize: 20, fontWeight: '700' },
  section: { color: '#475467', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7, marginTop: 10, marginLeft: 4 },
  note: { color: '#667085', fontSize: 12, lineHeight: 18, padding: 8 },
  disabled: { opacity: 0.55 },
  danger: { gap: 10, padding: 18, borderRadius: 16, backgroundColor: '#FFFBFA', borderWidth: 1, borderColor: '#FDA29B', marginTop: 8 },
  dangerTitle: { color: '#912018', fontSize: 17, fontWeight: '800' },
  deleteButton: { minHeight: 48, borderRadius: 13, backgroundColor: '#B42318', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  deleteText: { color: '#fff', fontWeight: '800' },
});
