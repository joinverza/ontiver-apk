import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppHeader from '../../components/shared/AppHeader';
import { BodyLargeText, BodySmallText, H2Text, Label } from '../../components/shared/AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import AppButton from '../../components/shared/AppButton';
import { BottomSheetModal } from '../../components/shared/BottomSheetModal';
import { Fonts } from '../../constants/fonts';

const CustomSwitch = ({ value, onValueChange }: { value: boolean, onValueChange: (v: boolean) => void }) => {
    return (
        <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => onValueChange(!value)}
            style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                borderWidth: value ? 0 : 1,
                borderColor: '#111827',
                backgroundColor: value ? '#0A121A' : 'transparent',
                justifyContent: 'center',
                paddingHorizontal: 2,
            }}
        >
            <View style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: value ? '#FFFFFF' : 'transparent',
                borderColor: '#111827',
                borderWidth: value ? 0 : 1,
                transform: [{ translateX: value ? 20 : 0 }],
            }} />
        </TouchableOpacity>
    );
};

export default function IdentityRequestScreen() {
    const ds = useDesignSystem();
    const router = useRouter();
    const [zkpEnabled, setZkpEnabled] = useState(false);
    const [isZkpModalVisible, setZkpModalVisible] = useState(false);
    
    // Toggles state
    const [toggles, setToggles] = useState({
        fullName: true,
        dob: false,
        nin1: false,
        nin2: false,
        nationality: false,
        kycStatus: false,
    });

    const toggleItem = (key: keyof typeof toggles) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(248, 250, 252, 1)", paddingHorizontal: ds.space.lg }}>
            <AppHeader title="Identity Request" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: ds.space['4xl'], marginTop: ds.space.xl }}>
                
                {/* Verification Header Card */}
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
                        <Ionicons name="qr-code-outline" size={32} color="#111827" />
                        <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 16 }}>In-person verification</BodyLargeText>
                    </View>
                </View>

                {/* Company Card */}
                <View style={[styles.card, { marginTop: ds.space.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
                        {/* Fake Logo */}
                        <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                            <H2Text style={{ color: '#4C1D95', fontSize: 32 }}>K</H2Text>
                        </View>
                        <View>
                            <BodyLargeText style={{ fontFamily: Fonts.bold }}>Paystack</BodyLargeText>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Feather name="check-circle" size={12} color="#059669" />
                                <BodySmallText style={{ color: '#059669', fontSize: 12 }}>Verified Business</BodySmallText>
                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <BodySmallText style={{ color: '#6B7280', fontSize: 12 }}>Expires:</BodySmallText>
                        <BodySmallText style={{ color: '#059669', fontFamily: Fonts.semiBold }}>02:45:04</BodySmallText>
                    </View>
                </View>

                {/* Stated Purpose */}
                <Label style={{ marginTop: ds.space.xl, marginBottom: ds.space.xs, color: '#111827' }}>Stated purpose:</Label>
                <View style={[styles.card, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                    <BodyLargeText style={{ color: '#111827' }}>To verify your eligibility for a loan application.</BodyLargeText>
                    <BodySmallText style={{ color: '#6B7280', fontSize: 10, marginTop: 4 }}>Requested: 2 mins ago</BodySmallText>
                </View>

                {/* Requested Information */}
                <Label style={{ marginTop: ds.space.xl, marginBottom: ds.space.md, color: '#111827' }}>Requested Information:</Label>
                <View style={styles.card}>
                    {[
                        { key: 'fullName', label: 'Full Name' },
                        { key: 'dob', label: 'Date of Birth' },
                        { key: 'nin1', label: 'NIN Number' },
                        { key: 'nin2', label: 'NIN Number' },
                        { key: 'nationality', label: 'Nationality' },
                        { key: 'kycStatus', label: 'KYC Status' },
                    ].map((item, index, array) => (
                        <View key={index}>
                            <View style={styles.toggleRow}>
                                <BodyLargeText style={{ color: '#111827' }}>{item.label}</BodyLargeText>
                                <CustomSwitch 
                                    value={toggles[item.key as keyof typeof toggles]} 
                                    onValueChange={() => toggleItem(item.key as keyof typeof toggles)} 
                                />
                            </View>
                            {index < array.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}
                </View>

                {/* ZKP Toggle */}
                <View style={[styles.card, { marginTop: ds.space.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.sm }} onPress={() => setZkpModalVisible(true)}>
                        <Feather name="info" size={18} color="#111827" />
                        <BodyLargeText style={{ color: '#111827' }}>Use Zero-Knowledge Proof instead</BodyLargeText>
                    </TouchableOpacity>
                    <CustomSwitch value={zkpEnabled} onValueChange={setZkpEnabled} />
                </View>

                {/* Safe Note */}
                <View style={[styles.card, { marginTop: ds.space.md, backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', flexDirection: 'row', alignItems: 'center', gap: ds.space.md }]}>
                    <Feather name="shield" size={24} color="#059669" />
                    <View style={{ flex: 1 }}>
                        <BodySmallText style={{ color: '#111827' }}>Sharing with this company is safe.</BodySmallText>
                        <BodySmallText style={{ color: '#111827' }}>They are a Qynara-verified business.</BodySmallText>
                    </View>
                </View>

            </ScrollView>

            <View style={{ flexDirection: 'row', gap: ds.space.md, paddingVertical: ds.space.lg }}>
                <AppButton 
                    title="Approve" 
                    onPress={() => router.replace('/(screens)/scan-success')} 
                    style={{ flex: 1, backgroundColor: '#0A121A' }}
                />
                <AppButton 
                    title="Deny" 
                    onPress={() => router.back()} 
                    variant="outline"
                    style={{ flex: 1 }}
                    textStyle={{ color: Colors.black }}
                />
            </View>

            {/* ZKP Modal */}
            <BottomSheetModal 
                visible={isZkpModalVisible} 
                onClose={() => setZkpModalVisible(false)}
                heightPercentage={0.65}
            >
                <View style={{ flex: 1, paddingHorizontal: ds.space.md, alignItems: 'center' }}>
                    <H2Text style={{ textAlign: 'center', marginBottom: ds.space['2xl'] }}>What is a Zero-{'\n'}Knowledge Proof?</H2Text>
                    
                    <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#1E3A8A', justifyContent: 'center', alignItems: 'center', marginBottom: ds.space['2xl'] }}>
                        <H2Text style={{ color: '#FFFFFF', fontSize: 64, fontFamily: Fonts.bold }}>?</H2Text>
                    </View>

                    <BodyLargeText style={{ textAlign: 'center', color: '#111827', lineHeight: 24, marginBottom: ds.space['3xl'] }}>
                        Imagine proving you're over 18 without showing your date of birth. That's exactly what a zero-knowledge proof does. A company will know you meet the requirement — but they'll never see the actual data.
                    </BodyLargeText>

                    <View style={{ width: '100%', marginBottom: ds.space.lg }}>
                        <AppButton 
                            title="Got It" 
                            onPress={() => setZkpModalVisible(false)} 
                            style={{ backgroundColor: '#0A121A' }}
                        />
                    </View>
                    
                    <TouchableOpacity>
                        <BodySmallText style={{ color: '#9CA3AF' }}>Learn more about ZKP</BodySmallText>
                    </TouchableOpacity>
                </View>
            </BottomSheetModal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        borderColor: '#E5E7EB',
        borderWidth: 1,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    }
});
