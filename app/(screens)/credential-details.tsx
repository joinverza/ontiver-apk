import AppButton from '@/components/shared/AppButton';
import AppHeader from '@/components/shared/AppHeader';
import { BodyLargeText, BodySmallText, Label } from '@/components/shared/AppTexts';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/fonts';
import { useDesignSystem } from '@/utils/design-system';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ASSETS } from '@/utils/assets';

export default function CredentialDetailsScreen() {
    const ds = useDesignSystem();

    const details = [
        { label: 'Full Name', value: 'Lawrence Gracious Paul' },
        { label: 'Date of Birth', value: '21st March 1995' },
        { label: 'ID Number', value: '923135092049' },
        { label: 'Gender', value: 'Male' },
        { label: 'Nationality', value: 'Nigerian' },
        { label: 'Expiry Date', value: '14th January, 2028' },
    ];

    const privacyInfo = [
        { id: 1, text: 'Your raw documents were never stored', icon: 'shield' },
        { id: 2, text: 'Data encrypted with AES-256 on this device only.', icon: 'lock' },
        { id: 3, text: 'This credential can be updated at any time.', icon: 'refresh-cw' },
    ];

    const sharingHistory = [
        { id: 1, name: 'Paystack', details: 'Shared Name, Email', time: '2 hours ago', status: 'Active', color: '#11B981' },
        { id: 2, name: 'Kuda Bank', details: 'Access revoked', time: 'Yesterday', status: 'Revoked', color: '#6B7280' },
        { id: 3, name: 'Binance', details: 'Shared KYC Verified', time: '3 days ago', status: 'Active', color: '#11B981' },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(248, 250, 252, 1)", paddingHorizontal: ds.space.lg }}>
            <AppHeader 
                title="National Identification" 
                rightComponent={
                    <TouchableOpacity style={{ width: ds.space['6xl'], alignItems: 'flex-end' }}>
                        <Feather name="more-vertical" size={24} color={Colors.mainText} />
                    </TouchableOpacity>
                }
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: ds.space['4xl'] }}>
                {/* Banner */}
                <ImageBackground
                    source={ASSETS.IMAGES.HOME_SLIDER_1}
                    style={{
                        marginTop: ds.space.xl,
                        borderRadius: ds.radius.lg,
                        padding: ds.space.xl,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: 140,
                        overflow: 'hidden'
                    }}
                >
                    <View style={{ flex: 1, zIndex: 10 }}>
                        <View style={{ 
                            borderWidth: 1, 
                            borderColor: 'rgba(255, 255, 255, 0.4)', 
                            borderRadius: 20, 
                            paddingHorizontal: ds.space.md, 
                            paddingVertical: 4, 
                            alignSelf: 'flex-start',
                            marginBottom: ds.space.md
                        }}>
                            <BodySmallText style={{ color: Colors.white, fontSize: 10 }}>NIN Verified</BodySmallText>
                        </View>
                        <BodyLargeText style={{ color: Colors.white }}>Lawrence</BodyLargeText>
                        <BodyLargeText style={{ color: Colors.white, fontFamily: Fonts.bold, fontSize: 24 }}>Gracious</BodyLargeText>
                        <BodySmallText style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10, marginTop: 4 }}>15-05-2026</BodySmallText>
                    </View>
                    <View style={{ 
                        width: 80, 
                        height: 80, 
                        backgroundColor: '#10B981', 
                        borderRadius: 40, 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        borderWidth: 4,
                        borderColor: 'rgba(16, 185, 129, 0.3)',
                        zIndex: 10
                    }}>
                        <Feather name="check" size={40} color={Colors.white} />
                    </View>
                </ImageBackground>

                {/* Credential Details */}
                <Label style={{ marginTop: ds.space.xl, marginBottom: ds.space.md }}>Credential Details</Label>
                <View style={{ backgroundColor: Colors.white, borderRadius: ds.radius.md, padding: ds.space.lg }}>
                    {details.map((item, index) => (
                        <View key={index} style={{ marginBottom: index === details.length - 1 ? 0 : ds.space.md }}>
                            <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 14 }}>{item.label}</BodyLargeText>
                            <BodySmallText style={{ marginTop: 2, color: 'rgba(5, 21, 14, 0.8)' }}>{item.value}</BodySmallText>
                            {index !== details.length - 1 && (
                                <View style={{ height: 1, backgroundColor: '#F3F4F6', marginTop: ds.space.sm }} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Issued By */}
                <View style={{ backgroundColor: Colors.white, borderRadius: ds.radius.md, padding: ds.space.lg, marginTop: ds.space.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.6)' }}>Issued By</BodySmallText>
                        <BodyLargeText style={{ fontFamily: Fonts.semiBold, marginTop: 2 }}>Qynara Identity Services</BodyLargeText>
                        <BodySmallText style={{ marginTop: 2, color: 'rgba(5, 21, 14, 0.6)' }}>Powered by Ontiver</BodySmallText>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.6)' }}>Issued:</BodySmallText>
                        <BodySmallText style={{ fontSize: 12 }}>14th May 2023</BodySmallText>
                    </View>
                </View>

                {/* Privacy Info */}
                <Label style={{ marginTop: ds.space.xl, marginBottom: ds.space.md }}>Privacy Info</Label>
                <View style={{ 
                    backgroundColor: 'rgba(208, 255, 221, 0.3)', 
                    borderRadius: ds.radius.md, 
                    padding: ds.space.lg, 
                    borderColor: 'rgba(0, 125, 33, 0.2)', 
                    borderWidth: 1,
                    gap: ds.space.md
                }}>
                    {privacyInfo.map((item) => (
                        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.sm }}>
                            <Feather name={item.icon as keyof typeof Feather.glyphMap} size={16} color="rgba(0, 125, 33, 1)" />
                            <BodySmallText style={{ flex: 1, color: 'rgba(5, 21, 14, 0.9)' }}>{item.text}</BodySmallText>
                        </View>
                    ))}
                </View>

                {/* Sharing History */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: ds.space.xl, marginBottom: ds.space.md }}>
                    <Label>Sharing History</Label>
                    <TouchableOpacity>
                        <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.4)' }}>See All</BodySmallText>
                    </TouchableOpacity>
                </View>
                
                <View style={{ backgroundColor: Colors.white, borderRadius: ds.radius.md, padding: ds.space.md, gap: ds.space.md }}>
                    {sharingHistory.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
                                    {/* Placeholder for logos */}
                                    <BodyLargeText style={{ fontFamily: Fonts.bold }}>{item.name[0]}</BodyLargeText>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <BodyLargeText style={{ fontFamily: Fonts.semiBold }}>{item.name}</BodyLargeText>
                                    <BodySmallText style={{ fontSize: 11 }}>{item.details}</BodySmallText>
                                    <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.5)', fontSize: 10, marginTop: 2 }}>{item.time}</BodySmallText>
                                </View>
                                <View style={{ 
                                    paddingHorizontal: ds.space.sm, 
                                    paddingVertical: 4, 
                                    backgroundColor: item.status === 'Active' ? 'rgba(208, 255, 221, 1)' : '#E5E7EB',
                                    borderRadius: 16
                                }}>
                                    <BodySmallText style={{ 
                                        color: item.status === 'Active' ? 'rgba(0, 125, 33, 1)' : '#4B5563', 
                                        fontSize: 10 
                                    }}>{item.status}</BodySmallText>
                                </View>
                            </View>
                            {index !== sharingHistory.length - 1 && (
                                <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />
                            )}
                        </React.Fragment>
                    ))}
                </View>
            </ScrollView>

            <View style={{ paddingVertical: ds.space.lg }}>
                <AppButton 
                    title="Share This Credential" 
                    onPress={() => {}} 
                    style={{ backgroundColor: '#021A0F' }}
                />
            </View>
        </SafeAreaView>
    );
}
