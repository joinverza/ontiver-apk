import Colors from '@/constants/Colors';
import { Feather, Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDesignSystem } from '../../utils/design-system';

export default function ScanScreen() {
    const ds = useDesignSystem();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [torch, setTorch] = useState(false);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.container, { backgroundColor: '#D2EBE0', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ textAlign: 'center', marginBottom: 20, color: '#000' }}>We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={{ padding: 10, backgroundColor: '#0A121A', borderRadius: 8 }}>
                    <Text style={{ color: 'white' }}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;
        setScanned(true);
        router.replace('/(screens)/identity-request');
        setTimeout(() => setScanned(false), 2000);
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors.primary }]}>
            <View style={{ paddingTop: insets.top + ds.space.md, paddingHorizontal: ds.space.lg }}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={[styles.scannerWrapper, { borderRadius: ds.radius.xl }]}>
                    {/* The camera is now literally just a 300x300 square */}
                    <CameraView
                        style={styles.camera}
                        facing="back"
                        enableTorch={torch}
                        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                    />

                    {/* Corner Borders over the camera feed */}
                    <View style={[styles.corner, styles.topLeftCorner, { borderRadius: ds.radius.lg }]} />
                    <View style={[styles.corner, styles.topRightCorner, { borderRadius: ds.radius.lg }]} />
                    <View style={[styles.corner, styles.bottomLeftCorner, { borderRadius: ds.radius.lg }]} />
                    <View style={[styles.corner, styles.bottomRightCorner, { borderRadius: ds.radius.lg }]} />
                </View>

                {/* Torch Button under the scanner */}
                <View style={{ marginTop: ds.space['4xl'] }}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => setTorch(!torch)}>
                        <Ionicons name="flashlight" size={20} color={torch ? "#007D21" : "#000000"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    scannerWrapper: {
        width: 300,
        height: 300,
        position: 'relative',
        backgroundColor: '#FFF',
        overflow: 'hidden', // Keep the camera strictly inside the 300x300 box with rounded corners
    },
    camera: {
        flex: 1,
    },
    corner: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderColor: Colors.white,
        zIndex: 10,
    },
    topLeftCorner: {
        top: 20,
        left: 20,
        borderTopWidth: 8,
        borderLeftWidth: 8,
    },
    topRightCorner: {
        top: 20,
        right: 20,
        borderTopWidth: 8,
        borderRightWidth: 8,
    },
    bottomLeftCorner: {
        bottom: 20,
        left: 20,
        borderBottomWidth: 8,
        borderLeftWidth: 8,
    },
    bottomRightCorner: {
        bottom: 20,
        right: 20,
        borderBottomWidth: 8,
        borderRightWidth: 8,
    },
    actionButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
});
