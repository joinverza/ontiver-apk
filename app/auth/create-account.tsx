import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import AppButton from '@/components/shared/AppButton';
import AppCheckmark from '@/components/shared/AppCheckmark';
import AppInput from '@/components/shared/AppInput';
import { Colors } from '@/constants/Colors';
import { signup } from '@/lib/auth-public-api';
import { SocialAuthActions } from '@/components/auth/SocialAuthActions';
import { legalUrls } from '@/lib/config';

export default function CreateAccountScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [consent, setConsent] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  const submit = async () => { setLoading(true); setError(null); try { if (password !== confirm) throw new Error('Passwords do not match.'); await signup({ fullName, email, password, consentAccepted: consent }); router.push({ pathname: '/auth/verify-email', params: { email } }); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Account could not be created.'); } finally { setLoading(false); } };
  return <ScrollView style={styles.page} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Text style={styles.heading}>Create your Ontiver account</Text><Text style={styles.intro}>Build a secure, reusable identity wallet with verification powered by SmileID.</Text><SocialAuthActions mode="signup" consentAccepted={consent} /><View style={styles.consent}><AppCheckmark isChecked={consent} onPress={() => setConsent(!consent)} /><Text style={styles.copy}>I am 18 or older and accept Ontiver’s <Text style={styles.link} onPress={() => void Linking.openURL(legalUrls.terms)}>Terms of Use</Text> and <Text style={styles.link} onPress={() => void Linking.openURL(legalUrls.privacy)}>Privacy Policy</Text>.</Text></View><View style={styles.divider}><View style={styles.line} /><Text style={styles.copy}>or use email</Text><View style={styles.line} /></View><AppInput label="Full name" value={fullName} onChangeText={setFullName} autoComplete="name" /><AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" /><AppInput label="Password" value={password} onChangeText={setPassword} isPassword /><AppInput label="Confirm password" value={confirm} onChangeText={setConfirm} isPassword />{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<AppButton title="Create account with email" loading={loading} disabled={!fullName || !email || password.length < 12 || !confirm || !consent} onPress={() => void submit()} /></ScrollView>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#fff' }, content: { padding: 24, paddingTop: 64, paddingBottom: 48, gap: 18 }, heading: { color: Colors.mainText, fontSize: 28, fontWeight: '800' }, intro: { color: Colors.secondaryText, fontSize: 15, lineHeight: 22 }, consent: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' }, copy: { color: Colors.secondaryText, flex: 1, lineHeight: 20 }, link: { color: Colors.primary, fontWeight: '700', textDecorationLine: 'underline' }, divider: { flexDirection: 'row', alignItems: 'center', gap: 12 }, line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#D8E0DC' }, error: { color: '#B42318' } });
