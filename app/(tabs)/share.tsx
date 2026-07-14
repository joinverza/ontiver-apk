import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useMemo, useState } from 'react';
import { ScrollView, SectionList, Share, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import AppButton from '../../components/shared/AppButton';
import { BodyLargeText, BodySmallText, Label } from '../../components/shared/AppTexts';
import { BottomSheetModal } from '../../components/shared/BottomSheetModal';
import { FilterTabs } from '../../components/shared/FilterTabs';
import {
  getSharePartnerMeta,
  getShareStatusStyles,
  SharePartnerIcon,
  SharingHistoryCard,
} from '../../components/shared/SharingHistoryCard';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { useDesignSystem } from '../../utils/design-system';
import { getFloatingTabBarContentPadding } from '../../utils/responsive-spacing';

type ShareStatus = 'Active' | 'Revoked' | 'Denied';
type SharedFieldType = 'name' | 'email' | 'age' | 'phone' | 'birth' | 'address' | 'kyc' | 'id';

type SharedField = {
  label: string;
  value: string;
  type: SharedFieldType;
};

type HistoryItem = {
  id: string;
  name: string;
  details: string;
  time: string;
  status: ShareStatus;
  purpose: string;
  sharedFields: SharedField[];
};

const SHARE_LINK = 'https://ontiver.app/share/gracious-identity';

function SharedFieldIcon({ type, color }: { type: SharedFieldType; color: string }) {
  if (type === 'email') {
    return (
      <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <Rect x="3.5" y="5.5" width="17" height="13" rx="3" stroke={color} strokeWidth="1.9" />
        <Path d="m5.5 8 6.5 5 6.5-5" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'phone') {
    return (
      <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <Rect x="7" y="3" width="10" height="18" rx="3" stroke={color} strokeWidth="1.9" />
        <Path d="M10.5 17.5h3" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'age') {
    return (
      <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.9" />
        <Path d="M8.5 12.2 11 14.7l4.8-5.2" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'birth') {
    return (
      <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="6" width="16" height="14" rx="3" stroke={color} strokeWidth="1.9" />
        <Path d="M8 4v4M16 4v4M7.5 11h9M8 15h4" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'address') {
    return (
      <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <Path d="M12 21s7-5.4 7-11a7 7 0 0 0-14 0c0 5.6 7 11 7 11Z" stroke={color} strokeWidth="1.9" />
        <Circle cx="12" cy="10" r="2.4" stroke={color} strokeWidth="1.9" />
      </Svg>
    );
  }

  if (type === 'kyc') {
    return (
      <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <Path d="M12 3.8 19 7v5.2c0 4.2-2.8 7.2-7 9-4.2-1.8-7-4.8-7-9V7l7-3.2Z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
        <Path d="M8.8 12.1 11 14.2l4.4-4.6" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'id') {
    return (
      <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <Rect x="3.5" y="5" width="17" height="14" rx="3" stroke={color} strokeWidth="1.9" />
        <Circle cx="9" cy="11" r="2" stroke={color} strokeWidth="1.7" />
        <Path d="M14 10h3M14 14h3M6.5 16c.7-1.6 4.3-1.6 5 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      </Svg>
    );
  }

  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="9" r="4" stroke={color} strokeWidth="1.9" />
      <Path d="M5.5 20c1.1-3.3 11.9-3.3 13 0" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </Svg>
  );
}

function SharePass({
  shareLink,
  copied,
  onCopy,
  onShare,
}: {
  shareLink: string;
  copied: boolean;
  onCopy: () => void;
  onShare: () => void;
}) {
  const ds = useDesignSystem();

  return (
    <View
      style={{
        minHeight: 168,
        borderTopLeftRadius: ds.radius.lg,
        borderTopRightRadius: ds.radius.lg,
        backgroundColor: Colors.white,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: ds.space.lg,
        gap: ds.space.lg,
      }}
    >
      <Svg width="152" height="92" viewBox="0 0 152 92" style={{ position: 'absolute', right: 76, top: -8 }} fill="none">
        {Array.from({ length: 10 }).map((_, index) => (
          <Path
            key={index}
            d={`M${14 + index * 8} -8 C${36 + index * 8} 19 ${27 + index * 8} 55 ${54 + index * 8} 98`}
            stroke="rgba(5, 21, 14, 0.08)"
            strokeWidth="1"
          />
        ))}
      </Svg>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: ds.space.lg }}>
        <View style={{ flex: 1, gap: ds.space.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 18, color: '#05150E' }}>Share Pass</BodyLargeText>
            <Feather name="chevron-right" size={15} color="rgba(5,21,14,0.42)" />
          </View>
          <BodySmallText style={{ color: 'rgba(5,21,14,0.52)', fontSize: 11, lineHeight: 16 }}>
            Share your verified identity link or let another device scan your code.
          </BodySmallText>
          <View
            style={{
              borderRadius: ds.radius.md,
              backgroundColor: '#F8FAFC',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              paddingHorizontal: ds.space.sm,
              paddingVertical: 8,
            }}
          >
            <BodySmallText numberOfLines={1} selectable style={{ color: '#05150E', fontFamily: Fonts.medium, fontSize: 11 }}>
              {shareLink}
            </BodySmallText>
          </View>
        </View>

        <View
          style={{
            width: 92,
            height: 92,
            borderRadius: ds.radius.md,
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <QRCode value={shareLink} size={72} color="#05150E" backgroundColor="#FFFFFF" />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: ds.space.sm }}>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={onCopy}
          style={{
            flex: 1,
            height: 42,
            borderRadius: ds.radius.md,
            backgroundColor: '#ECFDF3',
            borderWidth: 1,
            borderColor: '#BBF7D0',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
          }}
        >
          <Feather name={copied ? 'check' : 'copy'} size={16} color="#166534" />
          <BodySmallText style={{ color: '#166534', fontFamily: Fonts.bold }}>{copied ? 'Copied' : 'Copy Link'}</BodySmallText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.82}
          onPress={onShare}
          style={{
            flex: 1,
            height: 42,
            borderRadius: ds.radius.md,
            backgroundColor: '#05150E',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
          }}
        >
          <Feather name="share-2" size={16} color={Colors.white} />
          <BodySmallText style={{ color: Colors.white, fontFamily: Fonts.bold }}>Share</BodySmallText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ShareStickyControls({
  searchQuery,
  setSearchQuery,
  tabs,
  activeTab,
  onTabChange,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const ds = useDesignSystem();

  return (
    <View style={{ backgroundColor: '#F8FAFC', paddingTop: ds.space.sm, paddingBottom: ds.space.sm }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: ds.radius.lg,
        paddingHorizontal: ds.space.md,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        marginBottom: ds.space.md,
        height: 46,
      }}>
        <Feather name="search" size={18} color="rgba(5, 21, 14, 0.45)" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search shares"
          placeholderTextColor="rgba(5, 21, 14, 0.45)"
          style={{
            flex: 1,
            height: '100%',
            fontFamily: Fonts.regular,
            fontSize: Math.max(ds.typography.bodySmall.fontSize - 1, 12),
            color: Colors.black,
            paddingVertical: 0,
            paddingHorizontal: ds.space.sm,
          }}
        />
        {!!searchQuery && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: ds.space.xs }}>
            <Feather name="x" size={17} color="rgba(5, 21, 14, 0.45)" />
          </TouchableOpacity>
        )}
      </View>

      <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
    </View>
  );
}

export default function ShareScreen() {
  const ds = useDesignSystem();
  const { top, bottom } = useSafeAreaInsets();
  const tabSafePadding = getFloatingTabBarContentPadding(bottom, ds.space['5xl']);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [isRevokeModalVisible, setRevokeModalVisible] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const historyTabs = ['All', 'Active', 'Revoked', 'Denied'];

  const historyData: HistoryItem[] = [
    {
      id: '1',
      name: 'Paystack',
      details: 'Name, Email, Age',
      time: '2 hours ago',
      status: 'Active',
      purpose: 'Checkout age and account verification',
      sharedFields: [
        { label: 'Full Name', value: 'Lawrence Gracious Paul', type: 'name' },
        { label: 'Email', value: 'adaeze.okafor@gmail.com', type: 'email' },
        { label: 'Age Verification', value: '18+', type: 'age' },
      ],
    },
    {
      id: '2',
      name: 'Flutterwave',
      details: 'Name, Phone Number',
      time: 'May 4, 2026',
      status: 'Active',
      purpose: 'Payment profile verification',
      sharedFields: [
        { label: 'Full Name', value: 'Lawrence Gracious Paul', type: 'name' },
        { label: 'Phone Number', value: '+234 809 834 5382', type: 'phone' },
      ],
    },
    {
      id: '3',
      name: 'Paystack',
      details: 'Name, Email, Age',
      time: '2 hours ago',
      status: 'Active',
      purpose: 'Merchant identity confirmation',
      sharedFields: [
        { label: 'Full Name', value: 'Lawrence Gracious Paul', type: 'name' },
        { label: 'Email', value: 'adaeze.okafor@gmail.com', type: 'email' },
        { label: 'Age Verification', value: '18+', type: 'age' },
      ],
    },
    {
      id: '4',
      name: 'Kuda Bank',
      details: 'Name, Date of Birth, Address',
      time: 'April 28, 2026',
      status: 'Revoked',
      purpose: 'Bank account compliance review',
      sharedFields: [
        { label: 'Full Name', value: 'Lawrence Gracious Paul', type: 'name' },
        { label: 'Date of Birth', value: '12 May 1999', type: 'birth' },
        { label: 'Address', value: '12 Allen Avenue, Ikeja', type: 'address' },
      ],
    },
    {
      id: '5',
      name: 'Binance',
      details: 'Shared KYC Verified',
      time: '3 days ago',
      status: 'Active',
      purpose: 'Trading account KYC validation',
      sharedFields: [
        { label: 'KYC Status', value: 'Verified', type: 'kyc' },
        { label: 'Verification Level', value: 'Standard', type: 'kyc' },
        { label: 'Document ID', value: 'NIN ending 4521', type: 'id' },
      ],
    },
    {
      id: '6',
      name: 'Opay',
      details: 'Full Name, ID Number',
      time: '3 days ago',
      status: 'Denied',
      purpose: 'Wallet limit upgrade request',
      sharedFields: [
        { label: 'Full Name', value: 'Lawrence Gracious Paul', type: 'name' },
        { label: 'ID Number', value: 'NIN ending 4521', type: 'id' },
      ],
    },
  ];

  const filteredData = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return historyData.filter((item) => {
      const matchesTab = activeTab === 'All' || item.status === activeTab;
      const matchesSearch = !normalizedQuery
        || item.name.toLowerCase().includes(normalizedQuery)
        || item.details.toLowerCase().includes(normalizedQuery)
        || item.status.toLowerCase().includes(normalizedQuery);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleItemPress = (item: HistoryItem) => {
    setSelectedItem(item);
    setInfoModalVisible(true);
  };

  const handleRevokePress = () => {
    setInfoModalVisible(false);
    setTimeout(() => setRevokeModalVisible(true), 220);
  };

  const handleCopyShareLink = async () => {
    await Clipboard.setStringAsync(SHARE_LINK);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 1800);
  };

  const handleNativeShare = async () => {
    await Share.share({
      title: 'Share Ontiver identity link',
      message: `Use this Ontiver link to request my verified identity: ${SHARE_LINK}`,
      url: SHARE_LINK,
    });
  };

  const selectedStatus = selectedItem ? getShareStatusStyles(selectedItem.status) : null;
  const selectedPartner = selectedItem ? getSharePartnerMeta(selectedItem.name) : null;
  const activeShareCount = historyData.filter((item) => item.status === 'Active').length;
  const revokedShareCount = historyData.filter((item) => item.status === 'Revoked').length;
  const sections = [{ title: 'Sharing history', data: filteredData }];

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: ds.space.lg, paddingTop: top + ds.space.md }}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <Animated.View entering={FadeInUp.duration(260)} style={{ gap: ds.space.lg, paddingBottom: ds.space.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
              <View style={{ flex: 1, gap: 4 }}>
                <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.52)', fontFamily: Fonts.medium }}>Data sharing</BodySmallText>
                <BodyLargeText style={{ color: Colors.mainText, fontFamily: Fonts.bold, fontSize: 30, lineHeight: 35 }}>Share</BodyLargeText>
              </View>
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: ds.radius.full,
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="share-2" size={20} color={Colors.primary} />
              </View>
            </View>

            <SharePass
              shareLink={SHARE_LINK}
              copied={copiedShareLink}
              onCopy={handleCopyShareLink}
              onShare={handleNativeShare}
            />

            <View style={{ flexDirection: 'row', gap: ds.space.md }}>
              <View style={{ flex: 1, backgroundColor: Colors.white, borderRadius: ds.radius.lg, borderWidth: 1, borderColor: '#BBF7D0', padding: ds.space.md, gap: 3 }}>
                <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.48)', fontFamily: Fonts.medium }}>Active</BodySmallText>
                <BodyLargeText style={{ color: '#166534', fontFamily: Fonts.bold, fontSize: 24, lineHeight: 29 }}>{activeShareCount}</BodyLargeText>
              </View>
              <View style={{ flex: 1, backgroundColor: Colors.white, borderRadius: ds.radius.lg, borderWidth: 1, borderColor: '#E5E7EB', padding: ds.space.md, gap: 3 }}>
                <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.48)', fontFamily: Fonts.medium }}>Total</BodySmallText>
                <BodyLargeText style={{ color: '#05150E', fontFamily: Fonts.bold, fontSize: 24, lineHeight: 29 }}>{historyData.length}</BodyLargeText>
              </View>
              <View style={{ flex: 1, backgroundColor: Colors.white, borderRadius: ds.radius.lg, borderWidth: 1, borderColor: '#FECDD3', padding: ds.space.md, gap: 3 }}>
                <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.48)', fontFamily: Fonts.medium }}>Revoked</BodySmallText>
                <BodyLargeText style={{ color: '#BE123C', fontFamily: Fonts.bold, fontSize: 24, lineHeight: 29 }}>{revokedShareCount}</BodyLargeText>
              </View>
            </View>
          </Animated.View>
        )}
        renderSectionHeader={() => (
          <ShareStickyControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            tabs={historyTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
        renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.delay(index * 55).duration(280)}>
              <SharingHistoryCard
                name={item.name}
                details={item.details}
                time={item.time}
                status={item.status}
                purpose={item.purpose}
                onPress={() => handleItemPress(item)}
              />
            </Animated.View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: ds.space.md }} />}
        ListEmptyComponent={() => (
          <View style={{ paddingVertical: ds.space['4xl'], alignItems: 'center' }}>
            <BodyLargeText style={{ fontFamily: Fonts.semiBold, color: '#0F241C' }}>No shares found</BodyLargeText>
            <BodySmallText style={{ marginTop: 4, color: 'rgba(5, 21, 14, 0.55)' }}>Try another status or search term.</BodySmallText>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: tabSafePadding }}
      />

      <BottomSheetModal
        visible={isInfoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        heightPercentage={0.74}
      >
        {selectedItem && selectedStatus && selectedPartner && (
          <View style={{ flex: 1 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: ds.space.md,
              backgroundColor: Colors.white,
              borderRadius: ds.radius.lg,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: ds.space.md,
              marginBottom: ds.space.md,
            }}>
              <View style={{
                width: 58,
                height: 58,
                borderRadius: ds.radius.lg,
                backgroundColor: selectedPartner.bg,
                borderColor: selectedPartner.border,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <SharePartnerIcon name={selectedItem.name} size={31} />
              </View>
              <View style={{ flex: 1 }}>
                <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 20 }}>{selectedItem.name}</BodyLargeText>
                <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.58)', marginTop: 2 }}>{selectedItem.time}</BodySmallText>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: ds.space.sm,
                paddingVertical: 6,
                borderRadius: ds.radius.full,
                backgroundColor: selectedStatus.bg,
                borderColor: selectedStatus.border,
                borderWidth: 1,
              }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: selectedStatus.dot }} />
                <BodySmallText style={{ color: selectedStatus.text, fontSize: 10, fontFamily: Fonts.bold }}>{selectedItem.status}</BodySmallText>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: ds.space.xl, gap: ds.space.lg }}
            >
              <View style={{
                backgroundColor: '#05150E',
                borderRadius: ds.radius.lg,
                overflow: 'hidden',
                padding: ds.space.lg,
                gap: ds.space.md,
              }}>
                <View style={{ position: 'absolute', right: -20, bottom: -28, opacity: 0.12 }}>
                  <SharePartnerIcon name={selectedItem.name} size={128} />
                </View>
                <Label style={{ color: 'rgba(255, 255, 255, 0.58)' }}>Share purpose</Label>
                <BodyLargeText style={{ color: Colors.white, fontFamily: Fonts.bold, fontSize: 20, lineHeight: 25 }}>{selectedItem.purpose}</BodyLargeText>
                <BodySmallText style={{ color: 'rgba(255, 255, 255, 0.62)', lineHeight: 19 }}>{selectedItem.details}</BodySmallText>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    paddingHorizontal: ds.space.sm,
                    paddingVertical: 5,
                    borderRadius: ds.radius.full,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.12)',
                  }}
                >
                  <BodySmallText style={{ color: Colors.white, fontFamily: Fonts.semiBold, fontSize: 11 }}>Verified identity share</BodySmallText>
                </View>
              </View>

              <View style={{ gap: ds.space.sm }}>
                <Label style={{ color: 'rgba(5, 21, 14, 0.58)' }}>Shared data</Label>
                <View style={{
                  backgroundColor: Colors.white,
                  borderRadius: ds.radius.lg,
                  borderColor: '#E5E7EB',
                  borderWidth: 1,
                  overflow: 'hidden',
                }}>
                  {selectedItem.sharedFields.map((field, index) => (
                    <View
                      key={`${field.label}-${index}`}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: ds.space.md,
                        padding: ds.space.md,
                        borderBottomWidth: index === selectedItem.sharedFields.length - 1 ? 0 : 1,
                        borderBottomColor: '#EEF2F6',
                      }}
                    >
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: ds.radius.md,
                        backgroundColor: selectedPartner.bg,
                        borderWidth: 1,
                        borderColor: selectedPartner.border,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <SharedFieldIcon type={field.type} color={selectedPartner.accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 14 }}>{field.label}</BodyLargeText>
                        <BodySmallText selectable style={{ marginTop: 2, color: 'rgba(5, 21, 14, 0.66)' }}>{field.value}</BodySmallText>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={{ paddingTop: ds.space.sm, paddingBottom: Math.max(bottom + ds.space.md, ds.space.xl) }}>
              {selectedItem.status === 'Active' ? (
                <AppButton
                  title="Revoke Access"
                  onPress={handleRevokePress}
                  style={{ backgroundColor: '#9F1239', borderRadius: ds.radius.lg }}
                />
              ) : (
                <AppButton
                  title="Close"
                  onPress={() => setInfoModalVisible(false)}
                  variant="outline"
                  textStyle={{ color: Colors.black, fontFamily: Fonts.medium }}
                  style={{ borderRadius: ds.radius.lg, borderColor: '#E5E7EB' }}
                />
              )}
            </View>
          </View>
        )}
      </BottomSheetModal>

      <BottomSheetModal
        visible={isRevokeModalVisible}
        onClose={() => setRevokeModalVisible(false)}
        heightPercentage={0.42}
      >
        <View style={{ flex: 1, justifyContent: 'space-between', paddingTop: ds.space.lg, paddingBottom: bottom || ds.space.lg }}>
          <Animated.View entering={FadeInUp.duration(240)} style={{ alignItems: 'center', gap: ds.space.md }}>
            <View style={{
              width: 58,
              height: 58,
              borderRadius: ds.radius.full,
              backgroundColor: '#FFF1F2',
              borderWidth: 1,
              borderColor: '#FECDD3',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <Path d="M12 3.8 20 7v5.8c0 4.2-3.1 7.1-8 8.9-4.9-1.8-8-4.7-8-8.9V7l8-3.2Z" stroke="#9F1239" strokeWidth="2" strokeLinejoin="round" />
                <Path d="M9 9.5 15 15.5M15 9.5 9 15.5" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>
            <View style={{ alignItems: 'center', gap: ds.space.sm }}>
              <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 20, textAlign: 'center' }}>Revoke access?</BodyLargeText>
              <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.62)', textAlign: 'center', lineHeight: 20 }}>
                {selectedItem?.name} will no longer be able to access the identity data shared with them.
              </BodySmallText>
            </View>
          </Animated.View>

          <View style={{ gap: ds.space.md }}>
            <AppButton
              title="Yes, Revoke"
              onPress={() => setRevokeModalVisible(false)}
              style={{ backgroundColor: '#9F1239', borderRadius: ds.radius.lg }}
            />
            <AppButton
              title="Cancel"
              onPress={() => setRevokeModalVisible(false)}
              variant="outline"
              textStyle={{ color: Colors.black, fontFamily: Fonts.medium }}
              style={{ borderRadius: ds.radius.lg, borderColor: '#E5E7EB' }}
            />
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
}
