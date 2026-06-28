import AppButton from "@/components/shared/AppButton"
import AppHeader from "@/components/shared/AppHeader"
import { BodyLargeText, BodySmallText, H2Text, Label } from "@/components/shared/AppTexts"
import Colors from "@/constants/Colors"
import { ASSETS } from "@/utils/assets"
import { useDesignSystem } from "@/utils/design-system"
import { AntDesign, Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Dimensions, FlatList, Image, ImageBackground, ScrollView, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width } = Dimensions.get('window')

const FEATURES = [
    { title: "Multi-Identity Vault", free: false, pro: true },
    { title: "Unlimited Shares", free: false, pro: true },
    { title: "Priority Support", free: false, pro: true },
    { title: "Custom Share Expiry", free: false, pro: true },
]

const TESTIMONIALS = [
    {
        id: "1",
        name: "Adaeze",
        location: "Lagos",
        text: "Ontiver Pro paid for itself the first time I onboarded with a new bank.",
        rating: 5,
        profileImage: ASSETS.IMAGES.PROFILE_IMG
    },
    {
        id: "2",
        name: "Michael",
        location: "Abuja",
        text: "The unlimited shares are exactly what I needed for my business.",
        rating: 5,
        profileImage: ASSETS.IMAGES.PROFILE_IMG
    }
]

export default function Features() {
    const ds = useDesignSystem()
    const router = useRouter()
    const { top, bottom } = useSafeAreaInsets()
    const [activeTestimonial, setActiveTestimonial] = useState(0)

    const renderTestimonial = ({ item }: { item: typeof TESTIMONIALS[0] }) => (
        <View style={{
            width: width - ds.space.xl * 2,
            padding: ds.space.md,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: ds.radius.lg,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.2)",
        }}>
            <View style={{ flexDirection: "row", gap: 2, marginBottom: ds.space.sm }}>
                {[...Array(item.rating)].map((_, i) => (
                    <AntDesign key={i} name="star" size={12} color="#FBBF24" />
                ))}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: ds.space.sm, marginBottom: ds.space.sm }}>
                <Image source={item.profileImage} style={{ width: 24, height: 24, borderRadius: 12 }} />
                <BodyLargeText style={{ color: Colors.white, fontWeight: "600" }}>{item.name}</BodyLargeText>
                <BodySmallText style={{ color: "rgba(255, 255, 255, 0.6)" }}>— {item.location}</BodySmallText>
            </View>
            <BodySmallText style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: 20 }}>
                {item.text}
            </BodySmallText>
        </View>
    )

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

                <ScrollView contentContainerStyle={{ paddingHorizontal: ds.space.xl, paddingBottom: bottom + ds.space.xl, gap: ds.space.xl }}>
                    {/* Top Card */}
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: ds.space.md,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        padding: ds.space.lg,
                        borderRadius: ds.radius.lg,
                        borderWidth: 1,
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        marginTop: ds.space.md
                    }}>
                        <Image source={ASSETS.IMAGES.GOLD_BADGE} style={{ width: 80, height: 80, resizeMode: "contain" }} />
                        <View style={{ flex: 1, gap: ds.space.xs }}>
                            <H2Text style={{ color: Colors.white }}>Ontiver Pro</H2Text>
                            <BodySmallText style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                                Everything you need to own your identity.
                            </BodySmallText>
                        </View>
                    </View>

                    {/* Features Table */}
                    <View style={{ gap: ds.space.md }}>
                        <BodySmallText style={{ color: Colors.white }}>What you get</BodySmallText>
                        <View style={{
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: ds.radius.lg,
                            borderWidth: 1,
                            borderColor: "rgba(255, 255, 255, 0.2)",
                            overflow: "hidden"
                        }}>
                            {/* Header Row */}
                            <View style={{
                                flexDirection: "row",
                                padding: ds.space.md,
                                borderBottomWidth: 1,
                                borderBottomColor: "rgba(255, 255, 255, 0.1)"
                            }}>
                                <View style={{ flex: 2 }}><BodyLargeText style={{ color: Colors.white, fontWeight: "600" }}>Features</BodyLargeText></View>
                                <View style={{ flex: 1, alignItems: "center" }}><BodyLargeText style={{ color: Colors.white, fontWeight: "600" }}>Free</BodyLargeText></View>
                                <View style={{ flex: 1, alignItems: "center" }}><BodyLargeText style={{ color: Colors.white, fontWeight: "600" }}>Pro</BodyLargeText></View>
                            </View>

                            {/* Rows */}
                            {FEATURES.map((feat, index) => (
                                <View key={index} style={{
                                    flexDirection: "row",
                                    padding: ds.space.md,
                                    borderTopWidth: index === 0 ? 0 : 1,
                                    borderTopColor: "rgba(255, 255, 255, 0.05)"
                                }}>
                                    <View style={{ flex: 2, justifyContent: "center" }}>
                                        <Label style={{ color: Colors.white, fontWeight: "500" }}>{feat.title}</Label>
                                    </View>
                                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                        {feat.free ? <Feather name="check-circle" size={16} color={Colors.white} /> : <Label style={{ color: "rgba(255, 255, 255, 0.5)", fontWeight: "500" }}>—</Label>}
                                    </View>
                                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                        {feat.pro ? <Feather name="check-circle" size={16} color={Colors.white} /> : <Label style={{ color: "rgba(255, 255, 255, 0.5)", fontWeight: "500" }}>—</Label>}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Testimonials */}
                    <View style={{ gap: ds.space.md }}>
                        <BodySmallText style={{ color: Colors.white }}>Testimonials</BodySmallText>
                        <View style={{
                            // backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: ds.radius.lg,
                            // borderWidth: 1,
                            // borderColor: "rgba(255, 255, 255, 0.2)",
                        }}>
                            <FlatList
                                data={TESTIMONIALS}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled
                                renderItem={renderTestimonial}
                                onMomentumScrollEnd={(e) => {
                                    const index = Math.round(e.nativeEvent.contentOffset.x / (width - ds.space.xl * 2))
                                    setActiveTestimonial(index)
                                }}
                            />
                            {/* Pagination Dots */}
                            <View style={{ flexDirection: "row", gap: ds.space.xs, paddingHorizontal: ds.space.md, paddingBottom: ds.space.md, marginTop: ds.space.xs, alignSelf: "center" }}>
                                {TESTIMONIALS.map((_, i) => (
                                    <View key={i} style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: activeTestimonial === i ? Colors.positive : "rgba(255, 255, 255, 0.5)"
                                    }} />
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={{ gap: ds.space.md, marginTop: ds.space.md }}>
                        <AppButton
                            title="See Pricing"
                            style={{ backgroundColor: Colors.white, borderWidth: 0 }}
                            textStyle={{ color: Colors.black }}
                            onPress={() => router.push("/(screens)/settings/ontiver-pro/pricing")}
                        />
                        <AppButton
                            title="Maybe Later"
                            variant="outline"
                            style={{ borderColor: Colors.white }}
                            textStyle={{ color: Colors.white }}
                            onPress={() => router.back()}
                        />
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    )
}
