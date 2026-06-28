import AppButton from '@/components/shared/AppButton';
import { BodySmallText, H2Text } from '@/components/shared/AppTexts';
import Colors from '@/constants/Colors';
import { ASSETS } from '@/utils/assets';
import { useDesignSystem } from '@/utils/design-system';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Success() {
    const router = useRouter();
    const ds = useDesignSystem();

    return (
        <SafeAreaView style={{ flex: 1, paddingBottom: ds.space.xl, backgroundColor: Colors.white }}>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: ds.space.xl,
                    gap: ds.space.xl
                }}
            >
                <ASSETS.AUTH.VERIFICATION_SUCCESS
                    width={ds.width * 0.4}
                    height={ds.width * 0.4}
                />
                <View style={{ gap: ds.space.md }}>
                    <H2Text style={{ textAlign: "center" }}>
                        Account Restored!
                    </H2Text>
                    <BodySmallText style={{ textAlign: "center" }}>
                        Your Ontiver account and credentials{"\n"}have been fully restored.{"\n\n"}Your privacy score and activity log are intact.
                    </BodySmallText>
                </View>
                <AppButton
                    title='Go to my Vault'
                    onPress={() => router.push("/(tabs)")}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
