import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BodyLargeText, BodySmallText } from './AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { Fonts } from '../../constants/fonts';

interface SharingHistoryCardProps {
    name: string;
    details: string;
    time: string;
    status: 'Active' | 'Revoked' | 'Denied' | string;
    onPress: () => void;
}

export const SharingHistoryCard: React.FC<SharingHistoryCardProps> = ({ name, details, time, status, onPress }) => {
    const ds = useDesignSystem();

    const getStatusStyles = () => {
        if (status === 'Active') return { bg: 'rgba(208, 255, 221, 1)', text: 'rgba(0, 125, 33, 1)' };
        if (status === 'Revoked') return { bg: '#F3F4F6', text: '#4B5563' };
        if (status === 'Denied') return { bg: 'rgba(255, 208, 209, 1)', text: 'rgba(125, 0, 2, 1)' };
        return { bg: Colors.white, text: Colors.mainText };
    };

    const statusStyles = getStatusStyles();

    return (
        <TouchableOpacity 
            onPress={onPress}
            style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: ds.space.md, 
                padding: ds.space.md, 
                backgroundColor: Colors.white, 
                borderRadius: ds.radius.xl,
                borderColor: '#E5E7EB',
                borderWidth: 1,
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 2,
            }}
        >
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
                <BodyLargeText style={{ fontFamily: Fonts.bold }}>{name.charAt(0)}</BodyLargeText>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
                <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 15 }}>{name}</BodyLargeText>
                <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.7)' }}>{details}</BodySmallText>
                <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.5)', marginTop: 4, fontSize: 11 }}>{time}</BodySmallText>
            </View>
            <View style={{ 
                paddingHorizontal: ds.space.sm, 
                paddingVertical: 6, 
                backgroundColor: statusStyles.bg, 
                borderRadius: ds.radius.full 
            }}>
                <BodySmallText style={{ color: statusStyles.text, fontSize: 10, fontFamily: Fonts.medium }}>{status}</BodySmallText>
            </View>
        </TouchableOpacity>
    );
};
