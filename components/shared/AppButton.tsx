import { ActivityIndicator, StyleSheet, TextStyle, TouchableOpacity, type TouchableOpacityProps, type ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { ButtonText } from './AppTexts';

export type AppButtonProps = TouchableOpacityProps & {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void
};

export function AppButton({ title, loading, variant = 'primary', style, disabled, onPress, textStyle, ...props }: AppButtonProps) {
  const ds = useDesignSystem();

  const getBackgroundColor = () => {
    if (disabled) return Colors.grey200;
    if (variant === 'primary') return Colors.primary;
    if (variant === 'secondary') return Colors.secondary;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return Colors.secondaryText;
    if (variant === 'outline') return Colors.primary;
    return Colors.white;
  };

  const getBorderColor = () => {
    if (variant === 'outline') return disabled ? Colors.grey200 : Colors.primary;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          borderRadius: ds.radius.md,
          paddingVertical: ds.space.md,
          paddingHorizontal: ds.space.xl,
          opacity: disabled ? 0.4 : 1
        },
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <ButtonText color={getTextColor()} style={[styles.text, textStyle]}>
          {title}
        </ButtonText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // shadowColor: Colors.black,
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
  },
  text: {
    textAlign: 'center',
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
});

export default AppButton;
