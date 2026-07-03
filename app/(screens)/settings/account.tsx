import AppCheckmark from "@/components/shared/AppCheckmark"
import AppHeader from "@/components/shared/AppHeader"
import AppInput from "@/components/shared/AppInput"
import { BodySmallText, H2Text } from "@/components/shared/AppTexts"
import BackButton from "@/components/shared/BackButton"
import Colors from "@/constants/Colors"
import { Fonts } from "@/constants/fonts"
import { ASSETS } from "@/utils/assets"
import { useDesignSystem } from "@/utils/design-system"
import { useState } from "react"
import { ScrollView, TouchableOpacity, View, Platform, KeyboardAvoidingView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Accounts = () => {
    const ds = useDesignSystem()
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isGoogleChecked, setIsGoogleChecked] = useState(false)
    const [isAppleChecked, setIsAppleChecked] = useState(false)

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: ds.space.xl, backgroundColor: "rgba(248, 250, 252, 1)" }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                <AppHeader title="Account" />
                <View style={{ marginTop: ds.space.xl }}>
                    <BodySmallText color={Colors.black}>Profile Information</BodySmallText>
                    <View style={{ padding: ds.space.md, borderRadius: ds.radius.lg, backgroundColor: Colors.white, marginTop: ds.space.md, gap: ds.space.sm }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <BodySmallText color={Colors.black} style={{ flex: 1, fontFamily: Fonts.semiBold }}>Name:</BodySmallText>
                            <BodySmallText color={Colors.black} style={{ fontFamily: Fonts.regular }}>Nathan Adeyemi</BodySmallText>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <BodySmallText color={Colors.black} style={{ flex: 1, fontFamily: Fonts.semiBold }}>Email:</BodySmallText>
                            <BodySmallText color={Colors.black} style={{ fontFamily: Fonts.regular }}>nathan.adeyemi@gmail.com</BodySmallText>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <BodySmallText color={Colors.black} style={{ flex: 1, fontFamily: Fonts.semiBold }}>Phone:</BodySmallText>
                            <BodySmallText color={Colors.black} style={{ fontFamily: Fonts.regular }}>+23480983453829</BodySmallText>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: ds.space.xl }}>
                    <BodySmallText color={Colors.black}>Change Password</BodySmallText>
                    <View style={{ padding: ds.space.md, borderRadius: ds.radius.lg, backgroundColor: Colors.white, marginTop: ds.space.md, gap: ds.space.sm }}>
                        <AppInput
                            label="Current Password"
                            isPassword
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Current Password"
                        />
                        <AppInput
                            label="New Password"
                            isPassword
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="New Password"
                        />
                        <AppInput
                            label="Confirm Password"
                            isPassword
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm Password"
                        />
                    </View>
                </View>
                <View style={{ marginTop: ds.space.xl }}>
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
                </View>

                <TouchableOpacity
                    style={{
                        backgroundColor: "rgba(255, 219, 219, 0.4)",
                        paddingVertical: ds.space.lg,
                        borderRadius: ds.radius.md,
                        justifyContent: "flex-start",
                        paddingLeft: ds.space.md,
                        marginVertical: ds.space.xl,
                        flexDirection: "row",
                        gap: ds.space.sm,
                        alignItems: "center"
                    }}
                >
                    <ASSETS.ICONS.DELETE_ICON />
                    <BodySmallText color={"rgba(156, 0, 0, 1)"}>Delete Account</BodySmallText>
                </TouchableOpacity>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Accounts