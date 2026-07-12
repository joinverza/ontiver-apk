import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AppHeader from '../../components/shared/AppHeader';
import { H2Text, BodyLargeText, BodySmallText } from '../../components/shared/AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';
import { RevokeAccessModal, PaystackLogo, FlutterwaveLogo } from '../../components/shared/RevokeAccessModal';
import { ASSETS } from '../../utils/assets';

export default function WhoHasYourDataScreen() {
    const ds = useDesignSystem();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    
    // Using simple state to manage expanding/collapsing items (e.g. index 0 is expanded initially)
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

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
                <AppHeader title="Who Has Your Data" />

                {/* Search Bar */}
                <View style={[styles.searchContainer, { marginTop: ds.space.lg }]}>
                    <Ionicons name="search" size={18} color={Colors.secondaryText} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { fontFamily: ds.typography.bodyLarge.fontFamily, fontSize: Math.max(ds.typography.bodySmall.fontSize - 1, 12) }]}
                        placeholder="Search companies..."
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

                {/* Filter Pills */}
                <View style={{ flexDirection: 'row', marginTop: ds.space.md, gap: ds.space.sm }}>
                    {['All', 'Active', 'Revoked'].map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setActiveFilter(filter)}
                            style={[
                                styles.filterPill,
                                activeFilter === filter && styles.filterPillActive
                            ]}
                        >
                            <BodySmallText style={[
                                { color: activeFilter === filter ? Colors.black : Colors.secondaryText }
                            ]}>
                                {filter}
                            </BodySmallText>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: ds.space.lg, paddingBottom: ds.space['4xl'] }}>
                
                {/* Item 1: Paystack (Expanded by default) */}
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={() => setExpandedIndex(expandedIndex === 0 ? null : 0)}
                    style={[styles.card, expandedIndex === 0 && styles.cardExpanded]}
                >
                    <View style={styles.cardHeader}>
                        <PaystackLogo />
                        <View style={{ flex: 1, marginLeft: ds.space.md }}>
                            <BodyLargeText style={{ fontWeight: '600' }}>Paystack</BodyLargeText>
                            {expandedIndex !== 0 && (
                                <View>
                                    <BodySmallText style={{ color: Colors.secondaryText }}>Name, DOB, NIN</BodySmallText>
                                    <BodySmallText style={{ color: Colors.secondaryText }}>Last accessed: May 5</BodySmallText>
                                </View>
                            )}
                        </View>

                        {expandedIndex === 0 ? (
                            <View style={styles.activePill}>
                                <View style={styles.greenDot} />
                                <BodySmallText style={{ color: '#059669', fontSize: 10, marginLeft: 4 }}>Active</BodySmallText>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.sm }}>
                                <View style={styles.greenDot} />
                                <TouchableOpacity 
                                    style={styles.smallRevokeBtn}
                                    onPress={(e) => { e.stopPropagation(); handleRevokeClick({ name: 'Paystack', id: 0 }); }}
                                >
                                    <BodySmallText style={{ color: '#DC2626', fontSize: 12 }}>Revoke</BodySmallText>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {expandedIndex === 0 && (
                        <View style={{ marginTop: ds.space.md, marginLeft: 56 }}>
                            <BodySmallText>Shared Fields:</BodySmallText>
                            <View style={{ marginVertical: ds.space.xs, marginLeft: ds.space.xs }}>
                                <View style={styles.bulletItem}><View style={styles.bullet} /><BodySmallText>Full Named</BodySmallText></View>
                                <View style={styles.bulletItem}><View style={styles.bullet} /><BodySmallText>Date of Birth</BodySmallText></View>
                                <View style={styles.bulletItem}><View style={styles.bullet} /><BodySmallText>NIN</BodySmallText></View>
                            </View>

                            <View style={styles.divider} />
                            
                            <BodySmallText>VP Token:</BodySmallText>
                            <BodySmallText style={{ color: Colors.secondaryText, marginBottom: ds.space.xs }}>0xA91F...KLM9</BodySmallText>
                            <BodySmallText>Last accessed: May 5</BodySmallText>

                            <TouchableOpacity 
                                style={styles.bigRevokeBtn}
                                onPress={() => handleRevokeClick({ name: 'Paystack', id: 0 })}
                            >
                                <BodyLargeText style={{ color: '#DC2626' }}>Revoke</BodyLargeText>
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Item 2: Flutterwave */}
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={() => setExpandedIndex(expandedIndex === 1 ? null : 1)}
                    style={[styles.card, expandedIndex === 1 && styles.cardExpanded]}
                >
                    <View style={styles.cardHeader}>
                        <FlutterwaveLogo />
                        <View style={{ flex: 1, marginLeft: ds.space.md }}>
                            <BodyLargeText style={{ fontWeight: '600' }}>Flutterwave</BodyLargeText>
                            {expandedIndex !== 1 && (
                                <View>
                                    <BodySmallText style={{ color: Colors.secondaryText }}>Name, Phone Number</BodySmallText>
                                    <BodySmallText style={{ color: Colors.secondaryText }}>May 4, 2026</BodySmallText>
                                </View>
                            )}
                        </View>

                        {expandedIndex === 1 ? (
                            <View style={[styles.activePill, { borderColor: '#FECACA' }]}>
                                <View style={styles.redDot} />
                                <BodySmallText style={{ color: '#DC2626', fontSize: 10, marginLeft: 4 }}>Revoked</BodySmallText>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.sm }}>
                                <View style={styles.redDot} />
                                <TouchableOpacity 
                                    style={[styles.smallRevokeBtn, { backgroundColor: '#FEE2E2', opacity: 0.5 }]}
                                    disabled
                                >
                                    <BodySmallText style={{ color: '#DC2626', fontSize: 12 }}>Revoke</BodySmallText>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {expandedIndex === 1 && (
                        <View style={{ marginTop: ds.space.md, marginLeft: 56 }}>
                            <BodySmallText>Shared Fields:</BodySmallText>
                            <View style={{ marginVertical: ds.space.xs, marginLeft: ds.space.xs }}>
                                <View style={styles.bulletItem}><View style={styles.bullet} /><BodySmallText>Name</BodySmallText></View>
                                <View style={styles.bulletItem}><View style={styles.bullet} /><BodySmallText>Phone Number</BodySmallText></View>
                            </View>

                            <View style={styles.divider} />
                            
                            <BodySmallText>VP Token:</BodySmallText>
                            <BodySmallText style={{ color: Colors.secondaryText, marginBottom: ds.space.xs }}>0xABCD...1234</BodySmallText>
                            <BodySmallText>May 4, 2026</BodySmallText>

                            <TouchableOpacity 
                                style={[styles.bigRevokeBtn, { backgroundColor: '#FEE2E2', opacity: 0.5 }]}
                                disabled
                            >
                                <BodyLargeText style={{ color: '#DC2626' }}>Revoke</BodyLargeText>
                            </TouchableOpacity>
                        </View>
                    )}
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
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterPillActive: {
        backgroundColor: '#E5E7EB',
        borderColor: '#E5E7EB',
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
    greenDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#059669',
    },
    redDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#DC2626',
    },
    activePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1FAE5',
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
