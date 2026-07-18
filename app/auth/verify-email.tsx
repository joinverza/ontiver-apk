import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AppButton from '@/components/shared/AppButton';
import AppInput from '@/components/shared/AppInput';
import { Colors } from '@/constants/Colors';
import { resendSignupEmail, verifySignupEmail } from '@/lib/auth-public-api';

export default function VerifyEmailScreen() {
  const router = useRouter(); const { email = '' } = useLocalSearchParams<{ email: string }>(); const [code, setCode] = useState(''); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(false);
  const verify = async () => { setLoading(true); setError(null); try { await verifySignupEmail(email, code); router.replace('/auth/login'); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Code could not be verified.'); } finally { setLoading(false); } };
  return <View style={styles.page}><Text style={styles.heading}>Verify your email</Text><Text style={styles.copy}>Enter the six-digit code sent to {email || 'your account email'}.</Text><AppInput label="Verification code" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} />{error ? <Text style={styles.error}>{error}</Text> : null}<AppButton title="Verify email" loading={loading} disabled={code.length !== 6 || !email} onPress={() => void verify()} /><Text style={styles.link} onPress={() => void resendSignupEmail(email)}>Resend code</Text></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 80, gap: 18 }, heading: { color: Colors.mainText, fontSize: 28, fontWeight: '800' }, copy: { color: Colors.secondaryText }, error: { color: '#B42318' }, link: { color: Colors.primary, fontWeight: '800', textAlign: 'center' } });
