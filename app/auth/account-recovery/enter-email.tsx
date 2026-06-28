import AppButton from "@/components/shared/AppButton"
import AppInput from "@/components/shared/AppInput"
import { BodySmallText, H2Text } from "@/components/shared/AppTexts"
import BackButton from "@/components/shared/BackButton"
import Colors from "@/constants/Colors"
import { useDesignSystem } from "@/utils/design-system"
import { router } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const EnterEmail = () => {
    const [email, setEmail] = useState("")
    const ds = useDesignSystem()
    return (
        <SafeAreaView style={{ flex: 1, paddingBottom: ds.space.xl, backgroundColor: Colors.white }}>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <BackButton />
                    <View style={{ marginBottom: ds.space.lg }}>
                        <H2Text>Enter Your Email</H2Text>
                        <BodySmallText color={Colors.black}>
                            We'll send you a recovery code to reset your password.
                        </BodySmallText>
                    </View>
                    <AppInput
                        keyboardType="email-address"
                        placeholder="Email Address"
                        placeholderTextColor={Colors.grey200}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <AppButton title="Continue" onPress={() => router.push("/auth/account-recovery/verify-email")} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default EnterEmail