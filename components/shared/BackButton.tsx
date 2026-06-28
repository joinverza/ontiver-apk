import { ASSETS } from '@/utils/assets';
import { useDesignSystem } from '@/utils/design-system';
import { useRouter } from 'expo-router';
import { TouchableOpacity, ViewStyle } from 'react-native';

const BackButton = ({
    color = "primary",
    style
}: {
    color?: "primary" | "white",
    style?: ViewStyle
}) => {
    const router = useRouter()
    const ds = useDesignSystem()
    return (
        <TouchableOpacity
            onPress={() => router.back()}
            style={{
                height: ds.space['6xl'],
                width: ds.space['6xl'],
                justifyContent: "center",
                // alignItems: "center"
            }}
        >
            {color === "white" ? <ASSETS.ICONS.ARROW_LEFT_WHITE /> : <ASSETS.ICONS.ARROW_LEFT_PRIMARY />}
        </TouchableOpacity>
    )
}

export default BackButton