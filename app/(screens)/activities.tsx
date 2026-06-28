import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/shared/AppHeader';
import { FilterTabs } from '../../components/shared/FilterTabs';
import { RecentActivityCard } from '../../components/shared/RecentActivityCard';
import { useDesignSystem } from '../../utils/design-system';

export default function ActivitiesScreen() {
    const ds = useDesignSystem();
    const [activeTab, setActiveTab] = useState('All');

    const activitiesTabs = ['All', 'Active', 'Revoked', 'Denied'];

    const activitiesData = [
        { id: '1', title: 'Credential Added', date: '15th April, 2026', status: 'Verified' },
        { id: '2', title: 'Credential Added', date: '15th April, 2026', status: 'Pending' },
        { id: '3', title: 'Credential Added', date: '15th April, 2026', status: 'Declined' },
        { id: '4', title: 'Credential Added', date: '15th April, 2026', status: 'Verified' },
        { id: '5', title: 'Credential Added', date: '15th April, 2026', status: 'Declined' },
        { id: '6', title: 'Credential Added', date: '15th April, 2026', status: 'Pending' },
    ];

    const filteredData = activeTab === 'All' 
        ? activitiesData 
        : activitiesData.filter(item => {
            if (activeTab === 'Active' && item.status === 'Verified') return true;
            if (activeTab === 'Revoked' && item.status === 'Declined') return true;
            if (activeTab === 'Denied' && item.status === 'Declined') return true;
            return false;
        });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(248, 250, 252, 1)", paddingHorizontal: ds.space.lg }}>
            <AppHeader title="Activities" />
            
            <View style={{ marginTop: ds.space.xl, flex: 1 }}>
                <FilterTabs 
                    tabs={activitiesTabs} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />

                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RecentActivityCard 
                            title={item.title}
                            date={item.date}
                            status={item.status}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: ds.space.lg }} />}
                    contentContainerStyle={{ paddingBottom: ds.space.xl }}
                />
            </View>
        </SafeAreaView>
    );
}
