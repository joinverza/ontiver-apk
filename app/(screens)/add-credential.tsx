import { BodyLargeText, BodySmallText, H2Text } from '@/components/shared/AppTexts';
import BackButton from '@/components/shared/BackButton';
import { Colors } from '@/constants/Colors';
import { useDesignSystem } from '@/utils/design-system';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddCredentialScreen() {
    const ds = useDesignSystem();
    const insets = useSafeAreaInsets();

    const credentialsList = [
        {
            id: 1,
            title: 'Government ID',
            description: 'Verified identity document',
            icon: 'user' as keyof typeof Feather.glyphMap,
            status: 'Verified',
        },
        {
            id: 2,
            title: 'Phone Number',
            description: 'Verify your phone number',
            icon: 'phone' as keyof typeof Feather.glyphMap,
            status: 'Unverified',
        },
        {
            id: 3,
            title: 'Home Address',
            description: 'Prove where you live',
            icon: 'map-pin' as keyof typeof Feather.glyphMap,
            status: 'Unverified',
        },
        {
            id: 4,
            title: 'Email Address',
            description: 'Verify email check',
            icon: 'mail' as keyof typeof Feather.glyphMap,
            status: 'Verified',
        },
        {
            id: 5,
            title: 'Proof of Income',
            description: 'Upload payslip or bank statement',
            icon: 'briefcase' as keyof typeof Feather.glyphMap,
            status: 'Locked',
        },
    ];

    const getStatusStyles = (status: string) => {
        if (status === 'Verified') {
            return { color: 'rgba(0, 125, 33, 1)', borderColor: 'rgba(0, 125, 33, 1)', icon: 'check-circle' as const };
        }
        if (status === 'Unverified') {
            return { color: 'rgba(170, 81, 2, 1)', borderColor: 'rgba(170, 81, 2, 1)', icon: 'alert-triangle' as const };
        }
        if (status === 'Locked') {
            return { color: 'rgba(217, 119, 6, 0.5)', borderColor: 'rgba(217, 119, 6, 0.2)', icon: 'lock' as const, bg: 'rgba(255, 237, 213, 0.3)' };
        }
        return { color: Colors.mainText, borderColor: Colors.mainText, icon: 'info' as const };
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.primary }}>
            <View style={{ paddingVertical: insets.top, paddingHorizontal: ds.space.lg, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', marginBottom: ds.space.md }}>
                    <BackButton color="white" />
                    <H2Text style={{ color: Colors.white, flex: 1, textAlign: 'center' }}>Add a Credential</H2Text>
                    <View style={{ width: 40 }} />
                </View>
                <BodyLargeText style={{ color: Colors.white, marginBottom: ds.space.xl }}>Expand your vault with more verified data</BodyLargeText>
            </View>

            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.white,
                    borderTopLeftRadius: ds.radius['4xl'],
                    borderTopRightRadius: ds.radius['4xl'],
                    paddingHorizontal: ds.space.lg,
                    paddingTop: ds.space.xl,
                }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: ds.space['4xl'] }}>
                    {credentialsList.map((item) => {
                        const statusStyles = getStatusStyles(item.status);
                        const isLocked = item.status === 'Locked';

                        return (
                            <TouchableOpacity
                                key={item.id}
                                disabled={isLocked}
                                style={{
                                    borderColor: '#E5E7EB',
                                    borderWidth: 1,
                                    borderRadius: ds.radius.md,
                                    padding: ds.space.md,
                                    marginBottom: ds.space.md,
                                    opacity: isLocked ? 0.6 : 1,
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: ds.space.md }}>
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: '#E5E7EB',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Feather name={item.icon} size={20} color={Colors.mainText} />
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 4,
                                        paddingHorizontal: ds.space.sm,
                                        paddingVertical: 4,
                                        borderRadius: ds.radius.xs,
                                        borderWidth: 0.5,
                                        borderColor: statusStyles.borderColor,
                                        backgroundColor: statusStyles.bg || 'transparent'
                                    }}>
                                        <Feather name={statusStyles.icon} size={12} color={statusStyles.color} />
                                        <BodySmallText style={{ color: statusStyles.color, fontSize: 10 }}>{item.status}</BodySmallText>
                                    </View>
                                </View>
                                <View>
                                    <BodyLargeText style={{ fontWeight: '600' }}>{item.title}</BodyLargeText>
                                    <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.7)', marginTop: 2 }}>{item.description}</BodySmallText>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
}
