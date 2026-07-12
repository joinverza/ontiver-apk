import React from 'react';
import { View, Modal, Pressable, TouchableOpacity, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const { height: screenHeight } = Dimensions.get('window');

interface BottomSheetModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    heightPercentage?: number;
    bottomOffset?: number;
    contentStyle?: ViewStyle;
}

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ 
    visible, 
    onClose, 
    children, 
    heightPercentage = 0.75,
    bottomOffset = 0,
    contentStyle,
}) => {
    const [shouldRender, setShouldRender] = React.useState(visible);
    const progress = useSharedValue(0);

    React.useEffect(() => {
        if (visible) {
            setShouldRender(true);
            progress.value = 0;
            progress.value = withTiming(1, {
                duration: 280,
                easing: Easing.out(Easing.cubic),
            });
        } else {
            progress.value = withTiming(0, {
                duration: 190,
                easing: Easing.in(Easing.cubic),
            }, (finished) => {
                if (finished) {
                    runOnJS(setShouldRender)(false);
                }
            });
        }
    }, [visible]);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0, 1]),
    }));

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(progress.value, [0, 1], [screenHeight * 0.42, 0]) },
        ],
    }));

    if (!shouldRender) return null;

    return (
        <Modal
            visible={shouldRender}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.modalRoot}>
                <Animated.View style={[styles.backdrop, backdropStyle]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            height: screenHeight * heightPercentage,
                            marginBottom: bottomOffset,
                            borderBottomLeftRadius: bottomOffset > 0 ? 28 : 0,
                            borderBottomRightRadius: bottomOffset > 0 ? 28 : 0,
                        },
                        contentStyle,
                        sheetStyle,
                    ]}
                >
                    <View style={styles.dragHandle} />
                    
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Feather name="x" size={24} color={Colors.black} />
                    </TouchableOpacity>

                    {children}
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalRoot: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(2, 8, 5, 0.42)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 16,
        overflow: 'hidden',
    },
    dragHandle: {
        width: 54,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 14,
    },
    closeButton: {
        position: 'absolute',
        top: 24,
        right: 24,
        zIndex: 10,
    }
});
