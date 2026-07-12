import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { BodyLargeText, BodySmallText } from './AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { Fonts } from '../../constants/fonts';

interface SharingHistoryCardProps {
    name: string;
    details: string;
    time: string;
    status: 'Active' | 'Revoked' | 'Denied' | string;
    purpose?: string;
    onPress: () => void;
}

export function getShareStatusStyles(status: string) {
    if (status === 'Active') {
        return { bg: '#ECFDF3', text: '#047A35', border: '#BBF7D0', dot: '#16A34A' };
    }
    if (status === 'Revoked') {
        return { bg: '#F4F5F7', text: '#4B5563', border: '#E5E7EB', dot: '#6B7280' };
    }
    if (status === 'Denied') {
        return { bg: '#FFF1F2', text: '#9F1239', border: '#FECDD3', dot: '#E11D48' };
    }
    return { bg: Colors.white, text: Colors.mainText, border: Colors.grey200, dot: Colors.mainText };
}

export function getSharePartnerMeta(name: string) {
    const key = name.toLowerCase();

    if (key.includes('flutterwave')) {
        return { bg: '#EFF8FF', border: '#BAE6FD', accent: '#0284C7' };
    }
    if (key.includes('kuda')) {
        return { bg: '#F4F0FF', border: '#DDD6FE', accent: '#5B21B6' };
    }
    if (key.includes('binance')) {
        return { bg: '#FFF8DB', border: '#FDE68A', accent: '#B7791F' };
    }
    if (key.includes('opay')) {
        return { bg: '#ECFEFF', border: '#A5F3FC', accent: '#0891B2' };
    }
    if (key.includes('paystack')) {
        return { bg: '#EEFDF3', border: '#BBF7D0', accent: '#166534' };
    }

    return { bg: '#F8FAFC', border: '#E2E8F0', accent: '#334155' };
}

export function SharePartnerIcon({ name, size = 26 }: { name: string; size?: number }) {
    const meta = getSharePartnerMeta(name);
    const key = name.toLowerCase();

    if (key.includes('flutterwave')) {
        return (
            <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
                <Path d="M5 17c4.2-5.2 8.7-5.2 13.4 0 2.4 2.7 5.1 2.7 8.1 0" stroke={meta.accent} strokeWidth="2.6" strokeLinecap="round" />
                <Path d="M5 23c4.2-5.2 8.7-5.2 13.4 0 2.4 2.7 5.1 2.7 8.1 0" stroke={meta.accent} strokeWidth="2.6" strokeLinecap="round" opacity="0.45" />
                <Circle cx="22" cy="9" r="3.2" fill={meta.accent} opacity="0.22" />
            </Svg>
        );
    }

    if (key.includes('kuda')) {
        return (
            <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
                <Path d="M5 13.5 16 7l11 6.5V16H5v-2.5Z" fill={meta.accent} opacity="0.14" />
                <Path d="M5 13.5 16 7l11 6.5M7.5 16h17M9 16v8M15.8 16v8M22.5 16v8M6.5 25.5h19" stroke={meta.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        );
    }

    if (key.includes('binance')) {
        return (
            <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
                <Path d="M16 5.5 21.1 10.6 16 15.7 10.9 10.6 16 5.5Z" fill={meta.accent} />
                <Path d="M8.2 13.3 12.1 17.2 8.2 21.1 4.3 17.2 8.2 13.3ZM23.8 13.3 27.7 17.2 23.8 21.1 19.9 17.2 23.8 13.3ZM16 18.8 21.1 23.9 16 29 10.9 23.9 16 18.8Z" fill={meta.accent} opacity="0.72" />
            </Svg>
        );
    }

    if (key.includes('opay')) {
        return (
            <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
                <Rect x="7" y="6" width="18" height="21" rx="4" stroke={meta.accent} strokeWidth="2.3" />
                <Path d="M12 12h8M12 17h5M13 23h6" stroke={meta.accent} strokeWidth="2.3" strokeLinecap="round" />
                <Circle cx="22.5" cy="18.5" r="3.5" fill={meta.accent} opacity="0.18" />
            </Svg>
        );
    }

    if (key.includes('paystack')) {
        return (
            <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
                <Rect x="6" y="8" width="18" height="4" rx="2" fill={meta.accent} />
                <Rect x="6" y="14" width="21" height="4" rx="2" fill={meta.accent} opacity="0.74" />
                <Rect x="6" y="20" width="14" height="4" rx="2" fill={meta.accent} opacity="0.48" />
            </Svg>
        );
    }

    return (
        <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
            <Path d="M16 4 25 8v7.4c0 5.7-3.7 9.9-9 12.6-5.3-2.7-9-6.9-9-12.6V8l9-4Z" stroke={meta.accent} strokeWidth="2.3" strokeLinejoin="round" />
            <Path d="M12 16.2 14.7 19l5.5-6" stroke={meta.accent} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

export const SharingHistoryCard: React.FC<SharingHistoryCardProps> = ({ name, details, time, status, purpose, onPress }) => {
    const ds = useDesignSystem();
    const statusStyles = getShareStatusStyles(status);
    const partnerMeta = getSharePartnerMeta(name);
    const detailRows = [
        { eyebrow: 'Shared data', value: details, icon: 'layers' as const },
        { eyebrow: 'Purpose', value: purpose ?? 'Identity verification', icon: 'shield' as const },
        { eyebrow: 'Last activity', value: time, icon: 'clock' as const },
    ];

    return (
        <TouchableOpacity
            activeOpacity={0.86}
            onPress={onPress}
            style={{
                overflow: 'hidden',
                backgroundColor: Colors.white,
                borderRadius: ds.radius.lg,
                borderColor: '#E5E7EB',
                borderWidth: 1,
            }}
        >
            <View style={{ padding: ds.space.lg, gap: ds.space.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
                    <View style={{
                        width: 48,
                        height: 48,
                        borderRadius: ds.radius.lg,
                        backgroundColor: partnerMeta.bg,
                        borderColor: partnerMeta.border,
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <SharePartnerIcon name={name} size={28} />
                    </View>

                    <View style={{ flex: 1, gap: 3 }}>
                        <BodyLargeText numberOfLines={1} style={{ fontFamily: Fonts.bold, fontSize: 17, color: '#05150E' }}>{name}</BodyLargeText>
                        <BodySmallText numberOfLines={1} style={{ color: 'rgba(5, 21, 14, 0.52)', fontFamily: Fonts.medium, fontSize: 12 }}>
                            Data sharing request
                        </BodySmallText>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        paddingHorizontal: ds.space.sm,
                        paddingVertical: 6,
                        backgroundColor: statusStyles.bg,
                        borderRadius: ds.radius.full,
                        borderColor: statusStyles.border,
                        borderWidth: 1,
                    }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusStyles.dot }} />
                        <BodySmallText style={{ color: statusStyles.text, fontSize: 10, fontFamily: Fonts.bold }}>{status}</BodySmallText>
                    </View>
                </View>

                <View style={{ borderRadius: ds.radius.md, overflow: 'hidden', borderWidth: 1, borderColor: '#EEF2F6' }}>
                    {detailRows.map((row, index) => (
                        <View
                            key={row.eyebrow}
                            style={{
                                minHeight: 62,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: ds.space.md,
                                paddingHorizontal: ds.space.md,
                                backgroundColor: index % 2 === 0 ? '#F8FAFC' : Colors.white,
                                borderBottomWidth: index === detailRows.length - 1 ? 0 : 1,
                                borderBottomColor: '#EEF2F6',
                            }}
                        >
                            <View style={{
                                width: 34,
                                height: 34,
                                borderRadius: ds.radius.full,
                                backgroundColor: partnerMeta.bg,
                                borderWidth: 1,
                                borderColor: partnerMeta.border,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Feather name={row.icon} size={16} color={partnerMeta.accent} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.42)', fontFamily: Fonts.medium, fontSize: 11 }}>{row.eyebrow}</BodySmallText>
                                <BodyLargeText numberOfLines={1} style={{ color: '#05150E', fontFamily: Fonts.semiBold, fontSize: 14, marginTop: 1 }}>{row.value}</BodyLargeText>
                            </View>
                            <View style={{
                                width: 30,
                                height: 30,
                                borderRadius: ds.radius.full,
                                backgroundColor: Colors.white,
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Feather name="arrow-right" size={15} color="rgba(5, 21, 14, 0.7)" />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
};
