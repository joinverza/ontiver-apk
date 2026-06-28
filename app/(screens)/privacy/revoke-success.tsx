import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H2Text, BodySmallText, BodyLargeText } from '@/components/shared/AppTexts';
import Colors from '@/constants/Colors';
import { ASSETS } from '@/utils/assets';
import { useDesignSystem } from '@/utils/design-system';
import AppHeader from '@/components/shared/AppHeader';
import AppButton from '@/components/shared/AppButton';

export default function RevokeSuccess() {
    const ds = useDesignSystem();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors.white }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: ds.space['4xl'] }}>
                
                <View style={{ paddingHorizontal: ds.space.xl, marginTop: ds.space.md }}>
                    <AppHeader title="Who Has Your Data" />
                </View>

                <View style={styles.content}>
                    
                    <View style={styles.iconContainer}>
                        {/* Placeholder for the black starburst checkmark */}
                        <View style={styles.burstIcon}>
                            <H2Text style={{ color: Colors.white, fontSize: 40 }}>✓</H2Text>
                        </View>
                    </View>

                    <H2Text style={{ marginTop: ds.space['2xl'], textAlign: 'center' }}>Access Revoked</H2Text>
                    <BodyLargeText style={{ color: Colors.grey200, marginTop: ds.space.sm, textAlign: 'center', paddingHorizontal: ds.space.xl }}>
                        You have successfully revoked access for PayStack.
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
    burstIcon: {
        width: 100,
        height: 100,
        backgroundColor: Colors.black,
        borderRadius: 20, // using border radius as a generic placeholder for the starburst shape
        transform: [{ rotate: '45deg' }],
        justifyContent: 'center',
        alignItems: 'center',
    }
});
