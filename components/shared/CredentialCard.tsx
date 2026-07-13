import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// ─── Card shape path (curved top dip) ─────────────────────────────────────────
export function credentialCardPath(w: number, h: number, r = 28) {
  const dipDepth = 16;
  const dipTopWidth = 140;
  const dipBottomWidth = 60;
  const center = w / 2;
  const dipStart = center - dipTopWidth / 2;
  const dipBottomLeft = center - dipBottomWidth / 2;
  const dipBottomRight = center + dipBottomWidth / 2;
  const dipEnd = center + dipTopWidth / 2;
  const cp = 24;
  return `
    M ${r} 0
    L ${dipStart} 0
    C ${dipStart + cp} 0, ${dipBottomLeft - cp} ${dipDepth}, ${dipBottomLeft} ${dipDepth}
    L ${dipBottomRight} ${dipDepth}
    C ${dipBottomRight + cp} ${dipDepth}, ${dipEnd - cp} 0, ${dipEnd} 0
    L ${w - r} 0
    A ${r} ${r} 0 0 1 ${w} ${r}
    L ${w} ${h - r}
    A ${r} ${r} 0 0 1 ${w - r} ${h}
    L ${r} ${h}
    A ${r} ${r} 0 0 1 0 ${h - r}
    L 0 ${r}
    A ${r} ${r} 0 0 1 ${r} 0
    Z
  `.trim();
}

// ─── Icon presets keyed by credential type ────────────────────────────────────
export type CredentialType = 'kyc' | 'aml' | 'kyb' | 'national_id' | 'passport' | 'drivers_license' | 'custom';

function CredentialIcon({ type, color, size = 24 }: { type: CredentialType; color: string; size?: number }) {
  switch (type) {
    case 'kyc':
    case 'national_id':
      return (
        <Svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
          <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} />
          <Circle cx="8" cy="11" r="3" stroke={color} />
          <Path d="M14 10h4 M14 14h4" stroke={color} />
          <Path d="M4 18c0-2.5 8-2.5 8 0" stroke={color} />
        </Svg>
      );
    case 'aml':
      return (
        <Svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
          <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} />
          <Path d="M9 12l2 2 4-4" stroke={color} />
        </Svg>
      );
    case 'kyb':
      return (
        <Svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
          <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} />
          <Path d="M9 22v-4h6v4" stroke={color} />
          <Path d="M8 6h.01 M16 6h.01 M8 10h.01 M16 10h.01 M8 14h.01 M16 14h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );
    case 'passport':
      return (
        <Svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
          <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} />
          <Circle cx="12" cy="11" r="4" stroke={color} />
          <Path d="M8 19h8" stroke={color} />
          <Path d="M9 7.5c0 2 6 2 6 0" stroke={color} />
        </Svg>
      );
    case 'drivers_license':
      return (
        <Svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
          <Rect x="2" y="5" width="20" height="14" rx="3" stroke={color} />
          <Circle cx="8" cy="12" r="2.5" stroke={color} />
          <Path d="M14 10h4 M14 14h4" stroke={color} />
        </Svg>
      );
    default:
      return (
        <Svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
          <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} />
          <Path d="M8 10h8 M8 14h4" stroke={color} />
        </Svg>
      );
  }
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusPill({ status, isLight }: { status: string; isLight: boolean }) {
  const bgColor = status === 'Verified'
    ? isLight ? 'rgba(0,0,0,0.12)' : 'rgba(30,215,96,0.25)'
    : status === 'Pending'
    ? isLight ? 'rgba(0,0,0,0.1)' : 'rgba(251,146,60,0.25)'
    : isLight ? 'rgba(0,0,0,0.1)' : 'rgba(239,68,68,0.25)';

  const dotColor = status === 'Verified' ? '#1ED760'
    : status === 'Pending' ? '#fb923c' : '#ef4444';

  const textColor = isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)';

  return (
    <View style={[pillStyles.pill, { backgroundColor: bgColor }]}>
      <View style={[pillStyles.dot, { backgroundColor: dotColor }]} />
      <Text style={[pillStyles.text, { color: textColor }]}>{status}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.2,
  },
});

// ─── Main CredentialCard ───────────────────────────────────────────────────────
export interface CredentialCardProps {
  /** Short label shown large e.g. "KYC", "NID" */
  label: string;
  /** Full title e.g. "Verified Identity" */
  title: string;
  /** Solid card background color. Pass null to use the frosted dark blur card. */
  bgColor: string | null;
  /** Icon preset */
  credentialType?: CredentialType;
  /** Force text to be light or dark. Auto-detected if omitted. */
  lightText?: boolean;
  /** Verification status */
  status?: string;
  /** Card width */
  width?: number;
  /** Card height */
  height?: number;
  /** Adds a clipped logo/image-style watermark behind the existing card content. */
  showBackgroundLogo?: boolean;
  /** Override the watermark icon without changing the foreground badge icon. */
  backgroundLogoType?: CredentialType;
  style?: ViewStyle;
}

export function CredentialCard({
  label,
  title,
  bgColor,
  credentialType = 'custom',
  lightText,
  status,
  width = 300,
  height = 160,
  showBackgroundLogo = false,
  backgroundLogoType,
  style,
}: CredentialCardProps) {
  const pathD = credentialCardPath(width, height);
  const isBlur = bgColor === null;
  const isLight = lightText !== undefined
    ? !lightText
    : bgColor ? isLightColor(bgColor) : false;
  const textColor = isLight ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)';
  const subColor  = isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.65)';
  const iconColor = isLight ? 'rgb(255, 255, 255)' : '#ffffff';
  const watermarkColor = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.1)';
  const badgeBg   = isBlur
    ? undefined
    : isLight ? 'rgb(0, 0, 0)' : 'rgba(153, 153, 153, 0.2)';

  return (
    <View style={[{ width, height }, style, cardStyles.shadow]}>
      {/* Background */}
      {isBlur ? (
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${width} ${height}`}>
              <Path d={pathD} fill="black" />
            </Svg>
          }
        >
          <BlurView intensity={1000} tint="dark" style={StyleSheet.absoluteFill} />
        </MaskedView>
      ) : (
        <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${width} ${height}`}>
          <Path d={pathD} fill={bgColor!} />
        </Svg>
      )}

      {showBackgroundLogo && (
        <MaskedView
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          maskElement={
            <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${width} ${height}`}>
              <Path d={pathD} fill="black" />
            </Svg>
          }
        >
          <View style={cardStyles.backgroundLogo}>
            <CredentialIcon
              type={backgroundLogoType ?? credentialType}
              color={watermarkColor}
              size={Math.min(width * 0.44, height * 0.95)}
            />
          </View>
        </MaskedView>
      )}

      {/* Icon badge */}
      {isBlur ? (
        <BlurView intensity={10} tint="light" style={[cardStyles.badge, { overflow: 'hidden' }]}>
          <CredentialIcon type={credentialType} color={iconColor} />
        </BlurView>
      ) : (
        <View style={[cardStyles.badge, { backgroundColor: badgeBg }]}>
          <CredentialIcon type={credentialType} color={iconColor} />
        </View>
      )}

      {/* Text content */}
      <View style={cardStyles.content}>
        <Text style={[cardStyles.value, { color: textColor }]}>{label}</Text>
        <Text style={[cardStyles.subLabel, { color: subColor }]}>{title}</Text>
        {status && <StatusPill status={status} isLight={isLight} />}
      </View>
    </View>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function isLightColor(hex: string) {
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const cardStyles = StyleSheet.create({
  shadow: {
    shadowColor: '#00000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: 24,
    right: 18,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backgroundLogo: {
    position: 'absolute',
    right: 12,
    bottom: -8,
    opacity: 1,
    transform: [{ rotate: '-8deg' }],
  },
  content: {
    position: 'absolute',
    top: 24,
    left: 22,
    right: 80,
  },
  value: {
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -1.2,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 2,
  },
  subLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.1,
  },
});
