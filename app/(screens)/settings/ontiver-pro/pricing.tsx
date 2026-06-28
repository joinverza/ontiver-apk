import AppButton from "@/components/shared/AppButton"
import AppHeader from "@/components/shared/AppHeader"
import { BodyLargeText, BodySmallText, H2Text, H1Text, Label } from "@/components/shared/AppTexts"
import Colors from "@/constants/Colors"
import { ASSETS } from "@/utils/assets"
import { useDesignSystem } from "@/utils/design-system"
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ImageBackground, ScrollView, View, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Pricing() {
    const ds = useDesignSystem()
    const router = useRouter()
    const { top, bottom } = useSafeAreaInsets()
    const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual")

    return (
        <View style={{ flex: 1, backgroundColor: Colors.primary }}>
            <ImageBackground
                source={ASSETS.IMAGES.PRO_BG_TWO}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                <View style={{ paddingTop: top, paddingHorizontal: ds.space.xl }}>
                    <AppHeader title="Choose Your Plan" color="white" />
                </View>

                <ScrollView contentContainerStyle={{ paddingHorizontal: ds.space.xl, paddingBottom: bottom + ds.space.xl, gap: ds.space.xl }}>
                    
                    <View style={{ marginTop: ds.space.md, gap: ds.space.md }}>
                        {/* Monthly Plan */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setSelectedPlan("monthly")}
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: ds.radius.lg,
                                borderWidth: 1,
                                borderColor: selectedPlan === "monthly" ? Colors.primary : "rgba(255, 255, 255, 0.2)",
                                padding: ds.space.lg,
                            }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <View style={{ gap: ds.space.xs }}>
                                    <BodySmallText style={{ color: "rgba(255, 255, 255, 0.8)" }}>Monthly</BodySmallText>
                                    <View style={{ flexDirection: "row", alignItems: "baseline", gap: ds.space.xs }}>
                                        <H1Text style={{ color: Colors.white }}>₦4,000</H1Text>
                                        <BodySmallText style={{ color: "rgba(255, 255, 255, 0.8)" }}>/Month</BodySmallText>
                                    </View>
                                    <View style={{ marginTop: ds.space.xs }}>
                                        <BodySmallText style={{ color: "rgba(255, 255, 255, 0.8)" }}>Billed monthly.</BodySmallText>
                                        <BodySmallText style={{ color: "rgba(255, 255, 255, 0.8)" }}>Cancel anytime.</BodySmallText>
                                    </View>
                                </View>
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: selectedPlan === "monthly" ? Colors.white : "rgba(255, 255, 255, 0.5)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: selectedPlan === "monthly" ? Colors.white : "transparent"
                                }}>
                                    {selectedPlan === "monthly" && <AntDesign name="check" size={14} color={Colors.primary} />}
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Annual Plan */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setSelectedPlan("annual")}
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: ds.radius.lg,
                                borderWidth: 1,
                                borderColor: selectedPlan === "annual" ? Colors.primary : "rgba(255, 255, 255, 0.2)",
                                padding: ds.space.lg,
                            }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <View style={{ gap: ds.space.xs }}>
                                    <BodySmallText style={{ color: "rgba(255, 255, 255, 0.8)" }}>Annual</BodySmallText>
                                    <View style={{ flexDirection: "row", alignItems: "baseline", gap: ds.space.xs }}>
                                        <H1Text style={{ color: Colors.white }}>₦3,000</H1Text>
                                        <BodySmallText style={{ color: "rgba(255, 255, 255, 0.8)" }}>/ month</BodySmallText>
                                    </View>
                                    <View style={{ marginTop: ds.space.xs }}>
                                        <BodySmallText style={{ color: "rgba(255, 255, 255, 0.8)" }}>Billed as ₦36,000/year</BodySmallText>
                                        <BodySmallText style={{ color: "rgba(255, 255, 255, 0.8)" }}>Save 25%</BodySmallText>
                                    </View>
                                </View>
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: Colors.white,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderWidth: 2,
                                    borderColor: Colors.white
                                }}>
                                    {selectedPlan === "annual" && <AntDesign name="check" size={14} color={Colors.primary} />}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Free Trial Banner */}
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: ds.space.md,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        padding: ds.space.md,
                        borderRadius: ds.radius.md,
                        borderWidth: 1,
                        borderColor: Colors.primary,
                    }}>
                        <MaterialCommunityIcons name="ticket-percent-outline" size={24} color={Colors.white} />
                        <View style={{ flex: 1 }}>
                            <BodySmallText style={{ color: Colors.white }}>Your first 7 days are free.</BodySmallText>
                            <BodySmallText style={{ color: "rgba(255, 255, 255, 0.7)" }}>Cancel before May 16 to pay nothing.</BodySmallText>
                        </View>
                    </View>

                    {/* Action Button */}
                    <View style={{ marginTop: ds.space.md }}>
                        <AppButton
                            title={selectedPlan === "annual" ? "Start Annual Plan" : "Start Monthly Plan"}
                            style={{ backgroundColor: Colors.white, borderWidth: 0 }}
                            textStyle={{ color: Colors.black }}
                            onPress={() => router.push("/(screens)/settings/ontiver-pro/loading")}
                        />
                    </View>

                    {/* Footer Secure Info */}
                    <View style={{ flexDirection: "row", gap: ds.space.sm, marginTop: ds.space.sm }}>
                        <Feather name="lock" size={16} color="rgba(255, 255, 255, 0.7)" style={{ marginTop: 2 }} />
                        <BodySmallText style={{ color: "rgba(255, 255, 255, 0.7)", flex: 1, lineHeight: 20 }}>
                            Secure payment via App Store / Google Play.{"\n"}Ontiver never sees your card details.
                        </BodySmallText>
                    </View>

                </ScrollView>
            </ImageBackground>
        </View>
    )
}
