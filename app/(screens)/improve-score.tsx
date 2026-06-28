import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

import AppHeader from '../../components/shared/AppHeader';
import { H2Text, BodyLargeText, BodySmallText, Label } from '../../components/shared/AppTexts';
import { Colors } from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';

export default function ImproveScoreScreen() {
    const ds = useDesignSystem();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: "rgba(248, 250, 252, 1)" }]}>
            <View style={{ paddingHorizontal: ds.space.lg }}>
                <AppHeader title="Improve Your Score" />

                <ScrollView contentContainerStyle={{ paddingBottom: ds.space['4xl'] }} showsVerticalScrollIndicator={false}>
                    
                    {/* Score Card */}
                    <View style={styles.scoreCard}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <BodyLargeText style={{ marginBottom: ds.space.xs, color: Colors.secondaryText }}>Your Privacy Score</BodyLargeText>
                            <H2Text style={{ marginBottom: ds.space.xs }}>78 — Good</H2Text>
                            <BodySmallText style={{ color: '#059669', fontSize: 12 }}>+5 possible today</BodySmallText>
                        </View>
                        
                        <View style={{ position: 'relative', width: 90, height: 90, justifyContent: 'center', alignItems: 'center' }}>
                            <Svg width="90" height="90" viewBox="0 0 120 120" style={{ position: 'absolute', transform: [{ rotate: '-225deg' }] }}>
                                {/* Background Circle Track */}
                                <Circle
                                    cx="60"
                                    cy="60"
                                    r="45"
                                    stroke="#F3F4F6"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray="212"
                                    strokeDashoffset="0"
                                    strokeLinecap="round"
                                />
                                {/* Active Circle Progress (86%) */}
                                <Circle
                                    cx="60"
                                    cy="60"
                                    r="45"
                                    stroke="#84CC16"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray="282.74"
                                    strokeDashoffset="75"
                                    strokeLinecap="round"
                                />
                            </Svg>
                            <View style={{ alignItems: 'center' }}>
                                <BodySmallText style={{ color: Colors.secondaryText, fontSize: 10 }}>Good</BodySmallText>
                                <H2Text style={{ fontSize: 20, marginTop: -2 }}>86%</H2Text>
                            </View>
                        </View>
                    </View>

                    {/* Tip List Section */}
                    <Label style={{ marginTop: ds.space.xl, marginBottom: ds.space.md }}>Tip List</Label>
                    
                    <View style={styles.listContainer}>
                        {/* Tip 1 */}
                        <TouchableOpacity style={styles.tipRow}>
                            <View style={styles.iconContainer}>
                                <Feather name="share-2" size={20} color={Colors.black} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <BodyLargeText style={{ fontWeight: '500' }}>Revoke 3 inactive shares</BodyLargeText>
                                <BodySmallText style={{ color: Colors.secondaryText }}>+8pts</BodySmallText>
                            </View>
                            <Feather name="arrow-right" size={20} color="#065F46" />
                        </TouchableOpacity>
                        
                        <View style={styles.divider} />

                        {/* Tip 2 */}
                        <TouchableOpacity style={styles.tipRow}>
                            <View style={styles.iconContainer}>
                                <Feather name="phone-call" size={20} color={Colors.black} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <BodyLargeText style={{ fontWeight: '500' }}>Add your phone number</BodyLargeText>
                                <BodySmallText style={{ color: Colors.secondaryText }}>+5pts</BodySmallText>
                            </View>
                            <Feather name="arrow-right" size={20} color="#065F46" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Tip 3 */}
                        <TouchableOpacity style={styles.tipRow}>
                            <View style={styles.iconContainer}>
                                <Feather name="file-text" size={20} color={Colors.black} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <BodyLargeText style={{ fontWeight: '500' }}>Re-verify your expired ID</BodyLargeText>
                                <BodySmallText style={{ color: Colors.secondaryText }}>+15pts</BodySmallText>
                            </View>
                            <Feather name="arrow-right" size={20} color="#065F46" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Tip 4 (Disabled / Pro) */}
                        <View style={[styles.tipRow, { opacity: 0.6 }]}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="shield-half-outline" size={20} color={Colors.black} />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <BodyLargeText style={{ fontWeight: '500' }}>Enable breach monitoring</BodyLargeText>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                        <BodySmallText style={{ color: Colors.secondaryText }}>+10pts</BodySmallText>
                                        <View style={styles.proBadge}>
                                            <Feather name="lock" size={10} color="#B45309" style={{ marginRight: 2 }} />
                                            <BodySmallText style={{ fontSize: 10, color: '#B45309', fontWeight: '600' }}>Pro</BodySmallText>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <Feather name="arrow-right" size={20} color={Colors.secondaryText} />
                        </View>

                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scoreCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 24,
        marginTop: 16,
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    listContainer: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    proBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    }
});
