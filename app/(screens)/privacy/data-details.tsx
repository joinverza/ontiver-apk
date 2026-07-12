import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { H2Text, BodySmallText, BodyLargeText } from '@/components/shared/AppTexts';
import Colors from '@/constants/Colors';
import { ASSETS } from '@/utils/assets';
import { useDesignSystem } from '@/utils/design-system';
import AppHeader from '@/components/shared/AppHeader';
import AppButton from '@/components/shared/AppButton';

export default function DataDetails() {
    const ds = useDesignSystem();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors.white }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: ds.space['4xl'] }}>
                
                <View style={{ paddingHorizontal: ds.space.xl, marginTop: ds.space.md }}>
                    <AppHeader title="Who Has Your Data" />
                </View>

                <View style={styles.content}>
                    {/* Search Bar Placeholder for visual consistency with other screens if needed, 
                        or just the details below */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={18} color={Colors.grey200} />
                        <BodySmallText style={{ color: Colors.grey200, marginLeft: 8 }}>Search app...</BodySmallText>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={[styles.largeIcon, { backgroundColor: '#00C3F8' }]}>
                            <H2Text style={{ color: Colors.white, fontSize: 32 }}>P</H2Text>
                        </View>
                        
                        <H2Text style={{ marginTop: ds.space.lg }}>PayStack</H2Text>
                        <BodySmallText style={{ color: Colors.grey200, marginTop: 4 }}>100% Secure & Reliable</BodySmallText>
                        
                        <View style={{ width: '100%', marginTop: ds.space['3xl'], gap: ds.space.md }}>
                            <AppButton 
                                title="Revoke Access" 
                                style={{ backgroundColor: '#9C0000', borderWidth: 0 }}
                                textStyle={{ color: Colors.white }}
                                onPress={() => {}}
                            />
                            <AppButton 
                                title="Allow" 
                                style={{ backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.grey200 }}
                                textStyle={{ color: Colors.black }}
                                onPress={() => {}}
                            />
                        </View>
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
    content: {
        paddingHorizontal: 24,
        marginTop: 24,
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
        marginBottom: 40,
    },
    detailsContainer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    largeIcon: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00C3F8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    }
});
