import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getPrivacyOverview } from '@/lib/wallet-api';

export default function PrivacyScreen() {
  const query = useQuery({ queryKey: ['privacy-overview'], queryFn: getPrivacyOverview });
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />}>
      <RemoteState loading={query.isLoading} error={query.error as Error | null} onRetry={() => void query.refetch()}>
        <Text style={styles.heading}>Privacy overview</Text>
        <View style={styles.score}><Text style={styles.scoreNumber}>{query.data?.score ?? 0}</Text><Text style={styles.scoreCopy}>out of 100, from Ontiver evidence only</Text></View>
        {Object.entries(query.data?.factors ?? {}).map(([name, factor]) => <View key={name} style={styles.card}><Text style={styles.title}>{splitName(name)}</Text><Text style={styles.factor}>{factor.score} / {factor.maximum}</Text></View>)}
        <Text style={styles.section}>Recommendations</Text>
        {(query.data?.recommendations ?? []).length ? query.data?.recommendations.map((item) => <View key={item.id} style={styles.card}><Text style={styles.title}>{item.title}</Text></View>) : <Text style={styles.empty}>No recommendation is currently generated.</Text>}
        <Text style={styles.section}>Confirmed security alerts</Text>
        {(query.data?.confirmedAlerts ?? []).length ? query.data?.confirmedAlerts.map((item) => <View key={item.id} style={styles.alert}><Text style={styles.title}>{item.type}</Text><Text>{item.status}</Text></View>) : <Text style={styles.empty}>No confirmed Ontiver incident is linked to your account.</Text>}
      </RemoteState>
    </ScrollView>
  );
}

const splitName = (value: string) => value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F8F6' }, content: { padding: 20, paddingTop: 64, paddingBottom: 130, gap: 14 },
  heading: { color: Colors.mainText, fontSize: 28, fontWeight: '800' }, score: { backgroundColor: Colors.primary, borderRadius: 24, padding: 24 },
  scoreNumber: { color: '#fff', fontSize: 52, fontWeight: '800' }, scoreCopy: { color: '#D1FAE5' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  title: { color: Colors.mainText, fontWeight: '700', flex: 1 }, factor: { color: Colors.primary, fontWeight: '800' },
  section: { marginTop: 10, color: Colors.mainText, fontSize: 18, fontWeight: '800' }, empty: { color: Colors.secondaryText, backgroundColor: '#fff', padding: 18, borderRadius: 16 },
  alert: { backgroundColor: '#FFF1F0', borderRadius: 16, padding: 18 },
});
