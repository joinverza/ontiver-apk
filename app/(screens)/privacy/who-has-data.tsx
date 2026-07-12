import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { H2Text, BodySmallText, BodyLargeText } from '@/components/shared/AppTexts';
import Colors from '@/constants/Colors';
import { ASSETS } from '@/utils/assets';
import { useDesignSystem } from '@/utils/design-system';
import AppHeader from '@/components/shared/AppHeader';
import AppInput from '@/components/shared/AppInput';

const dataItems = [
    { id: '1', appName: 'PayStack', subtitle: 'Requested to access your profile details', status: 'Active', icon: 'P', color: '#00C3F8' },
    { id: '2', appName: 'Netflix', subtitle: 'Access revoked', status: 'Revoked', icon: 'N', color: '#E50914' },
    { id: '3', appName: 'Airbnb', subtitle: 'Requested to access your profile details', status: 'Active', icon: 'A', color: '#FF5A5F' },
];

export default function WhoHasData() {
    const ds = useDesignSystem();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors.white }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: ds.space['4xl'] }}>
                
                <View style={{ paddingHorizontal: ds.space.xl, marginTop: ds.space.md }}>
                    <AppHeader title="Who Has Your Data" />
                </View>

                <View style={{ paddingHorizontal: ds.space.xl, marginTop: ds.space.lg }}>
                    {/* Search Bar Placeholder */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={18} color={Colors.grey200} />
                        <BodySmallText style={{ color: Colors.grey200, marginLeft: 8 }}>Search app...</BodySmallText>
                    </View>

                    <View style={{ marginTop: ds.space.xl, gap: ds.space.lg }}>
                        {dataItems.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.appRow}>
                                <View style={styles.rowTop}>
                                    <View style={[styles.appIcon, { backgroundColor: item.color }]}>
                                        <BodyLargeText style={{ color: Colors.white, fontFamily: 'bold' }}>{item.icon}</BodyLargeText>
                                    </View>
                                    <View style={styles.appInfo}>
                                        <BodyLargeText style={{ fontFamily: 'bold' }}>{item.appName}</BodyLargeText>
                                        <BodySmallText style={{ color: Colors.grey200, fontSize: 12 }}>{item.subtitle}</BodySmallText>
                                    </View>
                                </View>
                                <View style={[
                                    styles.statusTag, 
                                    item.status === 'Active' ? styles.statusActive : styles.statusRevoked
                                ]}>
                                    <BodySmallText style={{ 
                                        color: item.status === 'Active' ? '#00D150' : '#FF3B30', 
                                        fontFamily: 'bold',
                                        fontSize: 12
                                    }}>
                                        {item.status}
                                    </BodySmallText>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    appRow: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        padding: 16,
    },
    rowTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    appIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    appInfo: {
        flex: 1,
    },
    statusTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusActive: {
        backgroundColor: 'rgba(0, 209, 80, 0.1)',
    },
    statusRevoked: {
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
    }
});
