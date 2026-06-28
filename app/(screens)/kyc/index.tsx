import { BodySmallText, H2Text } from "@/components/shared/AppTexts"
import Colors from "@/constants/Colors"
import { ASSETS } from "@/utils/assets"
import { useDesignSystem } from "@/utils/design-system"
import { useRouter } from "expo-router"
import { useEffect, useRef } from "react"
import { Animated, Easing, ImageBackground, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function KycLoadingScreen() {
    const ds = useDesignSystem()
    const router = useRouter()
    const { top } = useSafeAreaInsets()

    // Animation values for rotation
    const rotation1 = useRef(new Animated.Value(0)).current
    const rotation2 = useRef(new Animated.Value(0)).current
    const rotation3 = useRef(new Animated.Value(0)).current
    
    // Animation value for dot pulsing
    const dotOpacities = useRef([...Array(4)].map(() => new Animated.Value(0.3))).current

    useEffect(() => {
        // Continuous rotation for concentric circles
        const createRotation = (anim: Animated.Value, duration: number, clockwise: boolean = true) => {
            Animated.loop(
                Animated.timing(anim, {
                    toValue: clockwise ? 1 : -1,
                    duration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start()
        }

        createRotation(rotation1, 6000, true)
        createRotation(rotation2, 8000, false)
        createRotation(rotation3, 10000, true)

        // Pulsating dots animation
        const animateDots = () => {
            const sequence = dotOpacities.map((anim) => {
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

        // 4 seconds delay then redirect to success
        const timer = setTimeout(() => {
            router.replace("/(screens)/kyc/success")
        }, 4000)

        return () => clearTimeout(timer)
    }, [])

    const spin1 = rotation1.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-360deg', '0deg', '360deg']
    })
    const spin2 = rotation2.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-360deg', '0deg', '360deg']
    })
    const spin3 = rotation3.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-360deg', '0deg', '360deg']
    })

    const Circle = ({ size, spin, opacity = 0.5 }: { size: number, spin: any, opacity?: number }) => (
        <Animated.View style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 4,
            borderColor: '#02CE87',
            borderStyle: 'dashed',
            opacity,
            transform: [{ rotate: spin }]
        }} />
    )

    return (
        <View style={{ flex: 1, backgroundColor: Colors.primary }}>
            <ImageBackground
                source={ASSETS.IMAGES.PRO_BG_TWO}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    
                    {/* Concentric Dashed Circles */}
                    <View style={{ width: 280, height: 280, justifyContent: 'center', alignItems: 'center' }}>
                        <Circle size={260} spin={spin3} opacity={0.3} />
                        <Circle size={190} spin={spin2} opacity={0.5} />
                        <Circle size={120} spin={spin1} opacity={0.8} />

                        {/* Center Dots */}
                        <View style={{ flexDirection: "row", gap: ds.space.sm, position: 'absolute' }}>
                            {dotOpacities.map((anim, i) => (
                                <Animated.View
                                    key={i}
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: Colors.white,
                                        opacity: anim
                                    }}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={{ marginTop: ds.space.xl * 2, alignItems: 'center', gap: ds.space.sm }}>
                        <BodySmallText style={{ color: Colors.white, fontSize: 16 }}>Verifying your identity...</BodySmallText>
                        <BodySmallText style={{ color: "rgba(255, 255, 255, 0.7)", textAlign: 'center' }}>
                            This usually takes 10-30 seconds.{"\n"}Please don't close the app.
                        </BodySmallText>
                    </View>

                </View>
            </ImageBackground>
        </View>
    )
}
