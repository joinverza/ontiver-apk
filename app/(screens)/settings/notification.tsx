import AppSwitch from "@/components/shared/AppSwitch"
import { BodySmallText } from "@/components/shared/AppTexts"
import AppHeader from "@/components/shared/AppHeader"
import Colors from "@/constants/Colors"
import { Fonts } from "@/constants/fonts"
import { useDesignSystem } from "@/utils/design-system"
import { useState } from "react"
import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const NotificationSettings = () => {
    const ds = useDesignSystem()
    
    const notificationItems = [
        "Share Request",
        "Credentials Expiry",
        "Data Access Alerts",
        "Breach Alerts",
        "Revocation Confirmations",
        "Privacy Score changes",
        "Ontiver Updates"
    ]

    const [toggles, setToggles] = useState<Record<string, boolean>>(
        notificationItems.reduce((acc, item) => ({ ...acc, [item]: true }), {})
    )

    const handleToggle = (key: string, value: boolean) => {
        setToggles(prev => ({ ...prev, [key]: value }))
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: ds.space.xl, backgroundColor: "rgba(248, 250, 252, 1)" }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: ds.space.lg }}>
                <AppHeader title="Notifications" />

                <View style={{ padding: ds.space.md, borderRadius: ds.radius.lg, backgroundColor: Colors.white, gap: ds.space.sm }}>
                    {notificationItems.map((item, index) => (
                        <View key={item} style={{ flexDirection: "row", alignItems: "center", marginBottom: index === notificationItems.length - 1 ? 0 : ds.space.md }}>
                            <BodySmallText color={Colors.black} style={{ flex: 1, fontFamily: Fonts.regular }}>{item}</BodySmallText>
                            <AppSwitch isOn={toggles[item]} onToggle={(val) => handleToggle(item, val)} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default NotificationSettings