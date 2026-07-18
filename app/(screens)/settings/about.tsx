import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/components/shared/AppHeader';
import { Colors } from '@/constants/Colors';
import { legalUrls, runtimeConfig } from '@/lib/config';

const links = [
  { title: 'Privacy Policy', description: 'How Ontiver and our processors handle personal data.', url: legalUrls.privacy },
  { title: 'Terms of Use', description: 'Rules and responsibilities for using Ontiver.', url: legalUrls.terms },
  { title: 'Cookie Policy', description: 'Cookies used by the Ontiver website.', url: legalUrls.cookies },
  { title: 'Account deletion', description: 'Deletion steps, verification, and retention information.', url: legalUrls.accountDeletion },
  { title: 'Legal centre', description: 'All current Ontiver legal documents.', url: legalUrls.legal },
];

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const build = Constants.nativeBuildVersion ?? Constants.expoConfig?.android?.versionCode?.toString() ?? 'development';
  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="About Ontiver" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.hero}>
          <View style={styles.logo}><Feather name="shield" size={30} color="#fff" /></View>
          <Text style={styles.brand}>Ontiver</Text>
          <Text style={styles.tagline}>Your identity. Verified once. Shared with control.</Text>
          <Text style={styles.version}>Version {version} ({build})</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Verification you can trust</Text>
          <Text style={styles.copy}>SmileID performs supported document, selfie, face, and liveness verification. Ontiver securely maps the result into reusable credentials and consent-controlled proofs.</Text>
        </View>
        <Text style={styles.section}>Legal</Text>
        {links.map((item) => <Pressable key={item.title} accessibilityRole="link" style={styles.row} onPress={() => void Linking.openURL(item.url)}><View style={styles.rowText}><Text style={styles.title}>{item.title}</Text><Text style={styles.copy}>{item.description}</Text></View><Feather name="external-link" size={18} color={Colors.primary} /></Pressable>)}
        <Text style={styles.section}>Support</Text>
        <Pressable accessibilityRole="link" style={styles.row} onPress={() => void Linking.openURL(`mailto:${runtimeConfig.supportEmail}`)}><View style={styles.rowText}><Text style={styles.title}>Email support</Text><Text style={styles.copy}>{runtimeConfig.supportEmail}</Text></View><Feather name="mail" size={18} color={Colors.primary} /></Pressable>
        <View style={styles.footer}><Text style={styles.footerText}>Operated by Ontiver Inc., Nigeria. Intended for users aged 18 and over.</Text><Text style={styles.footerText}>© {new Date().getFullYear()} Ontiver Inc. All rights reserved.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7FAF8', paddingHorizontal: 20 },
  page: { gap: 12, paddingTop: 16, paddingBottom: 48 },
  hero: { backgroundColor: '#0B3D2B', borderRadius: 24, padding: 24, alignItems: 'center', gap: 8 },
  logo: { width: 58, height: 58, borderRadius: 20, backgroundColor: '#168A5B', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  brand: { color: '#fff', fontSize: 28, fontWeight: '900' },
  tagline: { color: '#D6F5E4', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  version: { color: '#A9D8BF', fontSize: 12, marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, gap: 8, borderWidth: 1, borderColor: '#E4EBE7' },
  section: { color: '#475467', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 8, marginLeft: 4 },
  row: { minHeight: 70, backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E4EBE7' },
  rowText: { flex: 1, gap: 4 },
  title: { color: Colors.mainText, fontSize: 15, fontWeight: '800' },
  copy: { color: Colors.secondaryText, fontSize: 13, lineHeight: 19 },
  footer: { padding: 18, gap: 6, alignItems: 'center' },
  footerText: { color: Colors.secondaryText, fontSize: 11, textAlign: 'center', lineHeight: 16 },
});
