import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { H2Text, BodyLargeText } from '../../components/shared/AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import AppButton from '../../components/shared/AppButton';

export default function ScanSuccessScreen() {
    const ds = useDesignSystem();
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(248, 250, 252, 1)", padding: ds.space.lg, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ 
                width: 100, 
                height: 100, 
                borderRadius: 50, 
                backgroundColor: '#D0FFDD', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: ds.space.xl
            }}>
                <Feather name="check" size={48} color="#007D21" />
            </View>

            <H2Text style={{ marginBottom: ds.space.sm }}>Success!</H2Text>
            <BodyLargeText style={{ textAlign: 'center', color: '#6B7280', marginBottom: ds.space['4xl'] }}>
                You have successfully approved the identity request using Zero-Knowledge Proof.
            </BodyLargeText>

            <View style={{ width: '100%' }}>
                <AppButton 
                    title="Go Back Home" 
                    onPress={() => router.replace('/(tabs)')} 
                    style={{ backgroundColor: '#0A121A' }}
                />
            </View>
        </SafeAreaView>
    );
}
