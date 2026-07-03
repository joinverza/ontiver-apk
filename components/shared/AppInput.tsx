import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, type TextInputProps, type ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { BodyLargeText, BodySmallText } from './AppTexts';

export type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
};

export function AppInput({ label, error, isPassword, containerStyle, style, ...props }: AppInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const ds = useDesignSystem();

  const borderColor = error
    ? Colors.error
    : isFocused
      ? Colors.primary
      : Colors.inputBorder;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <BodyLargeText style={[styles.label, { marginBottom: ds.space.xs }]} color={Colors.secondaryText}>
          {label}
        </BodyLargeText>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderRadius: ds.radius.sm,
            paddingHorizontal: ds.space.md,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              paddingVertical: ds.space.md,
              color: Colors.mainText,
              fontFamily: ds.typography.bodyLarge.fontFamily,
              fontSize: ds.typography.bodyLarge.fontSize,
            },
            style,
          ]}
          placeholderTextColor={Colors.grey200}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color={Colors.secondaryText}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <BodySmallText color={Colors.error} style={{ marginTop: ds.space.xs }}>
          {error}
        </BodySmallText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    // handled by in-line style
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: Colors.white,
    // shadowColor: Colors.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 3.84,
    // elevation: 0,
  },
  input: {
    flex: 1,
  },
  eyeIcon: {
    marginLeft: 8,
  },
});

export default AppInput;
