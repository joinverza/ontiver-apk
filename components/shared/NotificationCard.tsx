import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BodyLargeText, BodySmallText } from './AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { Feather } from '@expo/vector-icons';

interface NotificationCardProps {
    title: string;
    description: string;
    time: string;
    iconName: keyof typeof Feather.glyphMap;
    iconColor?: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ title, description, time, iconName, iconColor = Colors.mainText }) => {
    const ds = useDesignSystem();

    return (
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "flex-start", gap: ds.space.md, padding: ds.space.md, backgroundColor: Colors.white, borderRadius: ds.space.md }}>
            <View style={{ marginTop: 2 }}>
                <Feather name={iconName} size={24} color={iconColor} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
                <BodyLargeText style={{ fontWeight: "500" }}>{title}</BodyLargeText>
                <BodySmallText>{description}</BodySmallText>
                <BodySmallText style={{ color: "rgba(5, 21, 14, 0.4)", marginTop: ds.space.xs }}>{time}</BodySmallText>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", height: 24 }}>
                <Feather name="arrow-right" size={20} color={Colors.mainText} />
            </View>
        </TouchableOpacity>
    );
};
