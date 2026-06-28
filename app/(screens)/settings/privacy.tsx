import AppHeader from "@/components/shared/AppHeader"
import AppSwitch from "@/components/shared/AppSwitch"
import { BodySmallText } from "@/components/shared/AppTexts"
import Colors from "@/constants/Colors"
import { ASSETS } from "@/utils/assets"
import { useDesignSystem } from "@/utils/design-system"
import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Privacy = () => {
    const ds = useDesignSystem()
    const [isAnalytics, setIsAnalytics] = useState(true)

    const data = [
        {
            icon: ASSETS.ICONS.USER_ICON,
            title: "Export Data",
            onPress: () => { }
        },
        {
            icon: ASSETS.ICONS.USER_ICON,
            title: "Clear Activity Log",
            onPress: () => { }
        },
        {
            icon: ASSETS.ICONS.USER_ICON,
            title: "Manage Data Sharing",
            onPress: () => { }
        },
    ]

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: ds.space.xl, backgroundColor: "rgba(248, 250, 252, 1)" }}>
            <AppHeader
                title="Privacy"
            />

            <View style={{ gap: ds.space.md }}>
                {
                    data.map((item, index) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: ds.space.md,
                                    backgroundColor: Colors.white,
                                    padding: ds.space.md,
                                    borderRadius: ds.radius.lg,
                                    borderWidth: 1,
                                    borderColor: Colors.grey200
                                }}
                                onPress={item.onPress}
                                key={index}
                            >
                                <View>
                                    <item.icon />
                                </View>
                                <BodySmallText style={{ flex: 1 }}>{item.title}</BodySmallText>
                                <View style={{ transform: [{ rotate: "180deg" }] }}>
                                    <ASSETS.ICONS.ARROW_LEFT_PRIMARY />
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: ds.space.md,
                        backgroundColor: Colors.white,
                        padding: ds.space.md,
                        borderRadius: ds.radius.lg,
                        borderWidth: 1,
                        borderColor: Colors.grey200
                    }}
                >
                    <View>
                        <ASSETS.ICONS.USER_ICON />
                    </View>
                    <BodySmallText style={{ flex: 1 }}>Analytics Opt-Out</BodySmallText>
                    <AppSwitch
                        isOn={isAnalytics}
                        onToggle={() => setIsAnalytics(!isAnalytics)}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Privacy