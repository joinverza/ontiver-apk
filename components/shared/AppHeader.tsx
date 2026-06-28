import React from 'react';
import { View } from 'react-native';
import { H2Text } from './AppTexts';
import BackButton from './BackButton';
import { useDesignSystem } from '../../utils/design-system';

interface AppHeaderProps {
    title: string;
    rightComponent?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, rightComponent }) => {
    const ds = useDesignSystem();
    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <BackButton />
            <H2Text>{title}</H2Text>
            {rightComponent ? rightComponent : <View style={{ width: ds.space['6xl'] }} />}
        </View>
    );
};

export default AppHeader;
