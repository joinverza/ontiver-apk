import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BodyLargeText, BodySmallText } from '../../components/shared/AppTexts';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { useDesignSystem } from '../../utils/design-system';

type ActivityStatus = 'Verified' | 'Pending' | 'Declined';

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: ActivityStatus;
};

const activityTabs = ['All', 'Verified', 'Pending', 'Declined'];

const activitiesData: ActivityItem[] = [
  { id: '1', title: 'Credential Added', description: 'National Identification was added to your vault.', date: 'Today, 10:42 AM', status: 'Verified' },
  { id: '2', title: 'Credential Review', description: 'Passport verification is still being checked.', date: 'Today, 9:18 AM', status: 'Pending' },
  { id: '3', title: 'Share Denied', description: 'A data request was declined before sharing.', date: 'Yesterday, 6:12 PM', status: 'Declined' },
  { id: '4', title: 'Credential Added', description: 'BVN credential was verified successfully.', date: '15th April, 2026', status: 'Verified' },
  { id: '5', title: 'Access Revoked', description: 'Old access was removed from a connected service.', date: '12th April, 2026', status: 'Declined' },
  { id: '6', title: 'Credential Review', description: 'Address verification needs another check.', date: '10th April, 2026', status: 'Pending' },
];

function ActivitiesHeader() {
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
      <BodyLargeText style={{ flex: 1, fontFamily: Fonts.bold, fontSize: 21, color: Colors.mainText }}>Activities</BodyLargeText>
      <TouchableOpacity activeOpacity={0.75} style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name="more-horizontal" size={25} color={Colors.mainText} />
      </TouchableOpacity>
    </View>
  );
}

function ActivityTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const ds = useDesignSystem();

  return (
    <View style={{ flexDirection: 'row', gap: ds.space.sm, paddingHorizontal: ds.space.lg, paddingBottom: ds.space.lg }}>
      {activityTabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.82}
            onPress={() => onTabChange(tab)}
            style={{
              flex: 1,
              height: 44,
              borderRadius: ds.radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isActive ? '#111827' : Colors.white,
              borderWidth: 1,
              borderColor: isActive ? '#111827' : '#E5E7EB',
            }}
          >
            <BodySmallText
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ color: isActive ? Colors.white : 'rgba(5,21,14,0.55)', fontFamily: Fonts.semiBold, fontSize: 12 }}
            >
              {tab}
            </BodySmallText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ActivityCard({ item }: { item: ActivityItem }) {
  const ds = useDesignSystem();

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      style={{
        minHeight: 76,
        flexDirection: 'row',
        alignItems: 'center',
        gap: ds.space.lg,
        paddingVertical: ds.space.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(5,21,14,0.07)',
      }}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <BodyLargeText style={{ color: Colors.mainText, fontFamily: Fonts.semiBold, fontSize: 15, lineHeight: 20 }}>
          {item.title}
        </BodyLargeText>
        <BodySmallText numberOfLines={1} style={{ color: 'rgba(5,21,14,0.42)', fontFamily: Fonts.medium, fontSize: 12 }}>
          {item.status} | {item.date}
        </BodySmallText>
      </View>
      <Feather name="arrow-right" size={20} color="rgba(5,21,14,0.3)" />
    </TouchableOpacity>
  );
}

export default function ActivitiesScreen() {
  const ds = useDesignSystem();
  const { bottom } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All');

  const filteredData = activeTab === 'All' ? activitiesData : activitiesData.filter((item) => item.status === activeTab);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ActivitiesHeader />
      <ActivityTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={() => (
          <View style={{ paddingBottom: ds.space.sm }}>
            <BodySmallText style={{ color: 'rgba(5,21,14,0.42)', fontFamily: Fonts.semiBold, fontSize: 13 }}>Account</BodySmallText>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: ds.space.lg, paddingBottom: bottom + ds.space['4xl'] }}
      />
    </SafeAreaView>
  );
}
