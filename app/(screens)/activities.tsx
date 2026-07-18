import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getActivities } from '@/lib/mobile-api';

export default function ActivitiesScreen() {
  const query = useQuery({ queryKey: ['activities'], queryFn: () => getActivities(1) });
  return <View style={styles.page}><Text style={styles.heading}>Activity</Text><RemoteState loading={query.isLoading} error={query.error as Error | null} empty={!query.data?.items.length} onRetry={() => void query.refetch()}><FlatList data={query.data?.items ?? []} keyExtractor={(item) => item.id} refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />} contentContainerStyle={styles.list} renderItem={({ item }) => <View style={styles.card}><Text style={styles.title}>{item.title}</Text><Text style={styles.copy}>{item.description}</Text><Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text></View>} /></RemoteState></View>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#F6F8F6', paddingTop: 64 }, heading: { paddingHorizontal: 20, fontSize: 28, fontWeight: '800', color: Colors.mainText }, list: { padding: 20, gap: 12 }, card: { backgroundColor: '#fff', padding: 18, borderRadius: 16, gap: 6 }, title: { color: Colors.mainText, fontWeight: '700' }, copy: { color: Colors.secondaryText }, date: { color: Colors.secondaryText, fontSize: 12 } });
