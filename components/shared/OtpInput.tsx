import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { H1Text } from './AppTexts';

export type OtpInputProps = {
  length?: number;
  code: string;
  setCode: (code: string) => void;
  onCodeFilled?: (code: string) => void;
  isSecure?: boolean;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  activeInputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  activeInputStyle?: TextStyle;
  autoFocus?: boolean;
  disabled?: boolean;
};

const ONLY_DIGITS = /\D+/g;

export function OtpInput({
  length = 4,
  code,
  setCode,
  onCodeFilled,
  isSecure = false,
  containerStyle,
  inputContainerStyle,
  activeInputContainerStyle,
  inputStyle,
  activeInputStyle,
  autoFocus = true,
  disabled = false,
}: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const ds = useDesignSystem();

  const digits = (code || '').replace(ONLY_DIGITS, '').slice(0, length);

  const focusInput = () => {
    if (disabled) return;
    Keyboard.dismiss();
    inputRef.current?.blur();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 70);
  };

  useEffect(() => {
    if (autoFocus && !disabled) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [autoFocus, disabled]);

  useEffect(() => {
    if (digits.length === length) {
      onCodeFilled?.(digits);
    }
  }, [digits, length, onCodeFilled]);

  const handleChangeText = (text: string) => {
    const nextValue = text.replace(ONLY_DIGITS, '').slice(0, length);
    setCode(nextValue);
  };

  const handleKeyPress = (_event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    return;
  };

  const activeIndex = Math.min(digits.length, length - 1);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={[styles.row, { gap: ds.space.sm }]}>
        {Array.from({ length }).map((_, index) => {
          const hasValue = index < digits.length;
          const isActive = isFocused && index === activeIndex;

          return (
            <TouchableOpacity
              key={`otp-box-${index}`}
              activeOpacity={0.9}
              onPress={focusInput}
              style={[
                styles.box,
                {
                  width: ds.space['5xl'],
                  height: ds.space['5xl'],
                  borderRadius: ds.radius.md,
                },
                hasValue ? styles.filledBox : styles.emptyBox,
                inputContainerStyle,
                isActive && styles.activeBox,
                isActive && activeInputContainerStyle,
              ]}
            >
              <H1Text
                style={[
                  styles.value,
                  hasValue ? styles.valueFilled : styles.valuePlaceholder,
                  inputStyle,
                  isActive && styles.valueActive,
                  isActive && activeInputStyle,
                ]}
              >
                {hasValue ? (isSecure ? '*' : digits[index]) : ''}
              </H1Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput
        ref={inputRef}
        value={digits}
        onChangeText={handleChangeText}
        onKeyPress={handleKeyPress}
        keyboardType="number-pad"
        maxLength={length}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        caretHidden
        editable={!disabled}
        showSoftInputOnFocus
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.hiddenInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  box: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderColor: Colors.inputBorder
  },
  emptyBox: {
    borderColor: Colors.inputBorder,
  },
  filledBox: {
  },
  activeBox: {
  },
  value: {
    color: Colors.mainText,
  },
  valueFilled: {
    color: Colors.mainText,
  },
  valuePlaceholder: {
    color: Colors.grey200,
  },
  valueActive: {
    color: Colors.mainText,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});

export default OtpInput;
