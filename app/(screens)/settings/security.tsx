import AppHeader from "@/components/shared/AppHeader"
import AppInput from "@/components/shared/AppInput"
import AppSwitch from "@/components/shared/AppSwitch"
import { BodySmallText, H2Text } from "@/components/shared/AppTexts"
import BackButton from "@/components/shared/BackButton"
import Colors from "@/constants/Colors"
import { Fonts } from "@/constants/fonts"
import { useDesignSystem } from "@/utils/design-system"
import { useState } from "react"
import { ScrollView, View, Platform, KeyboardAvoidingView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Security = () => {
    const ds = useDesignSystem()
    const [currentPin, setCurrentPin] = useState("")
    const [newPin, setNewPin] = useState("")
    const [confirmPin, setConfirmPin] = useState("")
    const [isBiometricOn, setIsBiometricOn] = useState(false)
    const [isLockOnBg, setIsLockOnBg] = useState(false)

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: ds.space.xl, backgroundColor: "rgba(248, 250, 252, 1)" }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: ds.space.lg }}>
                <AppHeader title="Security" />
                <View style={{ padding: ds.space.md, borderRadius: ds.radius.lg, backgroundColor: Colors.white, gap: ds.space.sm }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <BodySmallText color={Colors.black} style={{ flex: 1, fontFamily: Fonts.regular }}>Biometric Lock:</BodySmallText>
                        <AppSwitch isOn={isBiometricOn} onToggle={setIsBiometricOn} />
                    </View>
                </View>
                <View>
                    <BodySmallText color={Colors.black}>Change Pin</BodySmallText>
                    <View style={{ padding: ds.space.md, borderRadius: ds.radius.lg, backgroundColor: Colors.white, marginTop: ds.space.md, gap: ds.space.sm }}>
                        <AppInput
                            label="Current Pin"
                            isPassword
                            value={currentPin}
                            onChangeText={setCurrentPin}
                            placeholder="****"
                        />
                        <AppInput
                            label="New Pin"
                            isPassword
                            value={newPin}
                            onChangeText={setNewPin}
                            placeholder="****"
                        />
                        <AppInput
                            label="Confirm Pin"
                            isPassword
                            value={confirmPin}
                            onChangeText={setConfirmPin}
                            placeholder="****"
                        />
                    </View>
                </View>
                {/* <View style={{ marginTop: ds.space.xl }}>
                    <BodySmallText color={Colors.black}>Linked Accounts</BodySmallText>
                    <View style={{ padding: ds.space.md, borderRadius: ds.radius.lg, backgroundColor: Colors.white, marginTop: ds.space.md, gap: ds.space.sm }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: ds.space.sm }}>
                            <AppCheckmark
                                isChecked={isGoogleChecked}
                                onPress={() => setIsGoogleChecked(!isGoogleChecked)}
                            />
                            <BodySmallText color={Colors.black} style={{}}>Google connected</BodySmallText>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: ds.space.sm }}>
                            <AppCheckmark
                                isChecked={isAppleChecked}
                                onPress={() => setIsAppleChecked(!isAppleChecked)}
                            />
                            <BodySmallText color={Colors.black} style={{}}>Apple connected</BodySmallText>
                        </View>
                    </View>
                </View> */}

                <View style={{ padding: ds.space.md, borderRadius: ds.radius.lg, backgroundColor: Colors.white, gap: ds.space.sm }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <BodySmallText color={Colors.black} style={{ flex: 1, fontFamily: Fonts.regular }}>Lock on background</BodySmallText>
                        <AppSwitch isOn={isLockOnBg} onToggle={setIsLockOnBg} />
                    </View>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Security