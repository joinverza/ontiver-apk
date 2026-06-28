import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/shared/AppHeader';
import { FilterTabs } from '../../components/shared/FilterTabs';
import { NotificationCard } from '../../components/shared/NotificationCard';
import { useDesignSystem } from '../../utils/design-system';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function NotificationsScreen() {
    const ds = useDesignSystem();
    const [activeTab, setActiveTab] = useState('All');

    const notificationTabs = ['All', 'Request', 'Alerts', 'Pill tabs'];

    const notificationsData: { id: string; title: string; description: string; time: string; iconName: keyof typeof Feather.glyphMap; iconColor?: string; type: string; }[] = [
        { 
            id: '1', 
            title: 'Identity Request', 
            description: 'Paystack wants to verify your identity.', 
            time: '2 mins ago', 
            iconName: 'arrow-up-circle', 
            type: 'Request' 
        },
        { 
            id: '2', 
            title: 'Identity shared successfully', 
            description: 'Your verified credentials were securely ...', 
            time: '24 mins ago', 
            iconName: 'arrow-up-circle', 
            type: 'Request' 
        },
        { 
            id: '3', 
            title: 'Your Privacy Score increased to 86', 
            description: 'Revoking old shares improved your privacy...', 
            time: '1 hour ago', 
            iconName: 'trending-up', 
            type: 'Alerts' 
        },
        { 
            id: '4', 
            title: 'Government ID verification expires soon', 
            description: 'Your National ID verification will expire in 7 ...', 
            time: 'Yesterday · 6:45 PM', 
            iconName: 'clock', 
            type: 'Alerts' 
        },
        { 
            id: '5', 
            title: 'Phone number added successfully', 
            description: 'Your phone number is now verified and ...', 
            time: 'Yesterday · 2:12 PM', 
            iconName: 'phone', 
            type: 'Alerts' 
        },
        { 
            id: '6', 
            title: 'Exercise caution before sharing', 
            description: 'Opay is requesting access to your identity d...', 
            time: 'Yesterday · 11:02 AM', 
            iconName: 'alert-triangle', 
            iconColor: 'rgba(220, 38, 38, 1)',
            type: 'Alerts' 
        },
    ];

    const filteredData = activeTab === 'All' 
        ? notificationsData 
        : notificationsData.filter(item => item.type === activeTab || activeTab === 'Pill tabs');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(248, 250, 252, 1)", paddingHorizontal: ds.space.lg }}>
            <AppHeader 
                title="All Notifications" 
                rightComponent={
                    <TouchableOpacity style={{ width: ds.space['6xl'], alignItems: 'flex-end' }}>
                        <Feather name="inbox" size={24} color={Colors.mainText} />
                    </TouchableOpacity>
                }
            />
            
            <View style={{ marginTop: ds.space.xl, flex: 1 }}>
                <FilterTabs 
                    tabs={notificationTabs} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />

                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <NotificationCard 
                            title={item.title}
                            description={item.description}
                            time={item.time}
                            iconName={item.iconName}
                            iconColor={item.iconColor}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: ds.space.sm }} />}
                    contentContainerStyle={{ paddingBottom: ds.space.xl }}
                />
            </View>
        </SafeAreaView>
    );
}
