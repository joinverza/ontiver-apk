import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getWallet } from '@/lib/wallet-api';

export default function ShareScreen() {
  const router = useRouter();
  const query = useQuery({ queryKey: ['wallet'], queryFn: getWallet });
  return <View style={styles.page}><Text style={styles.heading}>Shares and requests</Text><View style={styles.actions}><Pressable style={styles.primary} onPress={() => router.push('/(screens)/scan')}><Text style={styles.primaryText}>Scan request QR</Text></Pressable><Pressable style={styles.secondary} onPress={() => router.push('/(screens)/privacy/who-has-data')}><Text style={styles.secondaryText}>Connected apps</Text></Pressable></View><RemoteState loading={query.isLoading} error={query.error as Error | null} empty={!query.data?.disclosureRequests.length} onRetry={() => void query.refetch()}><FlatList data={query.data?.disclosureRequests ?? []} keyExtractor={(item) => item.id} refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />} contentContainerStyle={styles.list} renderItem={({ item }) => <Pressable style={styles.card} onPress={() => router.push({ pathname: '/(screens)/identity-request', params: { requestId: item.id } })}><View style={styles.row}><Text style={styles.title}>{item.requester}</Text><Text style={styles.status}>{item.status}</Text></View><Text style={styles.copy}>{item.purpose}</Text></Pressable>} /></RemoteState></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#F6F8F6', paddingTop: 64 }, heading: { paddingHorizontal: 20, color: Colors.mainText, fontSize: 28, fontWeight: '800' }, actions: { flexDirection: 'row', gap: 10, padding: 20 }, primary: { backgroundColor: Colors.primary, padding: 14, borderRadius: 12 }, primaryText: { color: '#fff', fontWeight: '800' }, secondary: { backgroundColor: '#ECFDF3', padding: 14, borderRadius: 12 }, secondaryText: { color: Colors.primary, fontWeight: '800' }, list: { padding: 20, paddingTop: 0, paddingBottom: 130, gap: 12 }, card: { backgroundColor: '#fff', padding: 18, borderRadius: 16, gap: 8 }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, title: { color: Colors.mainText, fontWeight: '800' }, status: { color: Colors.primary, textTransform: 'capitalize' }, copy: { color: Colors.secondaryText } });
