import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Colors, LightColors, DarkColors } from '../constants/Colors';
import { Fonts } from '../constants/fonts';
import { useTheme } from '../context/ThemeContext';

export const SIZE_KEYS = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
  '10xl',
  'full',
] as const;

export type SizeKey = (typeof SIZE_KEYS)[number];
type TokenMap = Record<SizeKey, number>;

const BASE_SPACE: TokenMap = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 56,
  '7xl': 64,
  '8xl': 72,
  '9xl': 80,
  '10xl': 88,
  'full': 9999,
};

const BASE_RADIUS: TokenMap = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
  '7xl': 56,
  '8xl': 64,
  '9xl': 72,
  '10xl': 80,
  'full': 9999,
};

function mapTokens(tokens: TokenMap, map: (value: number) => number): TokenMap {
  const out = {} as TokenMap;
  for (const key of SIZE_KEYS) {
    out[key] = map(tokens[key]);
  }
  return out;
}

export type TypographyVariant = 
  | 'display' 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'bodyLarge' 
  | 'bodySmall' 
  | 'label' 
  | 'button' 
  | 'micro';

export type DesignSystem = {
  width: number;
  height: number;
  colors: typeof Colors;
  space: TokenMap;
  radius: TokenMap;
  typography: Record<TypographyVariant, { fontSize: number; lineHeight: number; fontFamily: string }>;
};

export function createDesignSystem(width: number, height: number, theme: 'light' | 'dark' = 'light'): DesignSystem {
  const scale = (value: number) => Math.round(value * Math.min(Math.max(width / 390, 0.92), 1.15));

  const space = mapTokens(BASE_SPACE, scale);
  const radius = mapTokens(BASE_RADIUS, scale);

  return {
    width,
    height,
    colors: theme === 'dark' ? DarkColors : LightColors,
    space,
    radius,
    typography: {
      display: {
        fontSize: scale(34),
        lineHeight: Math.round(scale(34) * 1.2),
        fontFamily: Fonts.extraBold,
      },
      h1: {
        fontSize: scale(28),
        lineHeight: Math.round(scale(28) * 1.2),
        fontFamily: Fonts.bold,
      },
      h2: {
        fontSize: scale(22),
        lineHeight: Math.round(scale(22) * 1.3),
        fontFamily: Fonts.semiBold,
      },
      h3: {
        fontSize: scale(18),
        lineHeight: Math.round(scale(18) * 1.3),
        fontFamily: Fonts.semiBold,
      },
      bodyLarge: {
        fontSize: scale(16),
        lineHeight: Math.round(scale(16) * 1.5),
        fontFamily: Fonts.regular,
      },
      bodySmall: {
        fontSize: scale(14),
        lineHeight: Math.round(scale(14) * 1.5),
        fontFamily: Fonts.regular,
      },
      label: {
        fontSize: scale(12),
        lineHeight: Math.round(scale(12) * 1.4),
        fontFamily: Fonts.bold,
      },
      button: {
        fontSize: scale(16),
        lineHeight: Math.round(scale(16) * 1.4),
        fontFamily: Fonts.semiBold,
      },
      micro: {
        fontSize: scale(11),
        lineHeight: Math.round(scale(11) * 1.4),
        fontFamily: Fonts.regular,
      },
    },
  };
}

export function useDesignSystem() {
  const { width, height } = useWindowDimensions();
  const { theme } = useTheme();
  return useMemo(() => createDesignSystem(width, height, theme), [width, height, theme]);
}
