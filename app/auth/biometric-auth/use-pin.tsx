import { BodyLargeText, BodySmallText, DisplayText, H2Text } from "@/components/shared/AppTexts"
import Colors from "@/constants/Colors"
import { useDesignSystem } from "@/utils/design-system"
import { router } from "expo-router"
import * as LocalAuthentication from 'expo-local-authentication'
import { KeyboardAvoidingView, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuthStore } from '@/store/authStore'

const BiometricAuth = () => {
    const ds = useDesignSystem()
    const user = useAuthStore((state) => state.user)
    const unlock = useAuthStore((state) => state.unlock)
    const authenticate = async () => {
        const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock Ontiver', fallbackLabel: 'Use device passcode', disableDeviceFallback: false })
        if (result.success) {
            unlock()
            router.replace('/(tabs)')
        }
    }
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: Colors.primary }}
        >
            <View style={{ padding: ds.space.xl, gap: ds.space.sm }}>
                <H2Text color={Colors.white}>Welcome back,</H2Text>
                <DisplayText color={Colors.white}>{user?.fullName || 'Welcome back'}</DisplayText>
                <BodyLargeText color={Colors.white}>Use your device security to access your vault.</BodyLargeText>
            </View>
            <KeyboardAvoidingView
                style={{
                    padding: ds.space.xl,
                    gap: ds.space["3xl"],
                    backgroundColor: Colors.white,
                    borderTopLeftRadius: ds.radius['4xl'],
                    borderTopRightRadius: ds.radius['4xl'],
                    flex: 1,
                    justifyContent: "space-between"
                }}
                behavior="padding"
                keyboardVerticalOffset={50}
            >
                <TouchableOpacity onPress={() => void authenticate()}>
                    <BodyLargeText style={{ textAlign: 'center' }}>Unlock with device security</BodyLargeText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/auth/account-recovery")}>
                    <BodySmallText style={{ textAlign: "center" }} color="rgba(5, 21, 14, 0.4)">
                        Forgot PIN or lost device?
                    </BodySmallText>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default BiometricAuth
