import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H2Text, BodyLargeText } from '@/components/shared/AppTexts';
import Colors from '@/constants/Colors';
import { useDesignSystem } from '@/utils/design-system';
import AppHeader from '@/components/shared/AppHeader';
import AppButton from '@/components/shared/AppButton';

export default function BreachAlert() {
    const ds = useDesignSystem();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors.white }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: ds.space['4xl'] }}>
                
                <View style={{ paddingHorizontal: ds.space.xl, marginTop: ds.space.md }}>
                    <AppHeader title="Who Has Your Data" />
                </View>

                <View style={styles.content}>
                    
                    <View style={styles.iconContainer}>
                        <View style={styles.alertIcon}>
                            <H2Text style={{ color: '#FF3B30', fontSize: 48, fontWeight: 'bold' }}>!</H2Text>
                        </View>
                    </View>

                    <H2Text style={{ marginTop: ds.space['2xl'], textAlign: 'center' }}>Data Breach Alert</H2Text>
                    <BodyLargeText style={{ color: Colors.grey200, marginTop: ds.space.sm, textAlign: 'center', paddingHorizontal: ds.space.xl }}>
                        We detected a potential data breach affecting your information. Please take immediate action to secure your accounts.
                    </BodyLargeText>

                    <View style={{ width: '100%', marginTop: 60 }}>
                        <AppButton 
                            title="Okay" 
                            style={{ backgroundColor: Colors.black }}
                            textStyle={{ color: Colors.white }}
                            onPress={() => {}}
                        />
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
        marginTop: 60,
        alignItems: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertIcon: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
