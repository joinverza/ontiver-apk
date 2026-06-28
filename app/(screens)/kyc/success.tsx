import AppButton from "@/components/shared/AppButton"
import { BodySmallText, H2Text } from "@/components/shared/AppTexts"
import Colors from "@/constants/Colors"
import { ASSETS } from "@/utils/assets"
import { useDesignSystem } from "@/utils/design-system"
import { useRouter } from "expo-router"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function KycSuccessScreen() {
    const ds = useDesignSystem()
    const router = useRouter()
    const { top, bottom } = useSafeAreaInsets()

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white, paddingTop: top, paddingBottom: bottom }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: ds.space.xl, gap: ds.space.lg }}>
                
                <ASSETS.AUTH.VERIFICATION_SUCCESS
                    width={ds.width * 0.4}
                    height={ds.width * 0.4}
                />
                
                <View style={{ alignItems: "center", gap: ds.space.sm, marginTop: ds.space.md }}>
                    <H2Text style={{ textAlign: "center", color: Colors.black }}>
                        Identity Verified!
                    </H2Text>
                    <BodySmallText style={{ textAlign: "center", color: Colors.secondaryText, lineHeight: 22 }}>
                        Your Ontiver credential is ready. You can{"\n"}now share your verified identity with any{"\n"}app or service.
                    </BodySmallText>
                </View>
            </View>

            <View style={{ paddingHorizontal: ds.space.xl, paddingBottom: ds.space.xl, gap: ds.space.lg }}>
                <AppButton
                    title="Go to My Vault"
                    style={{ backgroundColor: Colors.black, borderWidth: 0 }}
                    textStyle={{ color: Colors.white }}
                    onPress={() => router.push("/(tabs)")}
                />
                <AppButton
                    title="Share My Identity"
                    style={{ backgroundColor: "transparent", borderWidth: 0, paddingVertical: 0 }}
                    textStyle={{ color: Colors.black, fontWeight: "500" }}
                    onPress={() => {}}
                />
            </View>
        </View>
    )
}
