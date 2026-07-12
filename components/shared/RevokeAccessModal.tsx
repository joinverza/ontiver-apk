import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { ASSETS } from '../../utils/assets';
import { useDesignSystem } from '../../utils/design-system';
import AppButton from './AppButton';
import { BodyLargeText, BodySmallText, H2Text } from './AppTexts';
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
    const { bottom } = useSafeAreaInsets();
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
    const companyName = company?.name ?? 'This company';
    const bottomPadding = Math.max(bottom + ds.space.md, ds.space.xl);
    const partnerLogo = companyName.toLowerCase().includes('paystack') ? <PaystackLogo /> : <FlutterwaveLogo />;

    return (
        <BottomSheetModal
            visible={visible}
            onClose={onClose}
            heightPercentage={isSuccess ? 0.6 : 0.56}
            contentStyle={{ backgroundColor: '#F8FAFC' }}
        >
            {modalState === 'CONFIRM' && (
                <View style={[styles.modalBody, { paddingBottom: bottomPadding }]}>
                    <View style={styles.partnerStrip}>
                        {partnerLogo}
                        <View style={{ flex: 1 }}>
                            <BodySmallText style={styles.kicker}>Privacy access</BodySmallText>
                            <H2Text style={{ fontSize: 20, lineHeight: 25 }}>{companyName}</H2Text>
                        </View>
                        <View style={styles.connectedBadge}>
                            <BodySmallText style={styles.connectedText}>Connected</BodySmallText>
                        </View>
                    </View>

                    <View style={styles.warningPanel}>
                        <View style={styles.warningIcon}>
                            <Ionicons name="shield-outline" size={28} color="#BE123C" />
                        </View>
                        <H2Text style={{ textAlign: 'center', fontSize: 22, lineHeight: 28 }}>Revoke data access?</H2Text>
                        <BodyLargeText style={{ textAlign: 'center', color: 'rgba(5, 21, 14, 0.62)', lineHeight: 22 }}>
                            This removes {companyName}'s access to the data you previously shared.
                        </BodyLargeText>
                    </View>

                    <View style={styles.infoPanel}>
                        <View style={styles.infoRow}>
                            <Ionicons name="lock-closed-outline" size={18} color="#166534" />
                            <BodySmallText style={styles.infoText}>Future requests will require fresh permission.</BodySmallText>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="trending-up-outline" size={18} color="#166534" />
                            <BodySmallText style={styles.infoText}>Your Privacy Score may improve after revocation.</BodySmallText>
                        </View>
                    </View>

                    <View style={{ marginTop: 'auto', gap: ds.space.md }}>
                        <AppButton
                            title="Yes, Revoke Access"
                            onPress={() => setModalState('LOADING')}
                            style={{ backgroundColor: '#BE123C', borderRadius: ds.radius.lg }}
                            textStyle={{ color: Colors.white }}
                        />
                        <AppButton
                            title="Cancel"
                            variant="outline"
                            onPress={onClose}
                            style={{ borderRadius: ds.radius.lg, borderColor: '#E5E7EB' }}
                            textStyle={{ color: Colors.black }}
                        />
                    </View>
                </View>
            )}

            {modalState === 'LOADING' && (
                <View style={[styles.modalBody, { justifyContent: 'center', alignItems: 'center', paddingBottom: bottomPadding }]}>
                    <View style={styles.warningIcon}>
                        <Ionicons name="shield-half-outline" size={30} color="#166534" />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: ds.space.xl, marginTop: ds.space.xl }}>
                        {renderDot(dot1)}
                        {renderDot(dot2)}
                        {renderDot(dot3)}
                        {renderDot(dot4)}
                    </View>
                    <H2Text style={{ marginBottom: ds.space.xs }}>Revoking access</H2Text>
                    <BodyLargeText style={{ color: 'rgba(5, 21, 14, 0.62)', textAlign: 'center' }}>
                        Updating your privacy permissions now.
                    </BodyLargeText>
                </View>
            )}

            {modalState === 'SUCCESS' && (
                <View style={[styles.modalBody, { justifyContent: 'center', alignItems: 'center', paddingTop: ds.space.lg, paddingBottom: bottomPadding }]}>
                    <ASSETS.AUTH.VERIFICATION_SUCCESS width={120} height={120} style={{ marginBottom: ds.space.lg }} />
                    <H2Text style={{ textAlign: 'center', marginBottom: ds.space.xs }}>Access Revoked</H2Text>
                    <BodyLargeText style={{ textAlign: 'center', color: 'rgba(5, 21, 14, 0.62)', marginBottom: ds.space.xl, lineHeight: 22 }}>
                        {companyName} no longer has access.{'\n'}Your Privacy Score improved by +5 pts
                    </BodyLargeText>

                    <AppButton
                        title="Done"
                        onPress={onClose}
                        style={{ backgroundColor: Colors.black, width: '100%', borderRadius: ds.radius.lg }}
                        textStyle={{ color: Colors.white }}
                    />
                </View>
            )}
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    modalBody: {
        paddingHorizontal: 16,
        paddingTop: 10,
        flex: 1,
    },
    partnerStrip: {
        minHeight: 70,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 18,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        marginBottom: 18,
    },
    kicker: {
        color: 'rgba(5, 21, 14, 0.48)',
        fontSize: 11,
        fontWeight: '600',
    },
    connectedBadge: {
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: '#ECFDF3',
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    connectedText: {
        color: '#166534',
        fontSize: 10,
        fontWeight: '700',
    },
    warningPanel: {
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    warningIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF1F2',
        borderWidth: 1,
        borderColor: '#FECDD3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoPanel: {
        borderRadius: 18,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 14,
        gap: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoText: {
        flex: 1,
        color: 'rgba(5, 21, 14, 0.62)',
        lineHeight: 18,
    },
    loadingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0F1A24',
    }
});
