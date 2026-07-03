import AppButton from "@/components/shared/AppButton"
import AppInput from "@/components/shared/AppInput"
import { BodySmallText, H2Text } from "@/components/shared/AppTexts"
import BackButton from "@/components/shared/BackButton"
import Colors from "@/constants/Colors"
import { useDesignSystem } from "@/utils/design-system"
import { router } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Text, View, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const EnterRecoveryCode = () => {
    const [email, setEmail] = useState("")
    const ds = useDesignSystem()
    return (
        <SafeAreaView style={{ flex: 1, paddingBottom: ds.space.xl, backgroundColor: Colors.white }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <BackButton />
                    <View style={{ marginBottom: ds.space.lg }}>
                        <H2Text>Enter Your Recovery Code</H2Text>
                        <BodySmallText color={Colors.black}>
                            Enter the 8-character code you saved when setting up Ontiver.
                        </BodySmallText>
                    </View>
                    <AppInput
                        placeholderTextColor={Colors.grey200}
                        value={email}
                        onChangeText={setEmail}

                    />
                </View>
                <AppButton title="Verify Code" onPress={() => router.push("/auth/account-recovery/success")} />
                <BodySmallText size={12} style={{ textAlign: "center", paddingVertical: ds.space.md }}>
                    Haven’t got the email yet? <Text style={{ color: "#648DDB" }}>Resend code</Text>
                </BodySmallText>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default EnterRecoveryCode