import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AutoCapture,
  SmileIDDocumentVerificationView,
  initialize,
  setCallbackUrl,
} from '@smile_identity/react-native-expo';

import { Colors } from '@/constants/Colors';
import { runtimeConfig } from '@/lib/config';
import { createSmileSession } from '@/lib/verification-api';

const documentTypes: Record<string, string> = {
  nin: 'NATIONAL_ID',
  passport: 'PASSPORT',
  drivers_license: 'DRIVERS_LICENSE',
  voters_card: 'VOTER_ID',
};

export default function SmileIdCaptureScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ credentialType: string; country?: string }>();
  const [session, setSession] = useState<Awaited<ReturnType<typeof createSmileSession>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const type = params.credentialType as 'nin' | 'passport' | 'drivers_license' | 'voters_card';
        if (!documentTypes[type]) throw new Error('Unsupported credential type.');
        const created = await createSmileSession(type, params.country ?? 'NG');
        await initialize(runtimeConfig.smileIdEnvironment === 'sandbox', true);
        await setCallbackUrl(created.callbackUrl);
        if (active) setSession(created);
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : 'Unable to start SmileID.');
      }
    })();
    return () => { active = false; };
  }, [params.country, params.credentialType]);

  const sdkParams = useMemo(() => session ? {
    userId: session.userId,
    jobId: session.jobId,
    countryCode: (params.country ?? 'NG').toUpperCase(),
    documentType: documentTypes[params.credentialType],
    autoCapture: AutoCapture.AutoCapture,
    allowGalleryUpload: false,
    showInstructions: true,
    showAttribution: true,
    skipApiSubmission: false,
    useStrictMode: true,
    extraPartnerParams: {
      verification_id: session.verificationId,
      job_id: session.jobId,
      user_id: session.userId,
    },
  } : null, [params.country, params.credentialType, session]);

  if (error) return <View style={styles.center}><Text style={styles.title}>SmileID could not start</Text><Text style={styles.copy}>{error}</Text></View>;
  if (!session || !sdkParams) return <View style={styles.center}><ActivityIndicator color={Colors.primary} /><Text style={styles.copy}>Creating a secure verification session…</Text></View>;

  return (
    <View style={styles.page}>
      <SmileIDDocumentVerificationView
        style={styles.capture}
        params={sdkParams}
        onResult={() => router.replace({ pathname: '/(screens)/kyc/success', params: { verificationId: session.verificationId } })}
        onError={(sdkError) => setError(typeof sdkError === 'string' ? sdkError : 'SmileID capture was not completed.')}
      />
    </View>
  );
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#000' }, capture: { flex: 1 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12, backgroundColor: '#fff' }, title: { color: Colors.mainText, fontWeight: '800', fontSize: 20 }, copy: { color: Colors.secondaryText, textAlign: 'center' } });
