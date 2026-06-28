import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { BodySmallText } from './AppTexts';
import { useDesignSystem } from '../../utils/design-system';
import { Colors } from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';

interface FilterTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    const ds = useDesignSystem();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ds.space.lg }}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ gap: ds.space.sm, paddingRight: ds.space.md }}
                style={{ flex: 1 }}
            >
                {tabs.map((tab) => {
                    const isActive = tab === activeTab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => onTabChange(tab)}
                            style={{
                                paddingHorizontal: ds.space.lg,
                                paddingVertical: ds.space.sm,
                                borderRadius: 20,
                                backgroundColor: isActive ? '#E5E7EB' : Colors.white,
                                borderWidth: isActive ? 0 : 1,
                                borderColor: '#E5E7EB',
                            }}
                        >
                            <BodySmallText style={{ color: isActive ? Colors.mainText : '#6B7280' }}>
                                {tab}
                            </BodySmallText>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            <TouchableOpacity style={{
                padding: ds.space.sm,
                borderRadius: ds.space.md,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                marginLeft: ds.space.sm
            }}>
                <Feather name="calendar" size={20} color={Colors.mainText} />
            </TouchableOpacity>
        </View>
    );
};
