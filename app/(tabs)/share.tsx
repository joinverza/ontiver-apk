import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, FlatList, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '../../components/shared/AppButton';
import { BodyLargeText, BodySmallText, H2Text } from '../../components/shared/AppTexts';
import { BottomSheetModal } from '../../components/shared/BottomSheetModal';
import { FilterTabs } from '../../components/shared/FilterTabs';
import { SharingHistoryCard } from '../../components/shared/SharingHistoryCard';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { useDesignSystem } from '../../utils/design-system';

const { height } = Dimensions.get('window');

export default function ShareScreen() {
    const ds = useDesignSystem();
    const [activeTab, setActiveTab] = useState('All');
    const { top } = useSafeAreaInsets()

    // Modal states
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isInfoModalVisible, setInfoModalVisible] = useState(false);
    const [isRevokeModalVisible, setRevokeModalVisible] = useState(false);

    const historyTabs = ['All', 'Active', 'Revoked', 'Denied'];

    const historyData = [
        { id: '1', name: 'Paystack', details: 'Name, Email, Age', time: '2 hours ago', status: 'Active' },
        { id: '2', name: 'Flutterwave', details: 'Name, Phone Number', time: 'May 4, 2026', status: 'Active' },
        { id: '3', name: 'Paystack', details: 'Name, Email, Age', time: '2 hours ago', status: 'Active' },
        { id: '4', name: 'Kuda Bank', details: 'Name, Date of Birth, Address', time: 'April 28, 2026', status: 'Revoked' },
        { id: '5', name: 'Binance', details: 'Shared KYC Verified', time: '3 days ago', status: 'Active' },
        { id: '6', name: 'Opay', details: 'Full Name, ID Number', time: '3 days ago', status: 'Denied' },
    ];

    const filteredData = activeTab === 'All'
        ? historyData
        : historyData.filter(item => item.status === activeTab);

    const handleItemPress = (item: any) => {
        setSelectedItem(item);
        setInfoModalVisible(true);
    };

    const handleRevokePress = () => {
        setInfoModalVisible(false);
        setTimeout(() => setRevokeModalVisible(true), 300);
    };

    const getStatusStyles = (status: string) => {
        if (status === 'Active') return { bg: 'rgba(208, 255, 221, 1)', text: 'rgba(0, 125, 33, 1)', border: 'rgba(0, 125, 33, 0.4)' };
        if (status === 'Revoked') return { bg: '#E5E7EB', text: '#4B5563', border: '#D1D5DB' };
        if (status === 'Denied') return { bg: 'rgba(255, 208, 209, 1)', text: 'rgba(125, 0, 2, 1)', border: 'rgba(125, 0, 2, 0.4)' };
        return { bg: Colors.white, text: Colors.mainText, border: Colors.mainText };
    };

    return (
        <View style={{ flex: 1, backgroundColor: "rgba(248, 250, 252, 1)", paddingHorizontal: ds.space.lg, paddingTop: top }}>
            <View style={{ marginTop: ds.space.md, marginBottom: ds.space.lg, alignItems: 'center' }}>
                <H2Text>Sharing History</H2Text>
            </View>

            <View style={{ flex: 1 }}>
                {/* Search Bar */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.white,
                    borderRadius: ds.radius.md,
                    paddingHorizontal: ds.space.md,
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    marginBottom: ds.space.lg
                }}>
                    <Feather name="search" size={20} color="rgba(0, 0, 0, 0.4)" />
                    <TextInput
                        placeholder='Search History'
                        placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
                        style={{
                            flex: 1,
                            fontFamily: Fonts.regular,
                            fontSize: ds.typography.bodySmall.fontSize,
                            color: Colors.black,
                            paddingVertical: ds.space.md,
                            paddingHorizontal: ds.space.sm,
                        }}
                    />
                    <Feather name="x" size={20} color="rgba(0, 0, 0, 0.4)" />
                </View>

                <FilterTabs
                    tabs={historyTabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <SharingHistoryCard
                            name={item.name}
                            details={item.details}
                            time={item.time}
                            status={item.status}
                            onPress={() => handleItemPress(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: ds.space.md }} />}
                    contentContainerStyle={{ paddingBottom: ds.space.xl }}
                />
            </View>

            {/* Shared Information Modal */}
            <BottomSheetModal
                visible={isInfoModalVisible}
                onClose={() => setInfoModalVisible(false)}
            >
                {selectedItem && (
                    <>
                        <View style={{ alignItems: 'center', marginTop: ds.space.md, marginBottom: ds.space.xl }}>
                            <View style={{
                                paddingHorizontal: ds.space.md,
                                paddingVertical: 4,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: getStatusStyles(selectedItem.status).border,
                                marginBottom: ds.space.md
                            }}>
                                <BodySmallText style={{ color: getStatusStyles(selectedItem.status).text, fontSize: 10 }}>{selectedItem.status}</BodySmallText>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.sm }}>
                                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
                                    <BodyLargeText style={{ fontFamily: Fonts.bold, fontSize: 16 }}>{selectedItem.name.charAt(0)}</BodyLargeText>
                                </View>
                                <H2Text>{selectedItem.name}</H2Text>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <BodySmallText style={{ color: 'rgba(5, 21, 14, 0.8)', marginBottom: ds.space.sm }}>Shared Information</BodySmallText>

                            <View style={{
                                backgroundColor: Colors.white,
                                borderRadius: ds.radius.md,
                                padding: ds.space.lg,
                                borderColor: '#E5E7EB',
                                borderWidth: 1
                            }}>
                                {/* Mock Data based on screenshot */}
                                <View style={{ marginBottom: ds.space.md }}>
                                    <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 14 }}>Full Name</BodyLargeText>
                                    <BodySmallText style={{ marginTop: 2, color: 'rgba(5, 21, 14, 0.8)' }}>Lawrence Gracious Paul</BodySmallText>
                                    <View style={{ height: 1, backgroundColor: '#F3F4F6', marginTop: ds.space.sm }} />
                                </View>
                                <View style={{ marginBottom: ds.space.md }}>
                                    <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 14 }}>Gender</BodyLargeText>
                                    <BodySmallText style={{ marginTop: 2, color: 'rgba(5, 21, 14, 0.8)' }}>Male</BodySmallText>
                                    <View style={{ height: 1, backgroundColor: '#F3F4F6', marginTop: ds.space.sm }} />
                                </View>
                                <View style={{ marginBottom: ds.space.md }}>
                                    <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 14 }}>Email</BodyLargeText>
                                    <BodySmallText style={{ marginTop: 2, color: 'rgba(5, 21, 14, 0.8)' }}>adaeze.okafor@gmail.com</BodySmallText>
                                    <View style={{ height: 1, backgroundColor: '#F3F4F6', marginTop: ds.space.sm }} />
                                </View>
                                <View>
                                    <BodyLargeText style={{ fontFamily: Fonts.semiBold, fontSize: 14 }}>Age Verification</BodyLargeText>
                                    <BodySmallText style={{ marginTop: 2, color: 'rgba(5, 21, 14, 0.8)' }}>18+</BodySmallText>
                                </View>
                            </View>
                        </ScrollView>

                        <View style={{ paddingVertical: ds.space.lg }}>
                            <AppButton
                                title="Revoke"
                                onPress={handleRevokePress}
                                style={{ backgroundColor: '#990000' }}
                            />
                        </View>
                    </>
                )}
            </BottomSheetModal>

            {/* Revoke Confirmation Modal */}
            <BottomSheetModal
                visible={isRevokeModalVisible}
                onClose={() => setRevokeModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: ds.space.xl }}>
                    <H2Text style={{ textAlign: 'center', marginBottom: ds.space['2xl'] }}>
                        {selectedItem?.name} will no longer be able to access your shared identity data.
                    </H2Text>

                    <View style={{ width: '100%', gap: ds.space.md }}>
                        <AppButton
                            title="Revoke"
                            onPress={() => setRevokeModalVisible(false)}
                            style={{ backgroundColor: '#990000' }}
                        />
                        <AppButton
                            title="Cancel"
                            onPress={() => setRevokeModalVisible(false)}
                            variant="outline"
                            textStyle={{ color: Colors.black }}
                        />
                    </View>
                </View>
            </BottomSheetModal>

        </View>
    );
}
