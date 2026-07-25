import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { type Href, useRouter } from 'expo-router';

import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getCredentialTypes } from '@/lib/verification-api';

export default function AddCredentialScreen() {
  const router = useRouter();
  const query = useQuery({ queryKey: ['credential-types'], queryFn: getCredentialTypes });
  return <View style={styles.page}><Text style={styles.heading}>Add a credential</Text><Text style={styles.copy}>Available verification flows are controlled by the backend. Verification is free.</Text><RemoteState loading={query.isLoading} error={query.error as Error | null} empty={!query.data?.length} onRetry={() => void query.refetch()}><FlatList data={query.data ?? []} keyExtractor={(item) => item.id} refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />} contentContainerStyle={styles.list} renderItem={({ item }) => <Pressable disabled={!item.available} style={[styles.card, !item.available && styles.disabled]} onPress={() => item.flow === 'smileid_sdk' ? router.push({ pathname: '/(screens)/kyc/smileid', params: { credentialType: item.id, country: 'NG' } } as unknown as Href) : router.push({ pathname: '/(screens)/kyc', params: { credentialType: item.id } })}><View><Text style={styles.title}>{item.label}</Text><Text style={styles.copy}>{item.requiresCamera ? 'SmileID secure camera capture' : 'SmileID Enhanced KYC'}</Text>{item.unavailableReason ? <Text style={styles.warning}>{item.unavailableReason}</Text> : null}</View><Text style={styles.action}>{item.available ? 'Start' : 'Unavailable'}</Text></Pressable>} /></RemoteState></View>;
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#F6F8F6', paddingTop: 64 }, heading: { paddingHorizontal: 20, fontSize: 28, fontWeight: '800', color: Colors.mainText }, copy: { paddingHorizontal: 20, marginTop: 8, color: Colors.secondaryText }, list: { padding: 20, gap: 12 }, card: { backgroundColor: '#fff', padding: 18, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }, disabled: { opacity: 0.5 }, title: { color: Colors.mainText, fontWeight: '700', fontSize: 16 }, action: { color: Colors.primary, fontWeight: '800' }, warning: { color: '#B54708', marginTop: 6 } });
