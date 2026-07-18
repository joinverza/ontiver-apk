import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import AppButton from '@/components/shared/AppButton';
import AppInput from '@/components/shared/AppInput';
import { Colors } from '@/constants/Colors';
import { submitEnhancedKyc } from '@/lib/verification-api';

export default function EnhancedKycScreen() {
  const router = useRouter();
  const [idNumber, setIdNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true); setError(null);
    try {
      const result = await submitEnhancedKyc({ verificationType: 'bvn', idNumber, country: 'NG', firstName, lastName, dateOfBirth });
      router.replace({ pathname: '/(screens)/kyc/success', params: { verificationId: result.verificationId } });
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Verification could not be submitted.'); }
    finally { setLoading(false); }
  };
  return <View style={styles.page}><Text style={styles.heading}>BVN verification</Text><Text style={styles.copy}>SmileID Enhanced KYC verifies this without forcing a selfie flow.</Text><AppInput label="BVN" value={idNumber} onChangeText={setIdNumber} keyboardType="number-pad" /><AppInput label="First name" value={firstName} onChangeText={setFirstName} /><AppInput label="Last name" value={lastName} onChangeText={setLastName} /><AppInput label="Date of birth" placeholder="YYYY-MM-DD" value={dateOfBirth} onChangeText={setDateOfBirth} />{error ? <Text style={styles.error}>{error}</Text> : null}<AppButton title="Submit free verification" loading={loading} disabled={!idNumber || !firstName || !lastName || !dateOfBirth} onPress={() => void submit()} /></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 64, gap: 18 }, heading: { fontSize: 28, fontWeight: '800', color: Colors.mainText }, copy: { color: Colors.secondaryText }, error: { color: '#B42318' } });
