import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BodyLargeText, BodySmallText } from './AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { ASSETS } from '../../utils/assets';

interface RecentActivityCardProps {
    title: string;
    date: string;
    status: 'Verified' | 'Pending' | 'Declined' | string;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ title, date, status }) => {
    const ds = useDesignSystem();

    const renderColors = () => {
        if (status === "Verified") return { bg: "rgba(208, 255, 221, 1)", text: "rgba(0, 125, 33, 1)", icon: ASSETS.ICONS.HOME_CHECKMARK };
        if (status === "Pending") return { bg: "rgba(255, 230, 208, 1)", text: "rgba(170, 81, 2, 1)", icon: ASSETS.ICONS.HOME_ALERT };
        if (status === "Declined") return { bg: "rgba(255, 208, 209, 1)", text: "rgba(125, 0, 2, 1)", icon: ASSETS.ICONS.HOME_CANCEL };
        return { bg: Colors.white, text: Colors.mainText, icon: null };
    }

    const colors = renderColors();
    const Icon = colors?.icon;

    return (
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: ds.space.md, padding: ds.space.md, backgroundColor: Colors.white, borderRadius: ds.space.md }}>
            <ASSETS.ICONS.HOME_RECENT_ACTIVITY />
            <View style={{ flex: 1 }}>
                <BodyLargeText>{title}</BodyLargeText>
                <BodySmallText>{date}</BodySmallText>
            </View>
            <View style={{ flexDirection: "row", width: 90, backgroundColor: colors?.bg, height: 40, justifyContent: "center", alignItems: "center", borderRadius: 30, gap: ds.space.xs }}>
                {Icon && <Icon width={14} height={14} />}
                <BodySmallText style={{ color: colors?.text }} size={12}>{status}</BodySmallText>
            </View>
        </TouchableOpacity>
    );
};
