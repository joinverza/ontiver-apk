import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BodyLargeText, BodySmallText } from './AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { Fonts } from '../../constants/fonts';
import { Feather } from '@expo/vector-icons';

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
        if (status === 'Revoked') return { bg: '#E5E7EB', text: '#4B5563' };
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
                borderRadius: ds.space.md,
                borderColor: '#E5E7EB',
                borderWidth: 1,
            }}
        >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
                <BodyLargeText style={{ fontFamily: Fonts.bold }}>{name.charAt(0)}</BodyLargeText>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
                <BodyLargeText style={{ fontFamily: Fonts.semiBold }}>{name}</BodyLargeText>
                <BodySmallText>{details}</BodySmallText>
                <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.5)', marginTop: ds.space.xs }}>{time}</BodySmallText>
            </View>
            <View style={{ 
                paddingHorizontal: ds.space.sm, 
                paddingVertical: 6, 
                backgroundColor: statusStyles.bg, 
                borderRadius: 16 
            }}>
                <BodySmallText style={{ color: statusStyles.text, fontSize: 10 }}>{status}</BodySmallText>
            </View>
        </TouchableOpacity>
    );
};
