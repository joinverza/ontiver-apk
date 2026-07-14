import { BodyLargeText, BodySmallText, H2Text, Label } from '@/components/shared/AppTexts';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/fonts';
import { useToast } from '@/context/ToastContext';
import { useDesignSystem } from '@/utils/design-system';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

type DetailItem = {
  label: string;
  value: string;
};

type CredentialDetail = {
  id: string;
  label: string;
  title: string;
  name: string;
  status: 'Verified' | 'Pending';
  issuedOn: string;
  expiresOn: string;
  heroTitle: string;
  heroCopy: string;
  details: DetailItem[];
};

const CREDENTIALS: CredentialDetail[] = [
  {
    id: '1',
    label: 'NIN',
    title: 'National Identification',
    name: 'Lawrence Gracious Paul',
    status: 'Verified',
    issuedOn: '15th April, 2026',
    expiresOn: '14th January, 2028',
    heroTitle: 'Verify Once. Use Everywhere.',
    heroCopy: 'Use your verified profile to speed up signups and partner services.',
    details: [
      { label: 'Full Name', value: 'Lawrence Gracious Paul' },
      { label: 'Date of Birth', value: '21st March 1995' },
      { label: 'ID Number', value: '923135092049' },
      { label: 'Gender', value: 'Male' },
      { label: 'Nationality', value: 'Nigerian' },
      { label: 'Expiry Date', value: '14th January, 2028' },
    ],
  },
  {
    id: '2',
    label: 'BVN',
    title: 'Bank Verification',
    name: 'Lawrence Gracious Paul',
    status: 'Verified',
    issuedOn: '15th April, 2026',
    expiresOn: '15th April, 2029',
    heroTitle: 'Bank Details. Privately Verified.',
    heroCopy: 'Share banking verification without exposing more data than needed.',
    details: [
      { label: 'Full Name', value: 'Lawrence Gracious Paul' },
      { label: 'BVN Number', value: '22473950182' },
      { label: 'Bank Status', value: 'Verified' },
      { label: 'Enrolled Bank', value: 'First Bank Nigeria' },
      { label: 'Phone Number', value: '+234 802 000 1402' },
      { label: 'Verified On', value: '15th April, 2026' },
    ],
  },
  {
    id: '3',
    label: 'Passport',
    title: 'International Passport',
    name: 'Lawrence Gracious Paul',
    status: 'Pending',
    issuedOn: '15th April, 2026',
    expiresOn: '10th May, 2031',
    heroTitle: 'Travel Identity. Ready When Approved.',
    heroCopy: 'Keep passport details organized while verification is being completed.',
    details: [
      { label: 'Full Name', value: 'Lawrence Gracious Paul' },
      { label: 'Passport Number', value: 'A09231541' },
      { label: 'Document Status', value: 'Pending Review' },
      { label: 'Nationality', value: 'Nigerian' },
      { label: 'Issued On', value: '15th April, 2026' },
      { label: 'Expiry Date', value: '10th May, 2031' },
    ],
  },
];

function CredentialHeroGraphic() {
  return (
    <Svg width={124} height={124} viewBox="0 0 124 124" fill="none">
      <Defs>
        <LinearGradient id="heroCard" x1="12" y1="18" x2="90" y2="116">
          <Stop offset="0" stopColor="#F8FFF9" stopOpacity="0.96" />
          <Stop offset="1" stopColor="#BDF7D1" stopOpacity="0.84" />
        </LinearGradient>
        <LinearGradient id="heroGlass" x1="48" y1="7" x2="104" y2="95">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.44" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.12" />
        </LinearGradient>
        <LinearGradient id="heroCheck" x1="58" y1="48" x2="116" y2="116">
          <Stop offset="0" stopColor="#34D399" />
          <Stop offset="1" stopColor="#047857" />
        </LinearGradient>
      </Defs>
      <Circle cx="33" cy="24" r="21" fill="rgba(255,255,255,0.13)" />
      <Circle cx="104" cy="25" r="10" fill="rgba(255,255,255,0.18)" />
      <Path d="M6 102C26 79 42 120 66 94C86 72 100 79 120 58" stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" />

      <Rect
        x="15"
        y="31"
        width="72"
        height="83"
        rx="18"
        fill="url(#heroCard)"
        stroke="rgba(255,255,255,0.68)"
        strokeWidth="2"
        transform="rotate(-8 51 72.5)"
      />
      <Circle cx="37" cy="56" r="10" fill="#166534" opacity="0.9" />
      <Path d="M55 49h25M55 62h18M29 83h45M29 96h31" stroke="#166534" strokeWidth="5" strokeLinecap="round" opacity="0.32" />

      <Rect x="48" y="11" width="53" height="72" rx="16" fill="url(#heroGlass)" stroke="rgba(255,255,255,0.42)" strokeWidth="2" />
      <Path d="M62 31h25M62 45h18M62 59h23" stroke="rgba(255,255,255,0.5)" strokeWidth="5" strokeLinecap="round" />
      <Path d="M46 22h-8v13M104 75h10V62" stroke="rgba(255,255,255,0.76)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
{/* 
      <Circle cx="87" cy="84" r="32" fill="url(#heroCheck)" stroke="rgba(255,255,255,0.72)" strokeWidth="6" />
      <Circle cx="87" cy="84" r="22" fill="rgba(255,255,255,0.09)" /> */}
      {/* <Path d="M73 84.5 82.8 94 101.8 73.5" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /> */}
    </Svg>
  );
}



function DetailRow({ item, isLast, index }: { item: DetailItem; isLast: boolean; index: number }) {
  const ds = useDesignSystem();

  return (
    <Animated.View
      entering={FadeInUp.delay(260 + index * 60).duration(280)}
      style={{
        paddingVertical: ds.space.lg,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: '#EEF2F6',
      }}
    >
      <BodyLargeText style={{ color: Colors.mainText, fontFamily: Fonts.bold, fontSize: 15 }}>
        {item.label}
      </BodyLargeText>
      <BodyLargeText
        selectable
        style={{
          color: 'rgba(5,21,14,0.72)',
          fontFamily: Fonts.regular,
          fontSize: 16,
          marginTop: 5,
        }}
      >
        {item.value}
      </BodyLargeText>
    </Animated.View>
  );
}

function CredentialActionButton({
  title,
  icon,
  variant,
  onPress,
}: {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  variant: 'primary' | 'secondary';
  onPress: () => void | Promise<void>;
}) {
  const ds = useDesignSystem();
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={{
        flex: 1,
        minHeight: 54,
        borderRadius: ds.radius.lg,
        borderWidth: 1,
        borderColor: isPrimary ? Colors.primary : '#DDE8E2',
        backgroundColor: isPrimary ? Colors.primary : Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: ds.space.sm,
      }}
    >
      <Feather name={icon} size={18} color={isPrimary ? Colors.white : Colors.primary} />
      <BodyLargeText
        style={{
          color: isPrimary ? Colors.white : Colors.primary,
          fontFamily: Fonts.bold,
          fontSize: 15,
        }}
      >
        {title}
      </BodyLargeText>
    </TouchableOpacity>
  );
}

export default function CredentialDetailsScreen() {
  const ds = useDesignSystem();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { credentialId } = useLocalSearchParams<{ credentialId?: string }>();

  const credential = useMemo(
    () => CREDENTIALS.find((item) => item.id === credentialId) ?? CREDENTIALS[0],
    [credentialId],
  );
  const credentialLink = useMemo(
    () => `https://ontiver.app/credential/${credential.id}`,
    [credential.id],
  );
  const credentialShareMessage = useMemo(
    () => `Use this Ontiver link to view my ${credential.title}: ${credentialLink}`,
    [credential.title, credentialLink],
  );

  const handleCopyCredentialLink = async () => {
    try {
      await Clipboard.setStringAsync(credentialLink);
    } catch {
      // Keep copy silent so the details page does not show a toast notification.
    }
  };

  const handleShareCredential = async () => {
    try {
      await Share.share({
        title: `Share ${credential.title}`,
        message: credentialShareMessage,
        url: credentialLink,
      });
    } catch {
      toast.showToast({ message: 'Unable to open share options', type: 'error' });
    }
  };

  return (
    <>
      <Stack.Screen options={{ animation: 'slide_from_right' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }} edges={['top', 'left', 'right']}>
        <Animated.View
          entering={FadeInDown.duration(260)}
          style={{
            height: 58,
            paddingHorizontal: ds.space.lg,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.72}
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="arrow-left" size={24} color={Colors.mainText} />
          </TouchableOpacity>

          <H2Text
            numberOfLines={1}
            style={{
              flex: 1,
              textAlign: 'center',
              color: Colors.mainText,
              fontFamily: Fonts.bold,
              fontSize: 24,
              lineHeight: 30,
            }}
          >
            {credential.title}
          </H2Text>

          <TouchableOpacity
            activeOpacity={0.72}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="more-vertical" size={24} color={Colors.mainText} />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            paddingHorizontal: ds.space.lg,
            paddingTop: ds.space.lg,
            paddingBottom: 116 + insets.bottom,
          }}
        >
          <Animated.View
            entering={FadeInRight.delay(90).duration(380)}
            style={{
              minHeight: 164,
              borderRadius: ds.radius.xl,
              backgroundColor: Colors.primary,
              overflow: 'hidden',
              padding: ds.space.lg,
              flexDirection: 'row',
              alignItems: 'center',
              gap: ds.space.md,
            }}
          >
            <View style={StyleSheet.absoluteFill}>
              <Svg width="100%" height="100%" viewBox="0 0 360 164" preserveAspectRatio="none">
                <Circle cx="48" cy="36" r="54" fill="rgba(255,255,255,0.08)" />
                <Circle cx="336" cy="12" r="86" fill="rgba(255,255,255,0.08)" />
                {/* <Path d="M-8 142C74 78 136 190 218 106C278 44 316 70 374 28" stroke="rgba(255,255,255,0.14)" strokeWidth="24" strokeLinecap="round" /> */}
              </Svg>
            </View>

            <View style={{ flex: 1, zIndex: 1, gap: ds.space.sm }}>
              <BodyLargeText
                style={{
                  color: Colors.white,
                  fontFamily: Fonts.extraBold,
                  fontSize: 26,
                  lineHeight: 31,
                }}
              >
                {credential.heroTitle}
              </BodyLargeText>
              <BodySmallText
                numberOfLines={3}
                style={{
                  color: 'rgba(255,255,255,0.76)',
                  fontFamily: Fonts.medium,
                  fontSize: 12,
                  lineHeight: 17,
                }}
              >
                {credential.heroCopy}
              </BodySmallText>
            </View>

            <Animated.View entering={FadeInUp.delay(260).springify()} style={{ zIndex: 1 }}>
              <CredentialHeroGraphic />
            </Animated.View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(160).duration(320)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: ds.space.md,
              paddingVertical: ds.space.lg,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: ds.radius.lg,
                backgroundColor: '#ECFDF3',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#BBF7D0',
              }}
            >
              <Feather name="shield" size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <BodyLargeText style={{ color: Colors.mainText, fontFamily: Fonts.bold, fontSize: 17 }}>
                {credential.name}
              </BodyLargeText>
              <BodySmallText style={{ color: 'rgba(5,21,14,0.52)', fontFamily: Fonts.medium }}>
                Issued {credential.issuedOn} | Expires {credential.expiresOn}
              </BodySmallText>
            </View>
          </Animated.View>

          <Label style={{ color: Colors.mainText, fontSize: 13, marginBottom: ds.space.md }}>
            Credential Details
          </Label>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: ds.radius.lg,
              paddingHorizontal: ds.space.lg,
              borderWidth: 1,
              borderColor: '#EEF2F6',
            }}
          >
            {credential.details.map((item, index) => (
              <DetailRow
                key={item.label}
                item={item}
                index={index}
                isLast={index === credential.details.length - 1}
              />
            ))}
          </View>

          <Animated.View
            entering={FadeInUp.delay(520).duration(320)}
            style={{
              marginTop: ds.space.lg,
              backgroundColor: Colors.white,
              borderRadius: ds.radius.lg,
              padding: ds.space.lg,
              borderWidth: 1,
              borderColor: '#EEF2F6',
              gap: ds.space.md,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: '#F8FAFC',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="lock" size={18} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <BodyLargeText style={{ color: Colors.mainText, fontFamily: Fonts.bold, fontSize: 15 }}>
                  Privacy Protected
                </BodyLargeText>
                <BodySmallText style={{ color: 'rgba(5,21,14,0.52)', fontFamily: Fonts.medium }}>
                  Only approved fields are shared when you authorize access.
                </BodySmallText>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        <Animated.View
          entering={FadeInUp.delay(620).duration(300)}
          style={{
            position: 'absolute',
            left: ds.space.lg,
            right: ds.space.lg,
            bottom: Math.max(insets.bottom, ds.space.md),
            paddingTop: ds.space.md,
            backgroundColor: '#F8FAFC',
            flexDirection: 'row',
            gap: ds.space.md,
          }}
        >
          <CredentialActionButton
            title="Copy Link"
            icon="copy"
            variant="secondary"
            onPress={handleCopyCredentialLink}
          />
          <CredentialActionButton
            title="Share"
            icon="share-2"
            variant="primary"
            onPress={handleShareCredential}
          />
        </Animated.View>
      </SafeAreaView>
    </>
  );
}
