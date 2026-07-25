import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/shared/AppHeader';
import AppSwitch from '@/components/shared/AppSwitch';
import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getPrivacySettings, type PrivacySettings, updatePrivacySettings } from '@/lib/account-api';

type ToggleKey = keyof Pick<PrivacySettings, 'pushNotifications' | 'emailNotifications' | 'securityNotifications' | 'loginNotifications' | 'proofNotifications' | 'verificationResultNotifications' | 'disclosureNotifications' | 'productUpdateNotifications' | 'marketingNotifications'>;

const items: Array<{ key: ToggleKey; title: string; description: string }> = [
  { key: 'pushNotifications', title: 'Push notifications', description: 'Receive timely alerts on this device.' },
  { key: 'emailNotifications', title: 'Email notifications', description: 'Receive important account messages by email.' },
  { key: 'securityNotifications', title: 'Security alerts', description: 'High-priority account and privacy warnings.' },
  { key: 'loginNotifications', title: 'New sign-ins', description: 'Be notified when a new session starts.' },
  { key: 'proofNotifications', title: 'Credential proofs', description: 'Updates about reusable proof activity.' },
  { key: 'verificationResultNotifications', title: 'Verification results', description: 'Updates when SmileID verification finishes.' },
  { key: 'disclosureNotifications', title: 'Data sharing requests', description: 'Requests and revocation confirmations.' },
  { key: 'productUpdateNotifications', title: 'Product updates', description: 'Important changes to Ontiver features.' },
  { key: 'marketingNotifications', title: 'News and offers', description: 'Optional promotional communications.' },
];

export default function NotificationSettings() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['privacy-settings'], queryFn: getPrivacySettings });
  const update = useMutation({
    mutationFn: updatePrivacySettings,
    onSuccess: (settings) => queryClient.setQueryData(['privacy-settings'], settings),
    onError: (error) => Alert.alert('Preferences not saved', error.message),
  });

  const toggle = async (key: ToggleKey, value: boolean) => {
    if (!query.data) return;
    if (key === 'pushNotifications' && value) {
      const existing = await Notifications.getPermissionsAsync();
      const permission = existing.granted ? existing : await Notifications.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Push permission is off', 'Enable notifications in your device settings before turning on push alerts.');
        return;
      }
    }
    update.mutate({ ...query.data, [key]: value });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Notifications" />
      <RemoteState loading={query.isLoading} error={query.error as Error | null} empty={!query.data} onRetry={() => void query.refetch()}>
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.intro}><Text style={styles.introTitle}>Stay informed, not overwhelmed</Text><Text style={styles.copy}>Security-critical messages may still be delivered when necessary to protect your account.</Text></View>
          {items.map((item) => <View key={item.key} style={styles.row}><View style={styles.text}><Text style={styles.title}>{item.title}</Text><Text style={styles.copy}>{item.description}</Text></View><AppSwitch isOn={Boolean(query.data?.[item.key])} onToggle={(value) => void toggle(item.key, value)} /></View>)}
          {update.isPending ? <Text accessibilityLiveRegion="polite" style={styles.saving}>Saving preferences…</Text> : null}
        </ScrollView>
      </RemoteState>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 20, backgroundColor: '#F8FAFC' },
  page: { paddingTop: 14, paddingBottom: 48, gap: 10 },
  intro: { backgroundColor: '#ECFDF3', borderRadius: 18, padding: 18, gap: 6 },
  introTitle: { color: '#14532D', fontSize: 18, fontWeight: '800' },
  row: { minHeight: 76, backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: '#EAECF0' },
  text: { flex: 1, gap: 4 },
  title: { color: Colors.mainText, fontSize: 15, fontWeight: '800' },
  copy: { color: Colors.secondaryText, fontSize: 13, lineHeight: 18 },
  saving: { color: Colors.primary, textAlign: 'center', fontSize: 12, fontWeight: '700', padding: 8 },
});
