import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getBootstrap } from '@/lib/mobile-api';
import { getWallet } from '@/lib/wallet-api';

export default function HomeScreen() {
  const bootstrap = useQuery({ queryKey: ['mobile-bootstrap'], queryFn: getBootstrap });
  const wallet = useQuery({ queryKey: ['wallet'], queryFn: getWallet });
  const refreshing = bootstrap.isRefetching || wallet.isRefetching;
  const refresh = () => { void bootstrap.refetch(); void wallet.refetch(); };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <RemoteState loading={bootstrap.isLoading || wallet.isLoading} error={(bootstrap.error || wallet.error) as Error | null} onRetry={refresh}>
        <Text style={styles.eyebrow}>ONTIVER WALLET</Text>
        <Text style={styles.heading}>Welcome{bootstrap.data?.profile.name ? `, ${bootstrap.data.profile.name}` : ''}</Text>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Trust score</Text>
          <Text style={styles.score}>{wallet.data?.trustScore ?? 0}</Text>
          <Text style={styles.caption}>Calculated from your verified Ontiver credentials.</Text>
        </View>
        <View style={styles.grid}>
          <Stat label="Verified credentials" value={wallet.data?.stats.verifiedCredentials ?? 0} />
          <Stat label="Pending requests" value={wallet.data?.stats.pendingRequests ?? 0} />
          <Stat label="Connected apps" value={wallet.data?.stats.activeConnectedApps ?? 0} />
          <Stat label="Raw PII shared" value={wallet.data?.stats.rawPiiShared ?? 0} />
        </View>
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Verification is free</Text>
          <Text style={styles.caption}>SmileID performs supported identity capture and biometric checks. Ontiver does not run local face or liveness inference.</Text>
        </View>
      </RemoteState>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.caption}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F8F6' }, content: { padding: 20, paddingTop: 64, paddingBottom: 130, gap: 20 },
  eyebrow: { color: Colors.primary, letterSpacing: 1.5, fontWeight: '800', fontSize: 12 },
  heading: { color: Colors.mainText, fontSize: 30, fontWeight: '800' },
  scoreCard: { backgroundColor: Colors.primary, borderRadius: 24, padding: 24, gap: 8 },
  scoreLabel: { color: '#D1FAE5', fontSize: 15 }, score: { color: '#fff', fontSize: 52, fontWeight: '800' },
  caption: { color: Colors.secondaryText, lineHeight: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stat: { width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 18, gap: 6 },
  statValue: { color: Colors.mainText, fontSize: 26, fontWeight: '800' },
  notice: { backgroundColor: '#ECFDF3', borderRadius: 16, padding: 18, gap: 6 },
  noticeTitle: { color: Colors.primary, fontSize: 17, fontWeight: '700' },
});
