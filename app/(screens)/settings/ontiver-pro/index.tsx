import AppButton from "@/components/shared/AppButton"
import AppHeader from "@/components/shared/AppHeader"
import { BodyLargeText, H1Text } from "@/components/shared/AppTexts"
import Colors from "@/constants/Colors"
import { ASSETS } from "@/utils/assets"
import { useDesignSystem } from "@/utils/design-system"
import { useRouter } from "expo-router"
import { Image, ImageBackground, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const OntiverPro = () => {
    const ds = useDesignSystem()
    const router = useRouter()

    return (
        <View style={{ flex: 1, backgroundColor: Colors.primary }}>
            <ImageBackground
                source={ASSETS.IMAGES.PRO_BG_ONE}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ paddingHorizontal: ds.space.xl }}>
                        <AppHeader title="Ontiver Pro" color="white" />
                    </View>

                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: ds.space.xl }}>
                        <Image
                            source={ASSETS.IMAGES.GOLD_BADGE}
                            style={{ width: ds.width * 0.7, height: ds.width * 0.7, resizeMode: "contain" }}
                        />

                        <View style={{ marginTop: ds.space.xl, alignItems: "center", gap: ds.space.md }}>
                            <H1Text style={{ textAlign: "center", color: Colors.white }}>
                                Upgrade to{"\n"}Ontiver Pro
                            </H1Text>
                            <BodyLargeText style={{ textAlign: "center", color: Colors.white }}>
                                Unlimited shares, multi-{"\n"}identity, and more.
                            </BodyLargeText>
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: ds.space.xl, paddingBottom: ds.space.xl }}>
                        <AppButton
                            title="Upgrade"
                            onPress={() => router.push("/(screens)/settings/ontiver-pro/features")}
                            style={{
                                backgroundColor: "#02CE87"
                            }}
                        />
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    )
}

export default OntiverPro