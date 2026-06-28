import AppHeader from "@/components/shared/AppHeader"
import { BodySmallText } from "@/components/shared/AppTexts"
import Colors from "@/constants/Colors"
import { ASSETS } from "@/utils/assets"
import { useDesignSystem } from "@/utils/design-system"
import { useRouter } from "expo-router"
import { useEffect, useRef } from "react"
import { Animated, ImageBackground, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Loading() {
    const ds = useDesignSystem()
    const router = useRouter()
    const { top } = useSafeAreaInsets()

    // 4 dots animations
    const animations = useRef([...Array(4)].map(() => new Animated.Value(0.3))).current

    useEffect(() => {
        const animateDots = () => {
            const sequence = animations.map((anim, index) => {
                return Animated.sequence([
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0.3,
                        duration: 300,
                        useNativeDriver: true,
                    })
                ])
            })
            Animated.loop(Animated.stagger(150, sequence)).start()
        }
        animateDots()

        // 5 seconds delay then redirect to success
        const timer = setTimeout(() => {
            router.replace("/(screens)/settings/ontiver-pro/success")
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

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

                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: ds.space.lg }}>
                    <View style={{ flexDirection: "row", gap: ds.space.sm }}>
                        {animations.map((anim, i) => (
                            <Animated.View
                                key={i}
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: Colors.white,
                                    opacity: anim
                                }}
                            />
                        ))}
                    </View>
                    <BodySmallText style={{ color: Colors.white }}>Opening Payment...</BodySmallText>
                </View>
            </ImageBackground>
        </View>
    )
}
