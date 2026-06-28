import { Text, type TextProps, type TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useDesignSystem, type TypographyVariant } from '../../utils/design-system';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  size?: number;
  color?: string;
  weight?: TextStyle['fontWeight'];
};

function mergeStyle(style: TextProps['style'], extra: TextStyle) {
  return [extra, style];
}

export function AppText({ variant = 'bodyLarge', size, color, weight, style, ...props }: AppTextProps) {
  const ds = useDesignSystem();
  const token = ds.typography[variant];

  return (
    <Text
      {...props}
      style={mergeStyle(style, {
        fontSize: size ?? token.fontSize,
        lineHeight: token.lineHeight,
        color: color ?? Colors.mainText,
        fontFamily: token.fontFamily,
        ...(weight ? { fontWeight: weight } : {}),
      })}
    />
  );
}

export function DisplayText(props: AppTextProps) {
  return <AppText {...props} variant="display" />;
}

export function H1Text(props: AppTextProps) {
  return <AppText {...props} variant="h1" />;
}

export function H2Text(props: AppTextProps) {
  return <AppText {...props} variant="h2" />;
}

export function H3Text(props: AppTextProps) {
  return <AppText {...props} variant="h3" />;
}

export function BodyLargeText(props: AppTextProps) {
  return <AppText {...props} variant="bodyLarge" />;
}

export function BodySmallText(props: AppTextProps) {
  return <AppText {...props} variant="bodySmall" />;
}

export function Label(props: AppTextProps) {
  return <AppText {...props} variant="label" />;
}

export function ButtonText(props: AppTextProps) {
  return <AppText {...props} variant="button" />;
}

export function MicroText(props: AppTextProps) {
  return <AppText {...props} variant="micro" />;
}

export default AppText;
