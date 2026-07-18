import { useState } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/Colors';

function tokenFromQr(raw: string): string {
  try {
    const url = new URL(raw);
    return url.searchParams.get('token') || raw;
  } catch {
    return raw.trim();
  }
}

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  if (!permission) return <View style={styles.page} />;
  if (!permission.granted) return <View style={styles.center}><Text style={styles.heading}>Camera access is required to scan an identity request.</Text><Pressable style={styles.button} onPress={() => void requestPermission()}><Text style={styles.buttonText}>Allow camera</Text></Pressable></View>;
  return <View style={styles.page}><CameraView style={styles.camera} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={scanned ? undefined : ({ data }) => { setScanned(true); router.replace({ pathname: '/(screens)/identity-request', params: { token: tokenFromQr(data) } }); }} /><View pointerEvents="none" style={styles.frame} /><Text style={styles.help}>Scan the Ontiver disclosure QR code</Text></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }, center: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 18 }, heading: { color: Colors.mainText, fontSize: 18, fontWeight: '700', textAlign: 'center' }, button: { backgroundColor: Colors.primary, borderRadius: 12, padding: 14 }, buttonText: { color: '#fff', fontWeight: '800' }, camera: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }, frame: { width: 280, height: 280, borderWidth: 4, borderColor: '#fff', borderRadius: 24 }, help: { position: 'absolute', bottom: 80, color: '#fff', fontWeight: '700' } });
