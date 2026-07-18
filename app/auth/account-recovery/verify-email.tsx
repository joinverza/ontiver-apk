import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AppButton from '@/components/shared/AppButton';
import AppInput from '@/components/shared/AppInput';
import { Colors } from '@/constants/Colors';
import { resetPassword } from '@/lib/auth-public-api';

export default function ResetPasswordScreen() {
  const router = useRouter(); const params = useLocalSearchParams<{ email?: string; token?: string }>(); const [token, setToken] = useState(params.token ?? ''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [mfaCode, setMfaCode] = useState(''); const [recoveryCode, setRecoveryCode] = useState(''); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(false);
  const submit = async () => { setLoading(true); setError(null); try { if (password !== confirm) throw new Error('Passwords do not match.'); await resetPassword({ token, newPassword: password, mfaCode: mfaCode || undefined, recoveryCode: recoveryCode || undefined }); router.replace('/auth/account-recovery/success'); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Password could not be reset.'); } finally { setLoading(false); } };
  return <View style={styles.page}><Text style={styles.heading}>Choose a new password</Text><Text style={styles.copy}>Open the verified-email reset link, or paste its token. If MFA is required, use an authenticator code or one of your existing recovery codes.</Text><AppInput label="Reset token" value={token} onChangeText={setToken} autoCapitalize="none" /><AppInput label="New password" value={password} onChangeText={setPassword} isPassword /><AppInput label="Confirm password" value={confirm} onChangeText={setConfirm} isPassword /><AppInput label="Authenticator code (if required)" value={mfaCode} onChangeText={setMfaCode} keyboardType="number-pad" /><AppInput label="MFA recovery code (alternative)" value={recoveryCode} onChangeText={setRecoveryCode} autoCapitalize="characters" />{error ? <Text style={styles.error}>{error}</Text> : null}<AppButton title="Reset password" loading={loading} disabled={!token || password.length < 12 || !confirm} onPress={() => void submit()} /></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 64, gap: 14 }, heading: { color: Colors.mainText, fontSize: 28, fontWeight: '800' }, copy: { color: Colors.secondaryText, lineHeight: 21 }, error: { color: '#B42318' } });
