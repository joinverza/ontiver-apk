import { BodyLargeText, BodySmallText, Label } from '@/components/shared/AppTexts';
import BackButton from '@/components/shared/BackButton';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/fonts';
import { useDesignSystem } from '@/utils/design-system';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function PlainListSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const ds = useDesignSystem();

    return (
        <View style={{ gap: ds.space.sm }}>
            <Label style={{ color: 'rgba(5,21,14,0.52)', fontSize: 13, marginLeft: ds.space.xs, fontFamily: Fonts.semiBold }}>{title}</Label>
            <View style={{
                backgroundColor: Colors.white,
                borderRadius: ds.radius.xl,
                paddingVertical: ds.space.sm,
                paddingHorizontal: ds.space.lg,
                borderWidth: 1,
                borderColor: 'rgba(5,21,14,0.06)'
            }}>
                {children}
            </View>
        </View>
    );
}

function CredentialRow({
    title,
    detail,
    icon,
    status,
    onPress,
}: {
    title: string;
    detail: string;
    icon: keyof typeof Feather.glyphMap;
    status: string;
    onPress?: () => void;
}) {
    const ds = useDesignSystem();
    const isLocked = status === 'Locked';

    const getStatusStyles = () => {
        if (status === 'Available') {
            return { color: '#166534', bg: '#ECFDF3', icon: 'check-circle' as const };
        }
        if (status === 'Unavailable') {
            return { color: '#B45309', bg: '#FFFBEB', icon: 'alert-triangle' as const };
        }
        if (status === 'Locked') {
            return { color: 'rgba(5,21,14,0.4)', bg: 'rgba(5,21,14,0.04)', icon: 'lock' as const };
        }
        return { color: Colors.mainText, bg: '#F3F4F6', icon: 'info' as const };
    };

    const statusStyles = getStatusStyles();

    const rowStyle = {
        minHeight: 66,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: ds.space.lg,
        paddingVertical: ds.space.sm,
        paddingHorizontal: ds.space.sm,
        marginHorizontal: -ds.space.sm,
        borderRadius: ds.radius.md,
        opacity: isLocked ? 0.6 : 1,
    };

    const content = (
        <>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(5,21,14,0.04)', justifyContent: 'center', alignItems: 'center' }}>
                <Feather name={icon} size={20} color='rgba(5,21,14,0.72)' />
            </View>

            <View style={{ flex: 1, gap: 2 }}>
                <BodyLargeText style={{ color: '#05150E', fontFamily: Fonts.semiBold, fontSize: 16 }}>{title}</BodyLargeText>
                <BodySmallText style={{ color: 'rgba(5,21,14,0.46)', fontSize: 12 }}>{detail}</BodySmallText>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: statusStyles.bg,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: ds.radius.full
            }}>
                <Feather name={statusStyles.icon} size={10} color={statusStyles.color} />
                <BodySmallText style={{ color: statusStyles.color, fontSize: 10, fontFamily: Fonts.bold }}>{status.toUpperCase()}</BodySmallText>
            </View>
        </>
    );

    if (onPress && !isLocked) {
        return (
            <Pressable
                onPress={onPress}
                hitSlop={8}
                android_ripple={{ color: 'rgba(22,101,52,0.08)', borderless: false }}
                style={({ pressed }) => [
                    rowStyle,
                    {
                        backgroundColor: pressed ? 'rgba(22,101,52,0.06)' : 'transparent',
                    },
                ]}
            >
                {content}
            </Pressable>
        );
    }

    return <View style={rowStyle}>{content}</View>;
}

export default function AddCredentialScreen() {
    const ds = useDesignSystem();
    const { top, bottom } = useSafeAreaInsets();

    const credentialsList = [
        {
            id: 1,
            title: 'NIN',
            description: 'National Identity Number',
            icon: 'user' as keyof typeof Feather.glyphMap,
            status: 'Available',
        },
        {
            id: 2,
            title: 'BVN',
            description: 'Bank Verification Number',
            icon: 'hash' as keyof typeof Feather.glyphMap,
            status: 'Available',
        },
        {
            id: 3,
            title: 'Passport',
            description: 'International Passport',
            icon: 'book' as keyof typeof Feather.glyphMap,
            status: 'Unavailable',
        },
        {
            id: 4,
            title: 'Drivers Licence',
            description: 'National Drivers Licence',
            icon: 'truck' as keyof typeof Feather.glyphMap,
            status: 'Unavailable',
        },
        {
            id: 5,
            title: 'Voters Card',
            description: 'Permanent Voters Card',
            icon: 'credit-card' as keyof typeof Feather.glyphMap,
            status: 'Unavailable',
        },
        {
            id: 6,
            title: 'Phone Number',
            description: 'Verify your phone number',
            icon: 'phone' as keyof typeof Feather.glyphMap,
            status: 'Unavailable',
        },
        {
            id: 7,
            title: 'Home Address',
            description: 'Prove where you live',
            icon: 'map-pin' as keyof typeof Feather.glyphMap,
            status: 'Unavailable',
        },
        {
            id: 8,
            title: 'Email Address',
            description: 'Verify email check',
            icon: 'mail' as keyof typeof Feather.glyphMap,
            status: 'Available',
        },
        {
            id: 9,
            title: 'Proof of Income',
            description: 'Upload payslip or bank statement',
            icon: 'briefcase' as keyof typeof Feather.glyphMap,
            status: 'Locked',
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC', paddingTop: top }}>
            <Animated.View entering={FadeInDown.duration(360)} style={{ paddingHorizontal: ds.space.lg, paddingVertical: ds.space.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ds.space.sm }}>
                    <BackButton />
                    <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 24, color: '#05150E', marginLeft: ds.space.md }}>Add Credential</BodyLargeText>
                </View>
                <BodySmallText style={{ color: 'rgba(5,21,14,0.52)', fontSize: 13, marginLeft: 40 }}>Expand your vault with more verified data</BodySmallText>
            </Animated.View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: ds.space.lg,
                    paddingTop: ds.space.xl,
                    paddingBottom: bottom + ds.space['4xl'],
                    gap: ds.space.xl
                }}
            >
                <Animated.View entering={FadeInUp.delay(70).duration(360)}>
                    <PlainListSection title="Available Connections">
                        {credentialsList.map((item, index) => (
                            <View key={item.id}>
                                <CredentialRow
                                    title={item.title}
                                    detail={item.description}
                                    icon={item.icon}
                                    status={item.status}
                                    onPress={() => { }}
                                />
                                {index < credentialsList.length - 1 && (
                                    <View style={{ height: 1, backgroundColor: 'rgba(5,21,14,0.04)', marginHorizontal: ds.space.sm }} />
                                )}
                            </View>
                        ))}
                    </PlainListSection>
                </Animated.View>
            </ScrollView>
        </View>
    );
}
