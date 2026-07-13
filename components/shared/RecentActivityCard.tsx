import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BodyLargeText, BodySmallText } from './AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { Fonts } from '../../constants/fonts';

interface RecentActivityCardProps {
    title: string;
    date: string;
    status: 'Verified' | 'Pending' | 'Declined' | string;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ title, date, status }) => {
    const ds = useDesignSystem();

    const renderColors = () => {
        if (status === "Verified") return { bg: "#ECFDF3", text: "#166534", border: "#BBF7D0", icon: "check-circle" as const };
        if (status === "Pending") return { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA", icon: "clock" as const };
        if (status === "Declined") return { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3", icon: "x-circle" as const };
        return { bg: Colors.white, text: Colors.mainText, border: "#E5E7EB", icon: "activity" as const };
    }

    const colors = renderColors();

    return (
        <TouchableOpacity activeOpacity={0.86} style={{ minHeight: 76, flexDirection: "row", alignItems: "center", gap: ds.space.md, padding: ds.space.md, backgroundColor: Colors.white, borderRadius: ds.radius.lg, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ width: 44, height: 44, borderRadius: ds.radius.full, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name={colors.icon} size={20} color={colors.text} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
                <BodyLargeText style={{ color: '#05150E', fontFamily: Fonts.semiBold, fontSize: 15 }}>{title}</BodyLargeText>
                <BodySmallText style={{ color: 'rgba(5,21,14,0.48)', fontSize: 12 }}>{date}</BodySmallText>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 5 }}>
                <BodySmallText style={{ color: colors.text, fontFamily: Fonts.bold, fontSize: 12 }}>{status}</BodySmallText>
                <Feather name="arrow-right" size={16} color="rgba(5,21,14,0.42)" />
            </View>
        </TouchableOpacity>
    );
};
