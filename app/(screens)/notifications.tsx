import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { BodyLargeText, BodySmallText } from '../../components/shared/AppTexts';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { useDesignSystem } from '../../utils/design-system';

type NotificationType = 'Requests' | 'Security' | 'Activity';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  icon: 'request' | 'share' | 'trend' | 'clock' | 'phone' | 'warning';
  tone: string;
};

const notificationTabs: NotificationType[] = ['Requests', 'Security', 'Activity'];

const notificationsData: NotificationItem[] = [
  {
    id: '1',
    title: 'Identity Request',
    description: 'Paystack wants to verify your identity before approving access.',
    time: '2 mins ago',
    type: 'Requests',
    icon: 'request',
    tone: '#0E7490',
  },
  {
    id: '2',
    title: 'Identity shared successfully',
    description: 'Your verified credentials were securely shared with the requester.',
    time: '24 mins ago',
    type: 'Requests',
    icon: 'share',
    tone: '#166534',
  },
  {
    id: '3',
    title: 'Your Privacy Score increased to 86',
    description: 'Revoking old shares improved your privacy score and reduced exposure.',
    time: '1 hour ago',
    type: 'Activity',
    icon: 'trend',
    tone: '#166534',
  },
  {
    id: '4',
    title: 'Government ID verification expires soon',
    description: 'Your National ID verification will expire in 7 days.',
    time: 'Yesterday, 6:45 PM',
    type: 'Security',
    icon: 'clock',
    tone: '#D97706',
  },
  {
    id: '5',
    title: 'Phone number added successfully',
    description: 'Your phone number is now verified and ready for account recovery.',
    time: 'Yesterday, 2:12 PM',
    type: 'Activity',
    icon: 'phone',
    tone: '#7C3AED',
  },
  {
    id: '6',
    title: 'Exercise caution before sharing',
    description: 'Opay is requesting access to sensitive identity data.',
    time: 'Yesterday, 11:02 AM',
    type: 'Security',
    icon: 'warning',
    tone: '#BE123C',
  },
];

function NotificationGlyph({ type, color }: { type: NotificationItem['icon']; color: string }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <Circle cx="14" cy="14" r="10.5" stroke={color} strokeWidth="3.2" strokeDasharray="42 18" strokeLinecap="round" />
        <Circle cx="20.8" cy="7.2" r="3.4" fill="#F43F5E" />
        {type === 'request' ? (
          <Path d="M9 14h8.5M14.2 10.8l3.3 3.2-3.3 3.2" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        ) : null}
        {type === 'share' ? (
          <Path d="M9.5 15.5 13.9 13l4.6 2.5M13.9 13V8.8" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        ) : null}
        {type === 'trend' ? (
          <Path d="M8.6 17.2 12 13.7l2.3 2.2 5-5.3M16.3 10.6h3v3" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        ) : null}
        {type === 'clock' ? (
          <Path d="M14 8.2v6.1l3.8 2.2" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        ) : null}
        {type === 'phone' ? (
          <Path d="M10.4 8.2h7.2v11.6h-7.2V8.2ZM13.2 17.7h1.6" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        ) : null}
        {type === 'warning' ? (
          <Path d="M14 8.5v6.2M14 18.2v.1" stroke={color} strokeWidth="2" strokeLinecap="round" />
        ) : null}
      </Svg>
    </View>
  );
}

function NotificationsHeader() {
  const ds = useDesignSystem();
  const router = useRouter();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md, paddingHorizontal: ds.space.lg, paddingTop: ds.space.sm, paddingBottom: ds.space.lg }}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => router.back()}
        style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}
      >
        <Feather name="chevron-left" size={28} color={Colors.mainText} />
      </TouchableOpacity>
      <BodyLargeText style={{ flex: 1, fontFamily: Fonts.bold, fontSize: 21, color: Colors.mainText }}>Notifications</BodyLargeText>
      <TouchableOpacity activeOpacity={0.75} style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name="more-horizontal" size={25} color={Colors.mainText} />
      </TouchableOpacity>
    </View>
  );
}

function NotificationTabs({
  activeTab,
  onTabChange,
  counts,
}: {
  activeTab: NotificationType;
  onTabChange: (tab: NotificationType) => void;
  counts: Record<NotificationType, number>;
}) {
  const ds = useDesignSystem();

  return (
    <View style={{ flexDirection: 'row', gap: ds.space.md, paddingHorizontal: ds.space.lg, paddingBottom: ds.space.lg }}>
      {notificationTabs.map((tab) => {
        const isActive = activeTab === tab;
        const showBadge = tab === 'Requests' && counts[tab] > 0;

        return (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.82}
            onPress={() => onTabChange(tab)}
            style={{
              flex: 1,
              height: 48,
              borderRadius: ds.radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isActive ? '#ECFDF3' : Colors.white,
              borderWidth: 1,
              borderColor: isActive ? 'rgba(22,101,52,0.26)' : '#E5E7EB',
            }}
          >
            <BodySmallText
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ color: isActive ? '#166534' : 'rgba(5,21,14,0.55)', fontFamily: Fonts.semiBold, fontSize: 13 }}
            >
              {tab}
            </BodySmallText>
            {showBadge ? (
              <View
                style={{
                  position: 'absolute',
                  top: -7,
                  right: 10,
                  minWidth: 22,
                  height: 22,
                  paddingHorizontal: 6,
                  borderRadius: 11,
                  backgroundColor: '#F43F5E',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BodySmallText style={{ color: Colors.white, fontFamily: Fonts.bold, fontSize: 10, lineHeight: 12 }}>{counts[tab]}</BodySmallText>
              </View>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function NotificationCard({ item }: { item: NotificationItem }) {
  const ds = useDesignSystem();

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      style={{
        backgroundColor: Colors.white,
        borderRadius: ds.radius.xl,
        padding: ds.space.lg,
        gap: ds.space.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: ds.space.md }}>
        <NotificationGlyph type={item.icon} color={item.tone} />
        <BodyLargeText style={{ flex: 1, color: Colors.mainText, fontFamily: Fonts.bold, fontSize: 17, lineHeight: 23 }}>
          {item.title}
        </BodyLargeText>
      </View>
      <BodySmallText style={{ color: 'rgba(5,21,14,0.58)', fontSize: 14, lineHeight: 22 }}>
        {item.description}
      </BodySmallText>
      <View style={{ height: 1, backgroundColor: 'rgba(5,21,14,0.07)' }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
        <BodySmallText style={{ flex: 1, color: 'rgba(5,21,14,0.46)', fontFamily: Fonts.medium }}>{item.time}</BodySmallText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <BodySmallText style={{ color: '#166534', fontFamily: Fonts.bold }}>View</BodySmallText>
          <Feather name="chevron-right" size={20} color="#166534" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const ds = useDesignSystem();
  const { bottom } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<NotificationType>('Requests');

  const counts = useMemo(
    () =>
      notificationTabs.reduce(
        (acc, tab) => {
          acc[tab] = notificationsData.filter((item) => item.type === tab).length;
          return acc;
        },
        {} as Record<NotificationType, number>,
      ),
    [],
  );

  const filteredData = notificationsData.filter((item) => item.type === activeTab);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <NotificationsHeader />
      <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        ItemSeparatorComponent={() => <View style={{ height: ds.space.lg }} />}
        contentContainerStyle={{ paddingHorizontal: ds.space.lg, paddingBottom: bottom + ds.space['4xl'] }}
      />
    </SafeAreaView>
  );
}
