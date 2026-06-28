import React from 'react';
import { View } from 'react-native';
import { H2Text } from './AppTexts';
import BackButton from './BackButton';
import { useDesignSystem } from '../../utils/design-system';

interface AppHeaderProps {
    title: string;
    rightComponent?: React.ReactNode;
    color?: "primary" | "white";
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, rightComponent, color = "primary" }) => {
    const ds = useDesignSystem();
    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <BackButton color={color} />
            <H2Text style={{ color: color === "white" ? "#FFFFFF" : undefined }}>{title}</H2Text>
            {rightComponent ? rightComponent : <View style={{ width: ds.space['6xl'] }} />}
        </View>
    );
};

export default AppHeader;
