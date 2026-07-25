import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getWallet, setConnectedAppStatus } from '@/lib/wallet-api';

export default function WhoHasDataScreen() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ['wallet'], queryFn: getWallet });
  const update = useMutation({ mutationFn: ({ id, status }: { id: string; status: 'active' | 'paused' }) => setConnectedAppStatus(id, status), onSuccess: () => client.invalidateQueries({ queryKey: ['wallet'] }), onError: (error) => Alert.alert('Could not update access', error.message) });
  return <View style={styles.page}><Text style={styles.heading}>Who has my data</Text><RemoteState loading={query.isLoading} error={query.error as Error | null} empty={!query.data?.connectedApps.length} onRetry={() => void query.refetch()}><FlatList data={query.data?.connectedApps ?? []} keyExtractor={(item) => item.id} refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />} contentContainerStyle={styles.list} renderItem={({ item }) => <View style={styles.card}><Text style={styles.title}>{item.name}</Text><Text style={styles.copy}>{item.scopes.join(', ') || 'No active scopes listed'}</Text><Pressable style={styles.button} onPress={() => update.mutate({ id: item.id, status: item.status === 'active' ? 'paused' : 'active' })}><Text style={styles.buttonText}>{item.status === 'active' ? 'Pause access' : 'Restore access'}</Text></Pressable></View>} /></RemoteState></View>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#F6F8F6', paddingTop: 64 }, heading: { paddingHorizontal: 20, fontSize: 28, fontWeight: '800', color: Colors.mainText }, list: { padding: 20, gap: 12 }, card: { backgroundColor: '#fff', padding: 18, borderRadius: 16, gap: 10 }, title: { color: Colors.mainText, fontWeight: '700' }, copy: { color: Colors.secondaryText }, button: { alignSelf: 'flex-start', backgroundColor: '#ECFDF3', padding: 10, borderRadius: 10 }, buttonText: { color: Colors.primary, fontWeight: '700' } });
