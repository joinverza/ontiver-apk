import AppButton from "@/components/shared/AppButton"
import { BodyLargeText, BodySmallText, H2Text, Label } from "@/components/shared/AppTexts"
import BackButton from "@/components/shared/BackButton"
import Colors from "@/constants/Colors"
import { Fonts } from "@/constants/fonts"
import { ASSETS } from "@/utils/assets"
import { useDesignSystem } from "@/utils/design-system"
import { router } from "expo-router"
import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const AccountRecovery = () => {
    const ds = useDesignSystem()
    const [accountRecoveryMethod, setAccountRecoveryMethod] = useState<number | null>(null)

    const recoveryOptions = [
        {
            id: 1,
            title: "Email + Recovery Code",
            description: "We'll send a code to your registered email.",
            icon: ASSETS.ICONS.MAIL_ICON
        },
        {
            id: 2,
            title: "12-Word Recovery Phrase",
            description: "Use the phrase you saved when you set up Ontiver.",
            icon: ASSETS.ICONS.KEY_ICON,
        },
    ]

    const handleContinue = () => {
        if (accountRecoveryMethod == 1) {
            router.push("/auth/account-recovery/enter-email")
        } else {
            router.push("/auth/account-recovery/verify-recovery-phrase")
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, paddingBottom: ds.space.xl, backgroundColor: Colors.white }}>
            <View style={{ flex: 1 }}>
                <BackButton />
                <View style={{ marginBottom: ds.space.lg }}>
                    <H2Text>Recover Your Account</H2Text>
                    <BodySmallText color={Colors.black}>
                        Choose a recovery method below.
                    </BodySmallText>
                </View>

                <View style={{ gap: ds.space.xl }}>
                    {
                        recoveryOptions.map((item, index) => (
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: ds.space.md,
                                    padding: ds.space.md,
                                    borderRadius: ds.radius.md,
                                    borderWidth: 1,
                                    backgroundColor: Colors.white,
                                    borderColor: accountRecoveryMethod == item.id ? Colors.primary : "rgba(225, 225, 225, 1)"
                                }}
                                key={index}
                                onPress={() => setAccountRecoveryMethod(item.id)}
                            >
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: ds.space.sm }}>
                                        <item.icon width={16} height={16} color={Colors.primary} />
                                        <BodyLargeText color={Colors.black}>{item.title}</BodyLargeText>
                                    </View>
                                    <Label style={{ fontFamily: Fonts.regular }}>{item.description}</Label>
                                </View>
                                <View
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: Colors.primary,
                                        backgroundColor: accountRecoveryMethod == item.id ? Colors.primary : "transparent"
                                    }}
                                />
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
            <AppButton title="Continue" disabled={!accountRecoveryMethod} onPress={handleContinue} />
        </SafeAreaView>
    )
}

export default AccountRecovery