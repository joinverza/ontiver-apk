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
    if (status === 'Revoked') {
        return { bg: '#F8FAFC', text: 'rgba(5, 21, 14, 0.52)', border: '#E5E7EB', dot: 'rgba(5, 21, 14, 0.3)' };
    }
    if (status === 'Denied') {
        return { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA', dot: '#B91C1C' };
    }

    return { bg: '#ECFDF3', text: Colors.primary, border: 'rgba(22, 101, 52, 0.18)', dot: Colors.primary };
}

export function getSharePartnerMeta(name: string) {
    return { bg: '#F8FAFC', border: '#E5E7EB', accent: Colors.primary };
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
        { label: 'Shared Data', value: details },
        { label: 'Purpose', value: purpose ?? 'Identity verification' },
        { label: 'Last Activity', value: time },
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
            <View style={{ paddingHorizontal: ds.space.lg, paddingTop: ds.space.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
                    <View style={{
                        width: 42,
                        height: 42,
                        borderRadius: ds.radius.full,
                        backgroundColor: '#F8FAFC',
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <SharePartnerIcon name={name} size={24} />
                    </View>

                    <View style={{ flex: 1, gap: 3 }}>
                        <BodyLargeText numberOfLines={1} style={{ fontFamily: Fonts.semiBold, fontSize: 15, color: '#05150E' }}>{name}</BodyLargeText>
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
                        {/* <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusStyles.dot }} /> */}
                        <BodySmallText style={{ color: statusStyles.text, fontSize: 10, fontFamily: Fonts.bold }}>{status}</BodySmallText>
                    </View>
                </View>

                <View style={{ marginTop: ds.space.md }}>
                    {detailRows.map((row, index) => (
                        <View
                            key={row.label}
                            style={{
                                minHeight: 58,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: ds.space.lg,
                                borderBottomWidth: index === detailRows.length - 1 ? 0 : 1,
                                borderBottomColor: 'rgba(5, 21, 14, 0.07)',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <BodyLargeText numberOfLines={1} style={{ color: '#05150E', fontFamily: Fonts.semiBold, fontSize: 14 }}>{row.label}</BodyLargeText>
                                <BodySmallText numberOfLines={1} style={{ color: 'rgba(5, 21, 14, 0.42)', fontFamily: Fonts.medium, fontSize: 12, marginTop: 3 }}>{row.value}</BodySmallText>
                            </View>
                            <Feather name="arrow-right" size={18} color="rgba(5, 21, 14, 0.3)" />
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
};
