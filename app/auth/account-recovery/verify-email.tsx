import AppButton from "@/components/shared/AppButton"
import { BodySmallText, H2Text } from "@/components/shared/AppTexts"
import BackButton from "@/components/shared/BackButton"
import OtpInput from "@/components/shared/OtpInput"
import Colors from "@/constants/Colors"
import { useToast } from "@/context/ToastContext"
import { useDesignSystem } from "@/utils/design-system"
import { router } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const VerifyEmail = () => {
    const ds = useDesignSystem()
    const toast = useToast()
    const [countDown, setCountDown] = useState(59)
    const [code, setCode] = useState("")
    return (
        <SafeAreaView style={{ flex: 1, paddingBottom: ds.space.xl, backgroundColor: Colors.white }}>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <BackButton />
                    <View style={{ marginVertical: ds.space.lg }}>
                        <H2Text>Check your email</H2Text>
                        <BodySmallText color={Colors.black}>
                            We sent a reset link to alpha...@gmail.com
                            enter 6 digit code that mentioned in the email
                        </BodySmallText>
                    </View>
                    <OtpInput
                        code={code}
                        setCode={setCode}
                        isSecure={false}
                        length={6}
                        inputStyle={{

                        }}
                    />
                </View>
                <AppButton title="Verify Code" onPress={() => router.push("/auth/account-recovery/enter-recovery-code")} />
                <BodySmallText size={12} style={{ textAlign: "center", paddingVertical: ds.space.md }}>
                    Haven’t got the email yet? <Text style={{ color: "#648DDB" }}>Resend code in 00:34</Text>
                </BodySmallText>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default VerifyEmail