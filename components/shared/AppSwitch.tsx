import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';

interface AppSwitchProps {
    isOn: boolean;
    onToggle: (state: boolean) => void;
    disabled?: boolean;
}

const AppSwitch: React.FC<AppSwitchProps> = ({ isOn, onToggle, disabled = false }) => {
    const ds = useDesignSystem();
    const translateX = useRef(new Animated.Value(isOn ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: isOn ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isOn]);

    const backgroundColor = translateX.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(225, 225, 225, 1)', Colors.primary]
    });

    const circleTranslateX = translateX.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 22] 
    });

    return (
        <Pressable 
            onPress={() => !disabled && onToggle(!isOn)}
            style={{ opacity: disabled ? 0.5 : 1 }}
        >
            <Animated.View style={[styles.track, { backgroundColor }]}>
                <Animated.View 
                    style={[
                        styles.thumb, 
                        { transform: [{ translateX: circleTranslateX }] }
                    ]} 
                />
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    track: {
        width: 44,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    }
});

export default AppSwitch;
