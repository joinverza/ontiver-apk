import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { cancelStepUpCode, StepUpPromptState, submitStepUpCode, subscribeStepUpPrompt } from '@/lib/step-up-bus';

const CLOSED: StepUpPromptState = { open: false, message: '' };

export function StepUpPrompt() {
  const [prompt, setPrompt] = useState(CLOSED);
  const [code, setCode] = useState('');

  useEffect(() => subscribeStepUpPrompt((next) => {
    setPrompt(next);
    if (!next.open) setCode('');
  }), []);

  return (
    <Modal visible={prompt.open} transparent animationType="fade" onRequestClose={cancelStepUpCode}>
      <KeyboardAvoidingView style={styles.backdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.title}>Security verification</Text>
          <Text style={styles.message}>{prompt.message}</Text>
          <TextInput
            autoFocus
            accessibilityLabel="Authenticator code"
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={(value) => setCode(value.replace(/\D/g, ''))}
            placeholder="000000"
            secureTextEntry
            style={styles.input}
            value={code}
          />
          <View style={styles.actions}>
            <Pressable style={styles.secondary} onPress={cancelStepUpCode}><Text style={styles.secondaryText}>Cancel</Text></Pressable>
            <Pressable disabled={code.length !== 6} style={[styles.primary, code.length !== 6 && styles.disabled]} onPress={() => submitStepUpCode(code)}><Text style={styles.primaryText}>Verify</Text></Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.55)' },
  card: { borderRadius: 20, padding: 22, gap: 14, backgroundColor: '#FFFFFF' },
  title: { fontSize: 20, fontWeight: '800', color: '#101828' },
  message: { color: '#475467', lineHeight: 21 },
  input: { borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 12, padding: 14, fontSize: 22, letterSpacing: 8, textAlign: 'center', color: '#101828' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  secondary: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#D0D5DD' },
  secondaryText: { color: '#344054', fontWeight: '700' },
  primary: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10, backgroundColor: '#115E45' },
  primaryText: { color: '#FFFFFF', fontWeight: '800' },
  disabled: { opacity: 0.45 },
});
