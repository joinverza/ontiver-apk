import AppButton from '@/components/shared/AppButton';
import { BodyLargeText, BodySmallText } from '@/components/shared/AppTexts';
import BackButton from '@/components/shared/BackButton';
import { FilterTabs } from '@/components/shared/FilterTabs';
import { Fonts } from '@/constants/fonts';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { CredentialCard } from '../../components/shared/CredentialCard';
import { BottomSheetModal } from '../../components/shared/BottomSheetModal';

export default function VaultScreen() {
  const ds = useDesignSystem();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { credentialId, openCredentialAt } = useLocalSearchParams<{ credentialId?: string; openCredentialAt?: string }>();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['All', 'Verified', 'Pending 05', 'Expired'];

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const data = [
    {
      id: '1',
      label: 'NIN',
      title: 'National Identification',
      country: 'Nigeria',
      status: 'Verified',
      date: '15th April, 2026',
      bgColor: '#e4e4e4',
      credentialType: 'kyc' as const,
    },
    {
      id: '2',
      label: 'BVN',
      title: 'Bank Verification',
      country: 'Nigeria',
      status: 'Verified',
      date: '15th April, 2026',
      bgColor: '#e4e4e4',
      credentialType: 'aml' as const,
    },
    {
      id: '3',
      label: 'Passport',
      title: 'International Passport',
      country: 'Nigeria',
      status: 'Pending',
      date: '15th April, 2026',
      bgColor: '#e4e4e4',
      credentialType: 'kyb' as const,
    },
  ];

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
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

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: ds.space.sm, paddingVertical: ds.space.md, paddingHorizontal: ds.space.lg, marginTop: insets.top }}>
        {/* <BackButton /> */}
        <View
          style={{
            flex: 1,
            height: 56,
            backgroundColor: Colors.white,
            borderRadius: ds.radius.md,
            paddingHorizontal: ds.space.md,
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#D1D5DB',
            borderWidth: 1,
          }}
        >
          <Feather name="search" size={20} color="rgba(0, 0, 0, 0.4)" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder='Search Vault'
            placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
            style={{
              flex: 1,
              height: '100%',
              fontFamily: Fonts.regular,
              fontSize: ds.typography.bodySmall.fontSize,
              color: Colors.black,
              paddingHorizontal: ds.space.sm,
              paddingVertical: 0,
            }}
          />
          <TouchableOpacity onPress={() => setSearchQuery('')} disabled={!searchQuery}>
            <Feather name="x" size={20} color={searchQuery ? "rgba(0, 0, 0, 0.55)" : "rgba(0, 0, 0, 0.22)"} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
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
                width={ds.width - ds.space.lg * 2}
                height={158}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: ds.space.md }}>
            <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </View>
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: ds.space.md }} />
        )}
        contentContainerStyle={{
          paddingHorizontal: ds.space.lg,
          paddingTop: ds.space.xs,
          paddingBottom: 140 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <Animated.View
        entering={FadeInUp.delay(500).springify()}
        style={{ position: "absolute", bottom: ds.space['7xl'] + insets.bottom + ds.space.lg, right: ds.space.xl, zIndex: 100 }}
      >
        <TouchableOpacity
          style={{ backgroundColor: Colors.primary, width: 64, height: 64, borderRadius: 32, justifyContent: "center", alignItems: "center", shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }}
          onPress={() => router.push('/(screens)/add-credential')}>
          <Feather name="plus" size={32} color={Colors.white} />
        </TouchableOpacity>
      </Animated.View>

      {/* Credential Details Bottom Sheet Modal */}
      <BottomSheetModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        heightPercentage={0.55}
      >
        {selectedItem && (
          <>
            <View style={{ alignItems: 'center', marginTop: ds.space.md, marginBottom: ds.space.xl }}>
              <View style={{
                paddingHorizontal: ds.space.md,
                paddingVertical: 4,
                borderRadius: ds.radius.full,
                backgroundColor: selectedItem.status === 'Verified' ? 'rgba(208, 255, 221, 1)' : 'rgba(255, 230, 208, 1)',
                marginBottom: ds.space.md,
              }}>
                <BodySmallText style={{
                  color: selectedItem.status === 'Verified' ? 'rgba(0, 125, 33, 1)' : 'rgba(170, 81, 2, 1)',
                  fontSize: 10,
                  fontFamily: Fonts.medium
                }}>{selectedItem.status}</BodySmallText>
              </View>
              <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 20 }}>{selectedItem.title}</BodyLargeText>
              <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.5)', marginTop: 4, fontFamily: Fonts.medium }}>{selectedItem.country} • {selectedItem.date}</BodySmallText>
            </View>

            <View style={{
              backgroundColor: '#F9FAFB',
              borderRadius: ds.radius.xl,
              padding: ds.space.lg,
              borderColor: '#E5E7EB',
              borderWidth: 1,
            }}>
              <View style={{ marginBottom: ds.space.md }}>
                <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 14 }}>Document Type</BodyLargeText>
                <BodySmallText style={{ marginTop: 2, color: 'rgba(5, 21, 14, 0.8)' }}>{selectedItem.label}</BodySmallText>
                <View style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: ds.space.sm }} />
              </View>
              <View style={{ marginBottom: ds.space.md }}>
                <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 14 }}>Full Name</BodyLargeText>
                <BodySmallText style={{ marginTop: 2, color: 'rgba(5, 21, 14, 0.8)' }}>Lawrence Gracious Paul</BodySmallText>
                <View style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: ds.space.sm }} />
              </View>
              <View style={{ marginBottom: ds.space.md }}>
                <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 14 }}>Country</BodyLargeText>
                <BodySmallText style={{ marginTop: 2, color: 'rgba(5, 21, 14, 0.8)' }}>{selectedItem.country}</BodySmallText>
                <View style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: ds.space.sm }} />
              </View>
              <View>
                <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 14 }}>Date Issued</BodyLargeText>
                <BodySmallText style={{ marginTop: 2, color: 'rgba(5, 21, 14, 0.8)' }}>{selectedItem.date}</BodySmallText>
              </View>
            </View>

            <View style={{ paddingVertical: ds.space.lg }}>
              <AppButton
                title="View Full Details"
                onPress={() => {
                  setModalVisible(false);
                  router.push('/(screens)/credential-details');
                }}
                style={{ borderRadius: ds.radius.lg }}
              />
            </View>
          </>
        )}
      </BottomSheetModal>
    </View>
  );
}

