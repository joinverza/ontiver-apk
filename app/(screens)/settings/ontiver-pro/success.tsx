import AppButton from "@/components/shared/AppButton"
import AppHeader from "@/components/shared/AppHeader"
import { H2Text } from "@/components/shared/AppTexts"
import Colors from "@/constants/Colors"
import { ASSETS } from "@/utils/assets"
import { useDesignSystem } from "@/utils/design-system"
import { useRouter } from "expo-router"
import { ImageBackground, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Success() {
    const ds = useDesignSystem()
    const router = useRouter()
    const { top, bottom } = useSafeAreaInsets()

    return (
        <View style={{ flex: 1, backgroundColor: Colors.primary }}>
            <ImageBackground
                source={ASSETS.IMAGES.PRO_BG_TWO}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                <View style={{ paddingTop: top, paddingHorizontal: ds.space.xl }}>
                    <AppHeader title="" color="white" />
                </View>

                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: ds.space.xl, gap: ds.space.xl }}>
                    <ASSETS.AUTH.SUCCESS_WHITE
                        width={ds.width * 0.4}
                        height={ds.width * 0.4}
                    />

                    <H2Text style={{ textAlign: "center", color: Colors.white }}>
                        Payment successful
                    </H2Text>
                    <View style={{ paddingHorizontal: ds.space.xl, paddingBottom: bottom + ds.space.xl }}>
                        <AppButton
                            title="Back to Home"
                            style={{ backgroundColor: Colors.white, borderWidth: 0 }}
                            textStyle={{ color: Colors.black }}
                            onPress={() => router.push("/(tabs)")}
                        />
                    </View>
                </View>

            </ImageBackground>
        </View>
    )
}
