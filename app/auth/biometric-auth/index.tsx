import { BodyLargeText, BodySmallText, DisplayText, H2Text } from "@/components/shared/AppTexts"
import Colors from "@/constants/Colors"
import { ASSETS } from "@/utils/assets"
import { useDesignSystem } from "@/utils/design-system"
import { router } from "expo-router"
import * as LocalAuthentication from 'expo-local-authentication';
import { TouchableOpacity, View, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuthStore } from '@/store/authStore';

const BiometricAuth = () => {
    const ds = useDesignSystem()
    const user = useAuthStore((state) => state.user)
    const unlock = useAuthStore((state) => state.unlock)

    const handleBiometricAuth = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to access your vault',
                fallbackLabel: 'Use PIN',
            });

            if (result.success) {
                unlock();
                router.replace("/(tabs)");
            }
        } else {
            Alert.alert("Not Available", "Biometric authentication is not set up or available on this device.");
        }
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: Colors.primary }}
        >
            <View style={{ padding: ds.space.xl, gap: ds.space.sm }}>
                <H2Text color={Colors.white}>Welcome back,</H2Text>
                <DisplayText color={Colors.white}>{user?.fullName || 'Welcome back'}</DisplayText>
                <BodyLargeText color={Colors.white}>Use your biometric to access your vault.</BodyLargeText>
            </View>
            <View
                style={{
                    padding: ds.space.xl,
                    gap: ds.space["3xl"],
                    backgroundColor: Colors.white,
                    borderTopLeftRadius: ds.radius['4xl'],
                    borderTopRightRadius: ds.radius['4xl'],
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity onPress={handleBiometricAuth}>
                    <ASSETS.ICONS.BIOMETRIC_LOGIN color={Colors.primary} width={150} height={150} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/auth/biometric-auth/use-pin")}>
                    <BodyLargeText style={{ textAlign: "center" }}>
                        Use PIN instead
                    </BodyLargeText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/auth/account-recovery" as any)}>
                    <BodySmallText style={{ textAlign: "center" }} color="rgba(5, 21, 14, 0.4)">
                        Forgot PIN or lost device?
                    </BodySmallText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default BiometricAuth
