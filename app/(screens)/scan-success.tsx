import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AppButton from '@/components/shared/AppButton';
import { Colors } from '@/constants/Colors';

export default function DisclosureResultScreen() {
  const router = useRouter();
  const { status } = useLocalSearchParams<{ status?: string }>();
  const approved = status === 'approved';
  return <View style={styles.page}><Text style={styles.heading}>{approved ? 'Request approved' : 'Request denied'}</Text><Text style={styles.copy}>{approved ? 'Only the fields you selected were included in the signed presentation.' : 'No requested fields were shared.'}</Text><AppButton title="Return to shares" onPress={() => router.replace('/(tabs)/share')} /></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', gap: 18, backgroundColor: '#fff' }, heading: { color: Colors.mainText, fontSize: 26, fontWeight: '800' }, copy: { color: Colors.secondaryText, textAlign: 'center', lineHeight: 22 } });
