import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/shared/AppButton';
import { Colors } from '@/constants/Colors';
import { getVerificationStatus } from '@/lib/verification-api';

export default function VerificationStatusScreen() {
  const router = useRouter();
  const { verificationId = '' } = useLocalSearchParams<{ verificationId: string }>();
  const query = useQuery({ queryKey: ['verification', verificationId], queryFn: () => getVerificationStatus(verificationId), enabled: Boolean(verificationId), refetchInterval: (state) => ['completed', 'rejected', 'failed'].includes(state.state.data?.status ?? '') ? false : 3000 });
  const approved = query.data?.status === 'completed' && query.data?.overallResult === 'approved';
  return <View style={styles.page}>{query.isLoading ? <ActivityIndicator color={Colors.primary} /> : <><Text style={styles.heading}>{approved ? 'Verification approved' : query.data?.status === 'completed' ? 'Verification completed' : 'Verification in progress'}</Text><Text style={styles.copy}>{approved ? 'Your Ontiver credential has been issued from the verified SmileID result.' : 'We will update this screen from the signed SmileID callback. You can safely leave and return later.'}</Text><Text style={styles.status}>{query.data?.status ?? 'pending'}</Text>{query.error ? <Text style={styles.error}>{query.error.message}</Text> : null}<AppButton title="Return to vault" onPress={() => router.replace('/(tabs)/vault')} /></>}</View>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#fff', padding: 24, alignItems: 'center', justifyContent: 'center', gap: 18 }, heading: { color: Colors.mainText, fontSize: 26, fontWeight: '800', textAlign: 'center' }, copy: { color: Colors.secondaryText, textAlign: 'center', lineHeight: 22 }, status: { color: Colors.primary, textTransform: 'capitalize', fontWeight: '800' }, error: { color: '#B42318' } });
