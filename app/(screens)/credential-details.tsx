import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getCredentialDetail } from '@/lib/credential-api';

export default function CredentialDetailsScreen() {
  const { credentialId = '' } = useLocalSearchParams<{ credentialId: string }>();
  const query = useQuery({ queryKey: ['credential', credentialId], queryFn: () => getCredentialDetail(credentialId), enabled: Boolean(credentialId) });
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}><RemoteState loading={query.isLoading} error={query.error as Error | null} onRetry={() => void query.refetch()}><Text style={styles.heading}>{query.data?.title}</Text><Text style={styles.status}>{query.data?.status}</Text><View style={styles.card}><Row label="Type" value={query.data?.type} /><Row label="Issuer" value={query.data?.issuer.name} /><Row label="Issued" value={formatDate(query.data?.issuedAt)} /><Row label="Expires" value={formatDate(query.data?.expiresAt)} /></View><Text style={styles.section}>Verified claims</Text><View style={styles.card}>{Object.entries(query.data?.claims ?? {}).map(([label, value]) => <Row key={label} label={label} value={String(value)} />)}</View></RemoteState></ScrollView>;
}
function formatDate(value?: string | null) { return value ? new Date(value).toLocaleDateString() : 'Not supplied'; }
function Row({ label, value }: { label: string; value?: string }) { return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value || 'Not supplied'}</Text></View>; }
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#F6F8F6' }, content: { padding: 20, paddingTop: 64, gap: 16 }, heading: { color: Colors.mainText, fontSize: 28, fontWeight: '800' }, status: { color: Colors.primary, fontWeight: '800', textTransform: 'capitalize' }, card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, gap: 14 }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 }, label: { color: Colors.secondaryText, textTransform: 'capitalize' }, value: { color: Colors.mainText, fontWeight: '600', textAlign: 'right', flex: 1 }, section: { color: Colors.mainText, fontSize: 18, fontWeight: '800' } });
