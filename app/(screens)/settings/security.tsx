import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getSessions, revokeSession } from '@/lib/account-api';

export default function SecuritySettingsScreen() {
  const client = useQueryClient(); const query = useQuery({ queryKey: ['sessions'], queryFn: getSessions }); const revoke = useMutation({ mutationFn: revokeSession, onSuccess: () => client.invalidateQueries({ queryKey: ['sessions'] }), onError: (error) => Alert.alert('Session not revoked', error.message) });
  return <View style={styles.page}><Text style={styles.heading}>Sessions and security</Text><Text style={styles.copy}>Device PIN or biometrics only unlock this app locally; backend access still requires a valid Ontiver session.</Text><RemoteState loading={query.isLoading} error={query.error as Error | null} empty={!query.data?.length} onRetry={() => void query.refetch()}><FlatList data={query.data ?? []} keyExtractor={(item) => item.sessionId} refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />} contentContainerStyle={styles.list} renderItem={({ item }) => <View style={styles.card}><Text style={styles.title}>{item.current ? 'Current session' : item.device}</Text><Text style={styles.copy}>Last active {new Date(item.lastActivityAt).toLocaleString()}</Text><Text style={styles.status}>{item.status}</Text>{!item.current && item.status === 'active' ? <Pressable onPress={() => revoke.mutate(item.sessionId)}><Text style={styles.revoke}>Revoke session</Text></Pressable> : null}</View>} /></RemoteState></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, paddingTop: 64, backgroundColor: '#F6F8F6' }, heading: { paddingHorizontal: 20, color: Colors.mainText, fontSize: 28, fontWeight: '800' }, copy: { paddingHorizontal: 20, marginTop: 8, color: Colors.secondaryText }, list: { padding: 20, gap: 12 }, card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, gap: 6 }, title: { color: Colors.mainText, fontWeight: '800' }, status: { color: Colors.primary, textTransform: 'capitalize' }, revoke: { color: '#B42318', fontWeight: '800', marginTop: 8 } });
