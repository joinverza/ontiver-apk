import { Feather } from '@expo/vector-icons';
import { ScrollView, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import AppButton from './AppButton';
import { BodyLargeText, BodySmallText, Label } from './AppTexts';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { useDesignSystem } from '../../utils/design-system';
import type { CredentialType } from './CredentialCard';

export type VaultCredentialItem = {
  id: string;
  label: string;
  title: string;
  country: string;
  status: string;
  date: string;
  bgColor: string;
  credentialType: CredentialType;
  backgroundLogoType?: CredentialType;
};

type VaultCredentialDetailsDrawerProps = {
  item: VaultCredentialItem;
  onViewFullDetails: () => void;
  bottomInset?: number;
};

function statusTone(status: string) {
  if (status === 'Verified') {
    return {
      bg: '#ECFDF3',
      text: '#166534',
      dot: '#22C55E',
    };
  }

  if (status === 'Pending') {
    return {
      bg: '#FFF7ED',
      text: '#C2410C',
      dot: '#F97316',
    };
  }

  return {
    bg: '#FFF1F2',
    text: '#BE123C',
    dot: '#F43F5E',
  };
}

function CredentialMark({ type, color = '#166534', size = 28 }: { type: CredentialType; color?: string; size?: number }) {
  if (type === 'aml') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3.6 19.2 6.7v5.4c0 4.1-2.8 7-7.2 8.7-4.4-1.7-7.2-4.6-7.2-8.7V6.7L12 3.6Z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
        <Path d="M8.8 12.2 11 14.4l4.4-4.8" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'passport' || type === 'kyb') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="5" y="3" width="14" height="18" rx="2.6" stroke={color} strokeWidth="1.9" />
        <Circle cx="12" cy="11" r="3.5" stroke={color} strokeWidth="1.7" />
        <Path d="M8.2 17.2h7.6M9 7.3h6" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3.5" y="5" width="17" height="14" rx="3" stroke={color} strokeWidth="1.9" />
      <Circle cx="9" cy="11" r="2.2" stroke={color} strokeWidth="1.7" />
      <Path d="M14 10h3M14 14h3M6.5 16.2c.7-1.6 4.3-1.6 5 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

function DetailRow({
  icon,
  label,
  value,
  isLast,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  const ds = useDesignSystem();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: ds.space.md,
        paddingVertical: ds.space.md,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: '#EEF2F6',
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: ds.radius.full,
          backgroundColor: '#F8FAFC',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name={icon} size={17} color="rgba(5,21,14,0.58)" />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <BodySmallText style={{ color: 'rgba(5,21,14,0.48)', fontSize: 11, fontFamily: Fonts.medium }}>{label}</BodySmallText>
        <BodyLargeText selectable style={{ color: Colors.mainText, fontFamily: Fonts.semiBold, fontSize: 15 }}>{value}</BodyLargeText>
      </View>
    </View>
  );
}

export function VaultCredentialDetailsDrawer({
  item,
  onViewFullDetails,
  bottomInset = 0,
}: VaultCredentialDetailsDrawerProps) {
  const ds = useDesignSystem();
  const status = statusTone(item.status);
  const markType = item.backgroundLogoType ?? item.credentialType;

  const detailRows = [
    { icon: 'credit-card' as const, label: 'Document Type', value: item.label },
    { icon: 'user' as const, label: 'Full Name', value: 'Lawrence Gracious Paul' },
    { icon: 'map-pin' as const, label: 'Country', value: item.country },
    { icon: 'calendar' as const, label: 'Date Issued', value: item.date },
  ];

  return (
    <View style={{ flex: 1, paddingBottom: Math.max(bottomInset, ds.space.md) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md, paddingRight: ds.space['4xl'], paddingBottom: ds.space.lg }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: ds.radius.lg,
            backgroundColor: '#F0FDF4',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CredentialMark type={markType} color="#166534" size={30} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <BodyLargeText style={{ color: Colors.mainText, fontFamily: Fonts.bold, fontSize: 20, lineHeight: 25 }}>
            {item.title}
          </BodyLargeText>
          <BodySmallText style={{ color: 'rgba(5,21,14,0.54)', fontFamily: Fonts.medium }}>
            {item.country} | {item.date}
          </BodySmallText>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: ds.space.lg, paddingBottom: ds.space.lg }}>
        <View
          style={{
            minHeight: 106,
            borderRadius: ds.radius.xl,
            backgroundColor: '#07150F',
            overflow: 'hidden',
            padding: ds.space.lg,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ position: 'absolute', right: -18, bottom: -38, opacity: 0.18, transform: [{ rotate: '-10deg' }] }}>
            <CredentialMark type={markType} color={Colors.white} size={130} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: ds.space.md }}>
            <View style={{ flex: 1, gap: 5 }}>
              <Label style={{ color: 'rgba(255,255,255,0.58)', fontSize: 11 }}>Vault credential</Label>
              <BodyLargeText style={{ color: Colors.white, fontFamily: Fonts.bold, fontSize: 24, lineHeight: 28 }}>{item.label}</BodyLargeText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: ds.space.sm,
                paddingVertical: 6,
                borderRadius: ds.radius.full,
                backgroundColor: status.bg,
              }}
            >
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: status.dot }} />
              <BodySmallText style={{ color: status.text, fontFamily: Fonts.bold, fontSize: 10 }}>{item.status}</BodySmallText>
            </View>
          </View>
          <BodySmallText style={{ color: 'rgba(255,255,255,0.62)', fontFamily: Fonts.medium }}>
            Stored securely in your personal identity vault.
          </BodySmallText>
        </View>

        <View style={{ backgroundColor: Colors.white, borderRadius: ds.radius.xl, paddingHorizontal: ds.space.md }}>
          {detailRows.map((row, index) => (
            <DetailRow
              key={row.label}
              icon={row.icon}
              label={row.label}
              value={row.value}
              isLast={index === detailRows.length - 1}
            />
          ))}
        </View>
      </ScrollView>

      <View style={{ paddingTop: ds.space.sm }}>
        <AppButton
          title="View Full Details"
          onPress={onViewFullDetails}
          style={{ borderRadius: ds.radius.lg }}
        />
      </View>
    </View>
  );
}

export default VaultCredentialDetailsDrawer;
