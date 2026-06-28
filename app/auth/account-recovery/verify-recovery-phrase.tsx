import AppButton from "@/components/shared/AppButton"
import { BodySmallText, H2Text } from "@/components/shared/AppTexts"
import BackButton from "@/components/shared/BackButton"
import Colors from "@/constants/Colors"
import { useDesignSystem } from "@/utils/design-system"
import { router } from "expo-router"
import { useState } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const VerifyRecoveryPhrase = () => {
    // 12 4 letted words arrays
    const phrases = ["seed", "salt", "pink", "soda", "free", "nose", "bear", "ring", "dash", "fear", "fire", "fuel"]
    const [selectedPhrasesOrder, setSelectedPhrasesOrder] = useState<string[]>([]);
    const ds = useDesignSystem()
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: Colors.white, paddingHorizontal: ds.space.xl, paddingBottom: ds.space.xl }}
        >
            <BackButton />
            <View style={{ gap: ds.space.md }}>
                <H2Text>Enter Recovery Phrase</H2Text>
                <BodySmallText>Enter all 12 words in the correct order.</BodySmallText>
            </View>

            <ScrollView style={{ flex: 1, paddingVertical: ds.space.lg }}>
                {selectedPhrasesOrder.length > 0 && (
                    <View style={{ gap: ds.space.md, flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                        {selectedPhrasesOrder.map((phrase, index) => (
                            <View
                                key={index}
                                style={{
                                    padding: ds.space.md,
                                    backgroundColor: Colors.grey200,
                                    borderRadius: ds.radius.md,
                                    borderWidth: 1,
                                    borderColor: Colors.grey200,
                                    width: "22%",
                                }}
                            >
                                <BodySmallText size={ds.typography.micro.fontSize}>{index + 1}</BodySmallText>
                                <BodySmallText color={"rgba(5, 21, 14, 0.4)"} style={{
                                    textAlign: "center"
                                }}>{phrase}</BodySmallText>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <View style={{ gap: ds.space.lg }}>
                <View style={{ gap: ds.space.md, flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                    {phrases.map((phrase, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                padding: ds.space.md,
                                backgroundColor: selectedPhrasesOrder.includes(phrase) ? Colors.primary : Colors.white,
                                borderRadius: ds.radius["10xl"],
                                borderWidth: 1,
                                borderColor: Colors.grey200,
                                width: "22%",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onPress={() => selectedPhrasesOrder.includes(phrase) ? setSelectedPhrasesOrder(selectedPhrasesOrder.filter((p) => p !== phrase)) : setSelectedPhrasesOrder([...selectedPhrasesOrder, phrase])}
                        >
                            <BodySmallText color={selectedPhrasesOrder.includes(phrase) ? Colors.white : Colors.black}>{phrase}</BodySmallText>
                        </TouchableOpacity>
                    ))}
                </View>
                <AppButton
                    title="Verify Phrase"
                    onPress={() => router.push("/auth/account-recovery/set-new-pin")}
                />
            </View>
        </SafeAreaView>
    )
}

export default VerifyRecoveryPhrase