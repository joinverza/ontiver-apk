import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AppHeader from '../../components/shared/AppHeader';
import { H2Text, BodyLargeText, BodySmallText } from '../../components/shared/AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { RevokeAccessModal, PaystackLogo, FlutterwaveLogo } from '../../components/shared/RevokeAccessModal';

export default function RevokeSharesScreen() {
    const ds = useDesignSystem();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<{ name: string; id: number } | null>(null);

    const handleRevokeClick = (company: { name: string; id: number }) => {
        setSelectedCompany(company);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: "rgba(248, 250, 252, 1)" }]}>
            <View style={{ paddingHorizontal: ds.space.lg }}>
                <AppHeader title="Revoke Old Shares" />

                {/* Search and Calendar */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: ds.space.lg, gap: ds.space.md }}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={18} color={Colors.secondaryText} style={styles.searchIcon} />
                        <TextInput
                            style={[styles.searchInput, { fontFamily: ds.typography.bodyLarge.fontFamily, fontSize: Math.max(ds.typography.bodySmall.fontSize - 1, 12) }]}
                            placeholder="Search old shares..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={Colors.secondaryText}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close" size={18} color={Colors.black} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity style={styles.calendarButton}>
                        <Feather name="calendar" size={18} color={Colors.black} />
                    </TouchableOpacity>
                </View>

                {/* Info Banner */}
                <View style={styles.infoBanner}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: ds.space.sm }}>
                        <Ionicons name="shield-checkmark-outline" size={24} color="#065F46" />
                        <BodySmallText style={{ flex: 1, marginLeft: ds.space.sm, color: '#065F46', fontWeight: '500' }}>
                            These companies haven't accessed your data recently.
                        </BodySmallText>
                    </View>
                    <BodySmallText style={{ color: '#065F46' }}>
                        Revoking unused shares can improve your Privacy Score and reduce exposure.
                    </BodySmallText>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: ds.space.lg, paddingBottom: ds.space['4xl'] }}>
                
                {/* Item 1: Paystack */}
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={() => setExpandedIndex(expandedIndex === 0 ? null : 0)}
                    style={[styles.card, expandedIndex === 0 && styles.cardExpanded]}
                >
                    <View style={styles.cardHeader}>
                        <PaystackLogo />
                        <View style={{ flex: 1, marginLeft: ds.space.md }}>
                            <BodyLargeText style={{ fontWeight: '600' }}>Paystack</BodyLargeText>
                            {expandedIndex !== 0 ? (
                                <View>
                                    <BodySmallText style={{ color: Colors.secondaryText }}>Loan Verification</BodySmallText>
                                    <BodySmallText style={{ color: Colors.secondaryText }}>Unused for 94 days</BodySmallText>
                                </View>
                            ) : (
                                <BodySmallText style={{ color: Colors.secondaryText }}>Shared Fields:</BodySmallText>
                            )}
                        </View>

                        {expandedIndex === 0 ? (
                            <View style={styles.inactivePill}>
                                <BodySmallText style={{ color: Colors.secondaryText, fontSize: 10 }}>Inactive</BodySmallText>
                            </View>
                        ) : (
                            <TouchableOpacity 
                                style={styles.smallRevokeBtn}
                                onPress={(e) => { e.stopPropagation(); handleRevokeClick({ name: 'Paystack', id: 0 }); }}
                            >
                                <BodySmallText style={{ color: '#DC2626', fontSize: 12 }}>Revoke</BodySmallText>
                            </TouchableOpacity>
                        )}
                    </View>

                    {expandedIndex === 0 && (
                        <View style={{ marginTop: ds.space.xs, marginLeft: 56 }}>
                            <View style={{ marginVertical: ds.space.xs, marginLeft: ds.space.xs }}>
                                <View style={styles.bulletItem}><View style={styles.bullet} /><BodySmallText>Full Named</BodySmallText></View>
                                <View style={styles.bulletItem}><View style={styles.bullet} /><BodySmallText>Date of Birth</BodySmallText></View>
                                <View style={styles.bulletItem}><View style={styles.bullet} /><BodySmallText>NIN</BodySmallText></View>
                            </View>

                            <View style={styles.divider} />
                            
                            <BodySmallText>VP Token:</BodySmallText>
                            <BodySmallText style={{ color: Colors.secondaryText, marginBottom: ds.space.xs }}>0xA91F...KLM9</BodySmallText>
                            <BodySmallText>Last accessed: May 34</BodySmallText>

                            <TouchableOpacity 
                                style={styles.bigRevokeBtn}
                                onPress={() => handleRevokeClick({ name: 'Paystack', id: 0 })}
                            >
                                <BodyLargeText style={{ color: '#DC2626' }}>Revoke</BodyLargeText>
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Item 2: Flutterwave (Faded) */}
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    style={styles.card}
                >
                    <View style={styles.cardHeader}>
                        <FlutterwaveLogo />
                        <View style={{ flex: 1, marginLeft: ds.space.md }}>
                            <BodyLargeText style={{ fontWeight: '600' }}>Flutterwave</BodyLargeText>
                            <BodySmallText style={{ color: Colors.secondaryText }}>Payment</BodySmallText>
                            <BodySmallText style={{ color: Colors.secondaryText }}>Unused for 35 days</BodySmallText>
                        </View>
                        <TouchableOpacity 
                            style={[styles.smallRevokeBtn, { backgroundColor: '#FEE2E2', opacity: 0.5 }]}
                            onPress={() => handleRevokeClick({ name: 'Flutterwave', id: 1 })}
                        >
                            <BodySmallText style={{ color: '#DC2626', fontSize: 12 }}>Revoke</BodySmallText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                {/* Item 3: Paystack */}
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    style={styles.card}
                >
                    <View style={styles.cardHeader}>
                        <PaystackLogo />
                        <View style={{ flex: 1, marginLeft: ds.space.md }}>
                            <BodyLargeText style={{ fontWeight: '600' }}>Paystack</BodyLargeText>
                            <BodySmallText style={{ color: Colors.secondaryText }}>Name, DOB, NIN</BodySmallText>
                            <BodySmallText style={{ color: Colors.secondaryText }}>Last accessed: May 5</BodySmallText>
                        </View>
                        <TouchableOpacity 
                            style={styles.smallRevokeBtn}
                            onPress={() => handleRevokeClick({ name: 'Paystack', id: 2 })}
                        >
                            <BodySmallText style={{ color: '#DC2626', fontSize: 12 }}>Revoke</BodySmallText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                
                {/* Item 4: Flutterwave (Faded) */}
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    style={styles.card}
                >
                    <View style={styles.cardHeader}>
                        <FlutterwaveLogo />
                        <View style={{ flex: 1, marginLeft: ds.space.md }}>
                            <BodyLargeText style={{ fontWeight: '600' }}>Flutterwave</BodyLargeText>
                            <BodySmallText style={{ color: Colors.secondaryText }}>Name, Phone Number</BodySmallText>
                            <BodySmallText style={{ color: Colors.secondaryText }}>May 4, 2026</BodySmallText>
                        </View>
                        <TouchableOpacity 
                            style={[styles.smallRevokeBtn, { backgroundColor: '#FEE2E2', opacity: 0.5 }]}
                            onPress={() => handleRevokeClick({ name: 'Flutterwave', id: 3 })}
                        >
                            <BodySmallText style={{ color: '#DC2626', fontSize: 12 }}>Revoke</BodySmallText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

            </ScrollView>

            <RevokeAccessModal 
                visible={isModalVisible} 
                company={selectedCompany} 
                onClose={handleCloseModal} 
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        color: Colors.black,
    },
    calendarButton: {
        width: 44,
        height: 44,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoBanner: {
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#D1FAE5',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cardExpanded: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    smallRevokeBtn: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    bigRevokeBtn: {
        backgroundColor: '#FEE2E2',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    inactivePill: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    bullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.black,
        marginRight: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    }
});
