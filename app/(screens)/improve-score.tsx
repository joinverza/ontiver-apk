import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getPrivacyOverview } from '@/lib/wallet-api';

export default function ImproveScoreScreen() {
  const query = useQuery({ queryKey: ['privacy-overview'], queryFn: getPrivacyOverview });
  return <View style={styles.page}><Text style={styles.heading}>Improve privacy score</Text><Text style={styles.copy}>Recommendations are generated only from failed Ontiver evidence factors.</Text><RemoteState loading={query.isLoading} error={query.error as Error | null} empty={!query.data?.recommendations.length} onRetry={() => void query.refetch()}><FlatList data={query.data?.recommendations ?? []} keyExtractor={(item) => item.id} refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />} contentContainerStyle={styles.list} renderItem={({ item }) => <View style={styles.card}><Text style={styles.title}>{item.title}</Text></View>} /></RemoteState></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, paddingTop: 64, backgroundColor: '#F6F8F6' }, heading: { paddingHorizontal: 20, color: Colors.mainText, fontSize: 28, fontWeight: '800' }, copy: { paddingHorizontal: 20, marginTop: 8, color: Colors.secondaryText }, list: { padding: 20, gap: 12 }, card: { backgroundColor: '#fff', borderRadius: 16, padding: 18 }, title: { color: Colors.mainText, fontWeight: '700' } });
