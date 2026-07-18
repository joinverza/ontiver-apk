import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';

import AppButton from '@/components/shared/AppButton';
import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { approveDisclosure, denyDisclosure, resolveDisclosureToken } from '@/lib/disclosure-api';
import { getWallet } from '@/lib/wallet-api';

export default function IdentityRequestScreen() {
  const router = useRouter();
  const { token, requestId } = useLocalSearchParams<{ token?: string; requestId?: string }>();
  const tokenQuery = useQuery({ queryKey: ['disclosure-token', token], queryFn: () => resolveDisclosureToken(token!), enabled: Boolean(token) });
  const walletQuery = useQuery({ queryKey: ['wallet'], queryFn: getWallet, enabled: !token && Boolean(requestId) });
  const walletRequest = walletQuery.data?.disclosureRequests.find((item) => item.id === requestId);
  const request = tokenQuery.data ?? walletRequest;
  const resolvedRequestId = tokenQuery.data?.requestId ?? walletRequest?.id;
  const fields = useMemo<string[]>(() => {
    const requestedFields = request && 'requestedFields' in request ? request.requestedFields : undefined;
    return Array.isArray(requestedFields)
      ? requestedFields.filter((field): field is string => typeof field === 'string')
      : [];
  }, [request]);
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => setSelected(fields), [fields]);
  const expired = Boolean(request?.expiresAt && new Date(request.expiresAt).getTime() <= Date.now());
  const approve = useMutation({ mutationFn: () => approveDisclosure(resolvedRequestId!, selected), onSuccess: () => router.replace({ pathname: '/(screens)/scan-success', params: { status: 'approved' } }), onError: (error) => Alert.alert('Approval failed', error.message) });
  const deny = useMutation({ mutationFn: () => denyDisclosure(resolvedRequestId!), onSuccess: () => router.replace({ pathname: '/(screens)/scan-success', params: { status: 'denied' } }), onError: (error) => Alert.alert('Denial failed', error.message) });
  const loading = tokenQuery.isLoading || walletQuery.isLoading;
  const error = (tokenQuery.error || walletQuery.error) as Error | null;
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}><RemoteState loading={loading} error={error} empty={!request} onRetry={() => { void tokenQuery.refetch(); void walletQuery.refetch(); }}><Text style={styles.heading}>Identity request</Text><View style={styles.card}><Text style={styles.label}>Requester</Text><Text style={styles.title}>{request?.requester}</Text><Text style={styles.label}>Purpose</Text><Text style={styles.copy}>{request?.purpose}</Text><Text style={styles.label}>Audience</Text><Text style={styles.copy}>{request?.audience}</Text><Text style={styles.label}>Expires</Text><Text style={[styles.copy, expired && styles.error]}>{request?.expiresAt ? new Date(request.expiresAt).toLocaleString() : 'No expiry supplied'}</Text></View><Text style={styles.section}>Requested fields</Text>{fields.map((field) => <Pressable key={field} style={[styles.field, selected.includes(field) && styles.selected]} onPress={() => setSelected((current) => current.includes(field) ? current.filter((value) => value !== field) : [...current, field])}><Text style={styles.title}>{field}</Text><Text style={styles.check}>{selected.includes(field) ? 'Selected' : 'Not shared'}</Text></Pressable>)}{expired || request?.status !== 'pending' ? <Text style={styles.error}>This request can no longer be changed.</Text> : <View style={styles.actions}><AppButton title="Approve selected" loading={approve.isPending} disabled={!selected.length || deny.isPending} onPress={() => approve.mutate()} style={{ flex: 1 }} /><AppButton title="Deny" loading={deny.isPending} disabled={approve.isPending} onPress={() => deny.mutate()} variant="outline" style={{ flex: 1 }} /></View>}</RemoteState></ScrollView>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#F6F8F6' }, content: { padding: 20, paddingTop: 64, gap: 14 }, heading: { color: Colors.mainText, fontSize: 28, fontWeight: '800' }, card: { backgroundColor: '#fff', padding: 18, borderRadius: 16, gap: 6 }, label: { color: Colors.secondaryText, fontSize: 12, marginTop: 8 }, title: { color: Colors.mainText, fontWeight: '800' }, copy: { color: Colors.secondaryText }, section: { color: Colors.mainText, fontSize: 18, fontWeight: '800' }, field: { backgroundColor: '#fff', padding: 16, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between' }, selected: { backgroundColor: '#ECFDF3', borderWidth: 1, borderColor: Colors.primary }, check: { color: Colors.primary, fontWeight: '700' }, error: { color: '#B42318' }, actions: { flexDirection: 'row', gap: 10, marginTop: 10 } });
