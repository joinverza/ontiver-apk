import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import AppButton from '@/components/shared/AppButton';
import AppInput from '@/components/shared/AppInput';
import { Colors } from '@/constants/Colors';
import { forgotPassword } from '@/lib/auth-public-api';

export default function ForgotPasswordScreen() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(false);
  const submit = async () => { setLoading(true); setError(null); try { await forgotPassword(email); router.push({ pathname: '/auth/account-recovery/verify-email', params: { email } }); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Request could not be sent.'); } finally { setLoading(false); } };
  return <View style={styles.page}><Text style={styles.heading}>Reset password</Text><Text style={styles.copy}>We will send a reset link to the verified account email if the account exists.</Text><AppInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />{error ? <Text style={styles.error}>{error}</Text> : null}<AppButton title="Send reset email" loading={loading} disabled={!email} onPress={() => void submit()} /></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 80, gap: 18 }, heading: { color: Colors.mainText, fontSize: 28, fontWeight: '800' }, copy: { color: Colors.secondaryText, lineHeight: 22 }, error: { color: '#B42318' } });
