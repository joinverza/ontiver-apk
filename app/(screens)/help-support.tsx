import React, { useState } from 'react';
import { Alert, Linking, View, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import AppHeader from '../../components/shared/AppHeader';
import { BodyLargeText, BodySmallText, H2Text, Label } from '../../components/shared/AppTexts';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { useDesignSystem } from '../../utils/design-system';
import AppButton from '../../components/shared/AppButton';
import { BottomSheetModal } from '../../components/shared/BottomSheetModal';
import { RemoteState } from '../../components/shared/RemoteState';
import { getSupportFaqs, rateSupportConversation, sendSupportMessage } from '../../lib/support-api';
import { legalUrls, runtimeConfig } from '../../lib/config';

export default function HelpSupportScreen() {
    const ds = useDesignSystem();
    const [isFeedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
    const [rating, setRating] = useState(0);
    const [modalPurpose, setModalPurpose] = useState<'support' | 'feedback'>('support');
    const faqQuery = useQuery({ queryKey: ['support', 'faqs'], queryFn: getSupportFaqs });
    const sendMessage = useMutation({
        mutationFn: async () => {
            const prefix = modalPurpose === 'feedback' ? 'Mobile app feedback' : 'Mobile app support request';
            await sendSupportMessage(`${prefix}: ${feedbackText.trim()}`);
            if (modalPurpose === 'feedback' && rating > 0) await rateSupportConversation(rating, feedbackText.trim());
        },
        onSuccess: () => { setFeedbackModalVisible(false); setFeedbackText(''); setRating(0); Alert.alert('Message sent', 'Ontiver Support has received your message.'); },
        onError: (error) => Alert.alert('Message not sent', error.message),
    });

    const filteredFaqs = (faqQuery.data ?? []).filter(faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()));

    const toggleFaq = (id: string) => {
        setExpandedFaqId(expandedFaqId === id ? null : id);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(248, 250, 252, 1)", paddingHorizontal: ds.space.lg }}>
            <AppHeader title="Help & Support" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: ds.space['4xl'], marginTop: ds.space.xl }}>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.sm, marginBottom: ds.space.md }}>
                    <Feather name="info" size={20} color="#6B7280" />
                    <BodyLargeText style={{ color: '#6B7280' }}>Frequently Asked Questions</BodyLargeText>
                </View>

                {/* FAQ Box */}
                <View style={{
                    backgroundColor: Colors.white,
                    borderRadius: ds.radius.lg,
                    padding: ds.space.lg,
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    marginBottom: ds.space.xl
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#F9FAFB',
                        borderRadius: ds.radius.md,
                        paddingHorizontal: ds.space.md,
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        marginBottom: ds.space.md,
                        height: 44
                    }}>
                        <Feather name="search" size={18} color="rgba(0, 0, 0, 0.4)" />
                        <TextInput
                            placeholder='Search FAQ...'
                            placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={{
                                flex: 1,
                                height: '100%',
                                fontFamily: Fonts.regular,
                                fontSize: Math.max(ds.typography.bodySmall.fontSize - 1, 12),
                                color: Colors.black,
                                paddingVertical: 0,
                                paddingHorizontal: ds.space.sm,
                            }}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Feather name="x" size={18} color="rgba(0, 0, 0, 0.4)" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <RemoteState
                        loading={faqQuery.isLoading}
                        error={faqQuery.error as Error | null}
                        empty={!faqQuery.data?.length}
                        onRetry={() => void faqQuery.refetch()}
                    >
                        {filteredFaqs.map((faq, index) => {
                            const isExpanded = expandedFaqId === faq.id;
                            return (
                                <View key={faq.id}>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: ds.space.md }}
                                        onPress={() => toggleFaq(faq.id)}
                                    >
                                        <BodyLargeText style={{ color: '#111827', flex: 1, paddingRight: ds.space.md }}>{faq.question}</BodyLargeText>
                                        <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
                                    </TouchableOpacity>
                                    {isExpanded && (
                                        <View style={{ paddingBottom: ds.space.md }}>
                                            <BodySmallText style={{ color: '#6B7280' }}>{faq.answer}</BodySmallText>
                                        </View>
                                    )}
                                    {index < filteredFaqs.length - 1 && <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />}
                                </View>
                            );
                        })}
                        {filteredFaqs.length === 0 && (
                            <BodySmallText style={{ textAlign: 'center', color: '#6B7280', paddingVertical: ds.space.md }}>No FAQs found.</BodySmallText>
                        )}
                    </RemoteState>
                </View>

                {/* Links */}
                <View style={{ gap: ds.space.md, marginBottom: ds.space.xl }}>
                    <TouchableOpacity style={styles.linkCard} onPress={() => { setModalPurpose('support'); setFeedbackModalVisible(true); }}>
                        <Feather name="message-square" size={20} color="#111827" />
                        <BodyLargeText style={{ color: '#111827', marginLeft: ds.space.md }}>Contact Support</BodyLargeText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkCard} onPress={() => { setModalPurpose('feedback'); setFeedbackModalVisible(true); }}>
                        <Feather name="message-circle" size={20} color="#111827" />
                        <BodyLargeText style={{ color: '#111827', marginLeft: ds.space.md }}>Submit Feedback</BodyLargeText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkCard} onPress={() => void Linking.openURL(legalUrls.legal)}>
                        <Feather name="info" size={20} color="#111827" />
                        <BodyLargeText style={{ color: '#111827', marginLeft: ds.space.md }}>Privacy Policy / Terms</BodyLargeText>
                    </TouchableOpacity>
                </View>

                <Label style={{ marginBottom: ds.space.sm, color: '#374151' }}>App Version</Label>
                <View style={styles.linkCard}>
                    <BodyLargeText style={{ color: '#111827' }}>Version {Constants.expoConfig?.version ?? '1.0.0'} ({Constants.nativeBuildVersion ?? 'development'})</BodyLargeText>
                </View>

                <TouchableOpacity style={[styles.linkCard, { marginTop: ds.space.md }]} onPress={() => void Linking.openURL(legalUrls.legal)}>
                    <Feather name="briefcase" size={20} color="#111827" />
                    <BodyLargeText style={{ color: '#111827', marginLeft: ds.space.md }}>Legal Notices</BodyLargeText>
                </TouchableOpacity>

            </ScrollView>

            <BottomSheetModal 
                visible={isFeedbackModalVisible} 
                onClose={() => setFeedbackModalVisible(false)}
                heightPercentage={0.65}
            >
                <View style={{ flex: 1, paddingHorizontal: ds.space.md }}>
                    <H2Text style={{ textAlign: 'center', marginBottom: ds.space.lg }}>{modalPurpose === 'feedback' ? 'Share feedback' : 'Contact support'}</H2Text>
                    
                    {modalPurpose === 'feedback' ? <BodyLargeText style={{ textAlign: 'center', color: '#6B7280', marginBottom: ds.space.md }}>Your rating</BodyLargeText> : <BodySmallText style={{ textAlign: 'center', color: '#6B7280', marginBottom: ds.space.md }}>We usually reply by email to {runtimeConfig.supportEmail} enquiries and in your support conversation.</BodySmallText>}
                    
                    {modalPurpose === 'feedback' ? <View style={{ flexDirection: 'row', justifyContent: 'center', gap: ds.space.sm, marginBottom: ds.space.xl }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Ionicons 
                                    name={rating >= star ? "star" : "star-outline"} 
                                    size={32} 
                                    color="#111827" 
                                />
                            </TouchableOpacity>
                        ))}
                    </View> : null}

                    <TextInput
                        placeholder='Enter text'
                        placeholderTextColor={"#9CA3AF"}
                        multiline
                        textAlignVertical='top'
                        value={feedbackText}
                        onChangeText={setFeedbackText}
                        style={{
                            height: 150,
                            borderColor: '#E5E7EB',
                            borderWidth: 1,
                            borderRadius: ds.radius.md,
                            padding: ds.space.md,
                            fontFamily: Fonts.regular,
                            fontSize: ds.typography.bodyLarge.fontSize,
                            color: Colors.black,
                            marginBottom: ds.space.xl,
                        }}
                    />

                    <AppButton 
                        title={sendMessage.isPending ? 'Sending…' : modalPurpose === 'feedback' ? 'Submit feedback' : 'Send to support'}
                        disabled={!feedbackText.trim() || sendMessage.isPending}
                        loading={sendMessage.isPending}
                        onPress={() => sendMessage.mutate()}
                        style={{ backgroundColor: '#0A121A' }}
                    />
                </View>
            </BottomSheetModal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    linkCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        borderColor: '#E5E7EB',
        borderWidth: 1,
    }
});
