import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { ASSETS } from '../../utils/assets';
import { useDesignSystem } from '../../utils/design-system';
import AppButton from './AppButton';
import { BodyLargeText, H2Text } from './AppTexts';
import { BottomSheetModal } from './BottomSheetModal';

// Dummy SVG placeholders for logos
export const PaystackLogo = () => (
    <View style={{ width: 40, height: 40, backgroundColor: '#E0F2FE', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 20, height: 4, backgroundColor: '#0EA5E9', marginBottom: 2 }} />
        <View style={{ width: 24, height: 4, backgroundColor: '#0EA5E9', marginBottom: 2 }} />
        <View style={{ width: 16, height: 4, backgroundColor: '#0EA5E9' }} />
    </View>
);

export const FlutterwaveLogo = () => (
    <View style={{ width: 40, height: 40, backgroundColor: '#FFF7ED', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="infinite" size={24} color="#F97316" />
    </View>
);

export type ModalState = 'NONE' | 'CONFIRM' | 'LOADING' | 'SUCCESS';

interface RevokeAccessModalProps {
    visible: boolean;
    company: { name: string; id: number } | null;
    onClose: () => void;
}

export function RevokeAccessModal({ visible, company, onClose }: RevokeAccessModalProps) {
    const ds = useDesignSystem();
    const [modalState, setModalState] = useState<ModalState>('NONE');

    // Reset state when visibility changes
    useEffect(() => {
        if (visible) {
            setModalState('CONFIRM');
        } else {
            setModalState('NONE');
        }
    }, [visible]);

    // Animation for dots
    const [dot1] = useState(new Animated.Value(0));
    const [dot2] = useState(new Animated.Value(0));
    const [dot3] = useState(new Animated.Value(0));
    const [dot4] = useState(new Animated.Value(0));

    useEffect(() => {
        if (modalState === 'LOADING') {
            const animateDot = (dot: Animated.Value, delay: number) => {
                return Animated.sequence([
                    Animated.delay(delay),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(dot, { toValue: -10, duration: 300, useNativeDriver: true }),
                            Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
                            Animated.delay(600)
                        ])
                    )
                ]);
            };

            Animated.parallel([
                animateDot(dot1, 0),
                animateDot(dot2, 150),
                animateDot(dot3, 300),
                animateDot(dot4, 450)
            ]).start();

            // Transition to success after 3 seconds
            const timer = setTimeout(() => {
                setModalState('SUCCESS');
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            // Reset animations
            dot1.setValue(0);
            dot2.setValue(0);
            dot3.setValue(0);
            dot4.setValue(0);
        }
    }, [modalState]);

    const renderDot = (anim: Animated.Value) => (
        <Animated.View style={[styles.loadingDot, { transform: [{ translateY: anim }] }]} />
    );

    const isSuccess = modalState === 'SUCCESS';

    return (
        <BottomSheetModal
            visible={visible}
            onClose={onClose}
            heightPercentage={isSuccess ? 0.6 : 0.5}
        >
            {modalState === 'CONFIRM' && (
                <View style={styles.modalBody}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ds.space.xl }}>
                        {company?.name.toLowerCase().includes('paystack') ? <PaystackLogo /> : <FlutterwaveLogo />}
                        <H2Text style={{ marginLeft: ds.space.sm }}>{company?.name}</H2Text>
                    </View>

                    <H2Text style={{ textAlign: 'center', marginBottom: ds.space.xs }}>Revoke Access?</H2Text>
                    <BodyLargeText style={{ textAlign: 'center', color: Colors.secondaryText, marginBottom: ds.space.xl }}>
                        This will remove {company?.name}'s access.
                    </BodyLargeText>

                    <AppButton
                        title="Yes, Revoke Access"
                        onPress={() => setModalState('LOADING')}
                        style={{ backgroundColor: '#B91C1C', marginBottom: ds.space.md }}
                        textStyle={{ color: Colors.white }}
                    />
                    <AppButton
                        title="Cancel"
                        variant="outline"
                        onPress={onClose}
                    />
                </View>
            )}

            {modalState === 'LOADING' && (
                <View style={[styles.modalBody, { justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: ds.space.xl, marginTop: ds.space['4xl'] }}>
                        {renderDot(dot1)}
                        {renderDot(dot2)}
                        {renderDot(dot3)}
                        {renderDot(dot4)}
                    </View>
                    <BodyLargeText>Revoking...</BodyLargeText>
                </View>
            )}

            {modalState === 'SUCCESS' && (
                <View style={[styles.modalBody, { justifyContent: 'center', alignItems: 'center', paddingTop: ds.space.lg }]}>
                    <ASSETS.AUTH.VERIFICATION_SUCCESS width={120} height={120} style={{ marginBottom: ds.space.lg }} />
                    <H2Text style={{ textAlign: 'center', marginBottom: ds.space.xs }}>Access Revoked</H2Text>
                    <BodyLargeText style={{ textAlign: 'center', color: Colors.secondaryText, marginBottom: ds.space.xl }}>
                        {company?.name} no longer has access.{'\n'}Your Privacy Score improved by +5 pts
                    </BodyLargeText>

                    <AppButton
                        title="Done"
                        onPress={onClose}
                        style={{ backgroundColor: Colors.black, width: '100%' }}
                        textStyle={{ color: Colors.white }}
                    />
                </View>
            )}
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    modalBody: {
        padding: 16,
        flex: 1,
    },
    loadingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0F1A24',
    }
});
