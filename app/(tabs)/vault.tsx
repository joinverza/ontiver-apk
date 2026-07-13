import { BottomSheetModal } from '@/components/shared/BottomSheetModal';
import { BodyLargeText, BodySmallText, H2Text, Label } from '@/components/shared/AppTexts';
import { CredentialCard } from '@/components/shared/CredentialCard';
import { FilterTabs } from '@/components/shared/FilterTabs';
import { VaultCredentialDetailsDrawer, type VaultCredentialItem } from '@/components/shared/VaultCredentialDetailsDrawer';
import { Fonts } from '@/constants/fonts';
import { useDesignSystem } from '@/utils/design-system';
import { getFloatingActionButtonBottom, getFloatingTabBarContentPadding } from '@/utils/responsive-spacing';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { SectionList, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/Colors';

function VaultPass({ totalCredentials }: { totalCredentials: number }) {
  const ds = useDesignSystem();

  return (
    <View
      style={{
        minHeight: 74,
        borderTopLeftRadius: ds.radius.lg,
        borderTopRightRadius: ds.radius.lg,
        backgroundColor: Colors.white,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: ds.space.lg,
        paddingVertical: ds.space.lg,
        justifyContent: 'center',
      }}
    >
      <Svg width="142" height="78" viewBox="0 0 142 78" style={{ position: 'absolute', right: 62, top: -4 }} fill="none">
        {Array.from({ length: 9 }).map((_, index) => (
          <Path
            key={index}
            d={`M${14 + index * 8} -6 C${34 + index * 8} 18 ${27 + index * 8} 48 ${50 + index * 8} 84`}
            stroke="rgba(5, 21, 14, 0.08)"
            strokeWidth="1"
          />
        ))}
      </Svg>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 18, color: '#05150E' }}>Vault Pass</BodyLargeText>
            <Feather name="chevron-right" size={15} color="rgba(5,21,14,0.42)" />
          </View>
          <BodySmallText style={{ color: 'rgba(5,21,14,0.52)', fontSize: 11 }}>Credentials are encrypted and ready to share</BodySmallText>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 3 }}>
          <BodySmallText style={{ color: 'rgba(5,21,14,0.46)', fontFamily: Fonts.medium, fontSize: 10 }}>**** **** **** {String(totalCredentials).padStart(3, '0')}</BodySmallText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <BodyLargeText style={{ color: '#166534', fontFamily: Fonts.bold, fontSize: 18 }}>{totalCredentials}</BodyLargeText>
            <View style={{ paddingHorizontal: 7, paddingVertical: 3, borderRadius: ds.radius.full, backgroundColor: '#ECFDF3' }}>
              <BodySmallText style={{ color: '#166534', fontFamily: Fonts.bold, fontSize: 9 }}>SECURE</BodySmallText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function VaultMetricTile({
  title,
  value,
  detail,
  icon,
  color,
  bg,
  compact,
  wide,
}: {
  title: string;
  value: string;
  detail: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bg: string;
  compact?: boolean;
  wide?: boolean;
}) {
  const ds = useDesignSystem();

  return (
    <View
      style={{
        flex: 1,
        minHeight: wide ? 112 : compact ? 86 : 160,
        borderRadius: ds.radius.lg,
        backgroundColor: Colors.white,
        padding: ds.space.md,
        justifyContent: 'space-between',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: `${color}30`,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: ds.space.sm }}>
        <View
          style={{
            width: compact ? 32 : 42,
            height: compact ? 32 : 42,
            borderRadius: ds.radius.full,
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name={icon} size={compact ? 17 : 22} color={color} />
        </View>
        {wide ? (
          <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: ds.radius.full, backgroundColor: bg }}>
            <BodySmallText style={{ color, fontFamily: Fonts.bold, fontSize: 10 }}>Protected</BodySmallText>
          </View>
        ) : !compact ? (
          <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: ds.radius.full, backgroundColor: '#F8FAFC' }}>
            <BodySmallText style={{ color: 'rgba(5,21,14,0.54)', fontFamily: Fonts.medium, fontSize: 10 }}>Vault</BodySmallText>
          </View>
        ) : null}
      </View>
      <View style={{ gap: compact ? 1 : 5 }}>
        <BodySmallText style={{ color: 'rgba(5,21,14,0.5)', fontFamily: Fonts.medium, fontSize: compact ? 10 : 12 }}>{title}</BodySmallText>
        <H2Text style={{ color: '#05150E', fontFamily: Fonts.bold, fontSize: compact ? 19 : 32, lineHeight: compact ? 23 : 36 }}>{value}</H2Text>
        <BodySmallText numberOfLines={compact ? 1 : 2} style={{ color, fontFamily: Fonts.semiBold, fontSize: compact ? 11 : 12 }}>
          {detail}
        </BodySmallText>
      </View>
    </View>
  );
}

function VaultMetricGrid({ total, verified, pending }: { total: number; verified: number; pending: number }) {
  const ds = useDesignSystem();

  return (
    <View style={{ gap: ds.space.md }}>
      <VaultMetricTile title="In vault" value={String(total)} detail="Total credentials stored safely" icon="database" color="#166534" bg="#ECFDF3" wide />
      <View style={{ flexDirection: 'row', gap: ds.space.md }}>
        <VaultMetricTile title="Verified" value={String(verified)} detail="Ready to share" icon="check-circle" color="#0E7490" bg="#ECFEFF" compact />
        <VaultMetricTile title="Pending" value={String(pending)} detail="Needs review" icon="clock" color="#C2410C" bg="#FFF7ED" compact />
      </View>
    </View>
  );
}

function VaultStickyControls({
  searchQuery,
  setSearchQuery,
  tabs,
  activeTab,
  onTabChange,
  shownCount,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  shownCount: number;
}) {
  const ds = useDesignSystem();

  return (
    <View style={{ backgroundColor: '#F8FAFC', paddingTop: ds.space.sm, paddingBottom: ds.space.sm }}>
      <View
        style={{
          height: 46,
          backgroundColor: Colors.white,
          borderRadius: ds.radius.md,
          paddingHorizontal: ds.space.md,
          flexDirection: 'row',
          alignItems: 'center',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          marginBottom: ds.space.md,
        }}
      >
        <Feather name="search" size={18} color="rgba(5,21,14,0.42)" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search vault"
          placeholderTextColor="rgba(5,21,14,0.42)"
          style={{
            flex: 1,
            height: '100%',
            fontFamily: Fonts.regular,
            fontSize: Math.max(ds.typography.bodySmall.fontSize - 1, 12),
            color: Colors.black,
            paddingHorizontal: ds.space.sm,
            paddingVertical: 0,
          }}
        />
        <TouchableOpacity onPress={() => setSearchQuery('')} disabled={!searchQuery} style={{ padding: ds.space.xs }}>
          <Feather name="x" size={17} color={searchQuery ? 'rgba(5,21,14,0.58)' : 'rgba(5,21,14,0.2)'} />
        </TouchableOpacity>
      </View>

      <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
        <Label style={{ flex: 1, color: 'rgba(5,21,14,0.58)' }}>Credentials</Label>
        <BodySmallText style={{ color: Colors.primary, fontFamily: Fonts.bold }}>{shownCount} shown</BodySmallText>
      </View>
    </View>
  );
}

export default function VaultScreen() {
  const ds = useDesignSystem();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { credentialId, openCredentialAt } = useLocalSearchParams<{ credentialId?: string; openCredentialAt?: string }>();
  const tabSafePadding = getFloatingTabBarContentPadding(insets.bottom, ds.space['5xl']);
  const floatingActionBottom = getFloatingActionButtonBottom(insets.bottom, ds.space.lg);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<VaultCredentialItem | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tabs = ['All', 'Verified', 'Pending 05', 'Expired'];

  const data: VaultCredentialItem[] = [
    {
      id: '1',
      label: 'NIN',
      title: 'National Identification',
      country: 'Nigeria',
      status: 'Verified',
      date: '15th April, 2026',
      bgColor: '#e4e4e4',
      credentialType: 'kyc',
      backgroundLogoType: 'national_id',
    },
    {
      id: '2',
      label: 'BVN',
      title: 'Bank Verification',
      country: 'Nigeria',
      status: 'Verified',
      date: '15th April, 2026',
      bgColor: '#e4e4e4',
      credentialType: 'aml',
      backgroundLogoType: 'aml',
    },
    {
      id: '3',
      label: 'Passport',
      title: 'International Passport',
      country: 'Nigeria',
      status: 'Pending',
      date: '15th April, 2026',
      bgColor: '#e4e4e4',
      credentialType: 'kyb',
      backgroundLogoType: 'passport',
    },
  ];

  const verifiedCount = data.filter((item) => item.status === 'Verified').length;
  const pendingCount = data.filter((item) => item.status === 'Pending').length;

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleItemPress = (item: VaultCredentialItem) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setSelectedItem(item);
    requestAnimationFrame(() => setModalVisible(true));
  };

  const closeDetailsDrawer = () => {
    setModalVisible(false);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setSelectedItem(null);
      closeTimerRef.current = null;
    }, 220);
  };

  const openFullDetails = (item: VaultCredentialItem) => {
    setModalVisible(false);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setTimeout(() => {
      router.push({
        pathname: '/(screens)/credential-details',
        params: { credentialId: item.id },
      });
    }, 120);
  };

  useEffect(() => {
    if (!credentialId) return;

    const matchingCredential = data.find((item) => item.id === credentialId);
    if (matchingCredential) {
      handleItemPress(matchingCredential);
    }
  }, [credentialId, openCredentialAt]);

  const filteredData = data.filter((item) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab.startsWith('Pending') ? item.status === 'Pending' : item.status === activeTab);
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.label.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.country.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });
  const sections = [{ title: 'Credentials', data: filteredData }];

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC', paddingTop: insets.top + ds.space.lg }}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
        contentInsetAdjustmentBehavior="automatic"
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 80).duration(320)}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => handleItemPress(item)}
              style={{ alignItems: 'center' }}
            >
              <CredentialCard
                label={item.label}
                title={item.title}
                bgColor={item.bgColor}
                credentialType={item.credentialType}
                status={item.status}
                showBackgroundLogo
                backgroundLogoType={item.backgroundLogoType}
                width={ds.width - ds.space.lg * 2}
                height={158}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
        ListHeaderComponent={() => (
          <Animated.View entering={FadeInDown.duration(340)} style={{ gap: ds.space.lg, paddingBottom: ds.space.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
              <View style={{ flex: 1, gap: 4 }}>
                <BodySmallText style={{ color: 'rgba(5,21,14,0.52)', fontFamily: Fonts.medium }}>Secure credentials</BodySmallText>
                <H2Text style={{ color: Colors.mainText, fontFamily: Fonts.bold, fontSize: 31, lineHeight: 36 }}>My Vault</H2Text>
              </View>
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: ds.radius.full,
                  backgroundColor: Colors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Feather name="lock" size={20} color={Colors.primary} />
              </View>
            </View>

            <VaultPass totalCredentials={data.length} />

            <VaultMetricGrid total={data.length} verified={verifiedCount} pending={pendingCount} />
          </Animated.View>
        )}
        renderSectionHeader={() => (
          <VaultStickyControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            shownCount={filteredData.length}
          />
        )}
        ListEmptyComponent={() => (
          <View style={{ paddingVertical: ds.space['5xl'], alignItems: 'center', gap: ds.space.sm }}>
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: ds.radius.full,
                backgroundColor: '#ECFDF3',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="search" size={22} color={Colors.primary} />
            </View>
            <BodyLargeText style={{ fontFamily: Fonts.bold, color: Colors.mainText }}>No credentials found</BodyLargeText>
            <BodySmallText style={{ color: 'rgba(5,21,14,0.52)', textAlign: 'center' }}>Try another search term or status filter.</BodySmallText>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: ds.space.lg }} />}
        contentContainerStyle={{
          paddingHorizontal: ds.space.lg,
          paddingBottom: tabSafePadding,
        }}
        showsVerticalScrollIndicator={false}
      />

      <Animated.View
        entering={FadeInUp.delay(500).springify()}
        style={{ position: 'absolute', bottom: floatingActionBottom, right: ds.space.xl, zIndex: 100 }}
      >
        <TouchableOpacity
          style={{ backgroundColor: Colors.primary, width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }}
          onPress={() => router.push('/(screens)/add-credential')}
        >
          <Feather name="plus" size={32} color={Colors.white} />
        </TouchableOpacity>
      </Animated.View>

      <BottomSheetModal
        visible={isModalVisible}
        onClose={closeDetailsDrawer}
        heightPercentage={0.68}
        contentStyle={{ backgroundColor: '#F8FAFC' }}
      >
        {selectedItem && (
          <VaultCredentialDetailsDrawer
            item={selectedItem}
            bottomInset={Math.max(insets.bottom + ds.space.md, ds.space.xl)}
            onViewFullDetails={() => openFullDetails(selectedItem)}
          />
        )}
      </BottomSheetModal>
    </View>
  );
}
