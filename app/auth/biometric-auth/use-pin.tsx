import AppButton from "@/components/shared/AppButton"
import { BodyLargeText, BodySmallText, DisplayText, H2Text } from "@/components/shared/AppTexts"
import OtpInput from "@/components/shared/OtpInput"
import Colors from "@/constants/Colors"
import { useDesignSystem } from "@/utils/design-system"
import { router } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const BiometricAuth = () => {
    const ds = useDesignSystem()
    const [code, setCode] = useState("")
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: Colors.primary }}
        >
            <View style={{ padding: ds.space.xl, gap: ds.space.sm }}>
                <H2Text color={Colors.white}>Welcome back,</H2Text>
                <DisplayText color={Colors.white}>Chris Doe</DisplayText>
                <BodyLargeText color={Colors.white}>Use your biometric to access your vault.</BodyLargeText>
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
                <OtpInput
                    code={code}
                    setCode={setCode}
                    length={6}
                    isSecure
                />
                <AppButton
                    title="Continue"
                    onPress={() => router.push("/(tabs)")}
                />
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