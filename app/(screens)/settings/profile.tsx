import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/shared/AppButton';
import AppHeader from '@/components/shared/AppHeader';
import AppInput from '@/components/shared/AppInput';
import { RemoteState } from '@/components/shared/RemoteState';
import { Colors } from '@/constants/Colors';
import { getProfile, updateProfile } from '@/lib/profile-api';

export default function ProfileSettingsScreen() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['profile'], queryFn: getProfile });
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('NG');
  useEffect(() => { if (query.data) { setFullName(query.data.fullName); setCountryCode(query.data.countryCode || 'NG'); } }, [query.data]);
  const save = useMutation({
    mutationFn: () => updateProfile({ fullName: fullName.trim(), countryCode: countryCode.trim().toUpperCase() }),
    onSuccess: async (profile) => { queryClient.setQueryData(['profile'], profile); await queryClient.invalidateQueries({ queryKey: ['mobile-bootstrap'] }); Alert.alert('Profile updated', 'Your Ontiver profile has been saved.'); },
    onError: (error) => Alert.alert('Profile not updated', error.message),
  });
  return <SafeAreaView style={styles.safe}><AppHeader title="Personal information" /><RemoteState loading={query.isLoading} error={query.error as Error | null} empty={!query.data} onRetry={() => void query.refetch()}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled"><View style={styles.card}><Text style={styles.title}>Verified account</Text><Text style={styles.email}>{query.data?.email}</Text><Text style={styles.copy}>Your email is managed through account security and cannot be changed here.</Text></View><View style={styles.card}><AppInput label="Full legal name" value={fullName} onChangeText={setFullName} autoComplete="name" /><AppInput label="Country code" value={countryCode} onChangeText={setCountryCode} autoCapitalize="characters" maxLength={2} /><Text style={styles.copy}>Use the two-letter country code associated with your identity documents.</Text><AppButton title="Save changes" loading={save.isPending} disabled={!fullName.trim() || countryCode.trim().length !== 2} onPress={() => save.mutate()} /></View></ScrollView></RemoteState></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, paddingHorizontal: 20, backgroundColor: '#F8FAFC' }, page: { gap: 14, paddingTop: 16, paddingBottom: 48 }, card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, gap: 14, borderWidth: 1, borderColor: '#EAECF0' }, title: { color: Colors.mainText, fontSize: 17, fontWeight: '800' }, email: { color: Colors.primary, fontSize: 15, fontWeight: '700' }, copy: { color: Colors.secondaryText, fontSize: 13, lineHeight: 19 } });
