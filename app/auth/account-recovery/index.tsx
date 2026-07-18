import { Redirect } from 'expo-router';

export default function AccountRecoveryIndex() {
  return <Redirect href="/auth/account-recovery/enter-email" />;
}
