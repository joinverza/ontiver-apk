import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getCredentials } from '@/lib/wallet-api';

export default function VaultScreen() {
  const router = useRouter();
  const query = useQuery({ queryKey: ['credentials'], queryFn: getCredentials });
  return (
    <View style={styles.page}>
      <Text style={styles.heading}>Credential vault</Text>
      <RemoteState loading={query.isLoading} error={query.error as Error | null} empty={!query.data?.length} onRetry={() => void query.refetch()}>
        <FlatList
          data={query.data ?? []}
          keyExtractor={(item) => item.credentialId}
          refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push({ pathname: '/(screens)/credential-details', params: { credentialId: item.credentialId } })}>
              <View style={styles.row}><Text style={styles.title}>{item.title}</Text><Text style={styles.status}>{item.status}</Text></View>
              <Text style={styles.copy}>{item.type}</Text>
              <Text style={styles.copy}>{item.expiresAt ? `Expires ${new Date(item.expiresAt).toLocaleDateString()}` : 'No expiry supplied'}</Text>
            </Pressable>
          )}
        />
      </RemoteState>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F8F6', paddingTop: 64 }, heading: { paddingHorizontal: 20, color: Colors.mainText, fontSize: 28, fontWeight: '800' },
  list: { padding: 20, paddingBottom: 130, gap: 12 }, card: { backgroundColor: '#fff', padding: 18, borderRadius: 16, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, title: { color: Colors.mainText, fontWeight: '700', flex: 1, fontSize: 16 },
  status: { color: Colors.primary, textTransform: 'capitalize', fontWeight: '700' }, copy: { color: Colors.secondaryText },
});
