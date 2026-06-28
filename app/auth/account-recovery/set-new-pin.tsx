import AppButton from "@/components/shared/AppButton"
import { BodySmallText, H2Text } from "@/components/shared/AppTexts"
import BackButton from "@/components/shared/BackButton"
import OtpInput from "@/components/shared/OtpInput"
import Colors from "@/constants/Colors"
import { useDesignSystem } from "@/utils/design-system"
import { router } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const SetNewPin = () => {
    const ds = useDesignSystem()
    const [pin, setPin] = useState("")
    const [confirmPin, setConfirmPin] = useState("")
    return (
        <SafeAreaView style={{ flex: 1, paddingBottom: ds.space.xl, backgroundColor: Colors.white }}>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={{ flex: 1 }}>
                <View style={{ flex: 1, gap: ds.space.xl }}>
                    <BackButton />
                    <View style={{ marginBottom: ds.space.lg }}>
                        <H2Text>Set a New PIN</H2Text>
                        <BodySmallText color={Colors.black}>
                            This PIN is your backup access method. Keep it private and memorable.
                        </BodySmallText>
                    </View>
                    <View
                        style={{
                            gap: ds.space.md
                        }}
                    >
                        <BodySmallText>Input Pin</BodySmallText>
                        <OtpInput
                            code={pin}
                            setCode={setPin}
                            length={6}
                            isSecure
                        />
                    </View>
                    <View
                        style={{
                            gap: ds.space.md
                        }}
                    >
                        <BodySmallText>Confirm Pin</BodySmallText>
                        <OtpInput
                            code={confirmPin}
                            setCode={setConfirmPin}
                            length={6}
                            isSecure
                        />
                    </View>
                </View>
                <AppButton title="Confirm" onPress={() => router.push("/auth/account-recovery/success")} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SetNewPin