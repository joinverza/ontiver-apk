import Colors from '@/constants/Colors'
import { Feather } from '@expo/vector-icons'
import { StyleSheet, TouchableOpacity } from 'react-native'

export default function AppCheckmark({
    isChecked,
    onPress,

}: {
    isChecked: boolean
    onPress: () => void
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                height: 20,
                width: 20,
                borderRadius: 4,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: isChecked ? Colors.primary : Colors.mainText
            }}
        >
            {isChecked && <Feather name="check" size={16} color="black" />}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})