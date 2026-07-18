import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { Colors } from '@/constants/Colors';

export default function RecoverySuccessScreen() {
  return <View style={styles.page}><Text style={styles.heading}>Password updated</Text><Text style={styles.copy}>Sign in with your new password. Other recovery and MFA steps remain controlled by the backend.</Text><Link href="/auth/login" style={styles.link}>Return to login</Link></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: '#fff' }, heading: { color: Colors.mainText, fontSize: 26, fontWeight: '800' }, copy: { color: Colors.secondaryText, textAlign: 'center', lineHeight: 22 }, link: { color: Colors.primary, fontWeight: '800' } });
