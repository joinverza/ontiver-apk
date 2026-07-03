import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppHeader from '../../components/shared/AppHeader';
import { BodyLargeText, BodySmallText, H2Text, Label } from '../../components/shared/AppTexts';
import Colors from '../../constants/Colors';
import { useDesignSystem } from '../../utils/design-system';

const lineData = [
    { value: 18, label: 'Mon' },
    { value: 18, label: '' },
    { value: 0, label: 'Tue' },
    { value: 0, label: '' },
    { value: 45, label: 'Wed' },
    { value: 45, label: '' },
    { value: 88, label: 'Thu' },
    { value: 88, label: '' },
    { value: 45, label: 'Fri' },
    { value: 45, label: '' },
    { value: 10, label: 'Sat' },
    { value: 10, label: '' },
    { value: 45, label: 'Sun' },
    { value: 45, label: '' },
];

export default function PrivacyDashboard() {
    const ds = useDesignSystem();
    const router = useRouter();
    const { top, bottom } = useSafeAreaInsets()

    return (
        <View style={[styles.container, { backgroundColor: "rgba(248, 250, 252, 1)", paddingTop: top }]}>
            <View style={{ paddingHorizontal: ds.space.lg }}>
                <AppHeader title="Privacy" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 + bottom, paddingHorizontal: ds.space.lg }}>
                <Animated.View entering={FadeInDown.duration(500)}>
                {/* Hero Card */}
                <View style={[styles.heroCard, { borderRadius: ds.radius.xl, marginTop: ds.space.xl }]}>
                    {/* The dark bump behind the chart */}
                    <View style={{
                        position: 'absolute',
                        right: -10,
                        top: '50%',
                        marginTop: -85,
                        width: 170,
                        height: 170,
                        borderRadius: 85,
                        backgroundColor: '#0A121A'
                    }} />

                    <View style={{ flex: 1, padding: ds.space.lg, zIndex: 10 }}>
                        <BodyLargeText style={{ color: Colors.white, marginBottom: 8 }}>Your Privacy Score</BodyLargeText>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ds.space.md }}>
                            <Feather name="trending-up" size={14} color="#84CC16" />
                            <BodySmallText style={{ color: '#84CC16', marginLeft: 4 }}>+5 possible today</BodySmallText>
                        </View>
                        <View style={{ gap: 2 }}>
                            <BodySmallText style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}>0–39: Critical</BodySmallText>
                            <BodySmallText style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}>40–59: Vulnerable</BodySmallText>
                            <BodySmallText style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}>60–74: Fair</BodySmallText>
                            <BodySmallText style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}>75–89: Strong</BodySmallText>
                            <BodySmallText style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}>90 - 100: Excellent</BodySmallText>
                        </View>
                    </View>

                    <View style={{ paddingRight: ds.space.lg, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                        <View style={{ position: 'relative', width: 120, height: 120, justifyContent: 'center', alignItems: 'center' }}>
                            <Svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', transform: [{ rotate: '-225deg' }] }}>
                                {/* Background Circle Track */}
                                <Circle
                                    cx="60"
                                    cy="60"
                                    r="45"
                                    stroke="rgba(255,255,255,0.1)"
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
                                <BodySmallText style={{ color: Colors.white, fontSize: 10 }}>Strong</BodySmallText>
                                <H2Text style={{ color: Colors.white, fontSize: 24, marginTop: -4 }}>86%</H2Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Weekly Score Trend */}
                <Label style={{ marginTop: ds.space.xl, marginBottom: ds.space.md }}>Weekly Score Trend</Label>
                <View style={{
                    backgroundColor: Colors.white,
                    borderRadius: ds.radius.lg,
                    paddingTop: ds.space.xl,
                    paddingBottom: ds.space.lg,
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    overflow: 'hidden'
                }}>
                    <LineChart
                        data={lineData}
                        width={ds.width - ds.space.lg * 2 - 20}
                        height={160}
                        thickness={1.5}
                        color="#111827"
                        hideDataPoints
                        yAxisColor="transparent"
                        xAxisColor="transparent"
                        yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: '#6B7280', fontSize: 11, marginLeft: 20 }}
                        stepValue={20}
                        maxValue={100}
                        noOfSections={5}
                        rulesColor="#F3F4F6"
                        yAxisLabelTexts={['00', '20', '40', '60', '80', '100']}
                        hideOrigin
                        initialSpacing={0}
                        endSpacing={0}
                        curved
                        curvature={0.1}
                    />
                </View>

                {/* Action Buttons */}
                <View style={{
                    backgroundColor: Colors.white,
                    borderRadius: ds.radius.lg,
                    padding: ds.space.lg,
                    marginTop: ds.space.lg,
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'flex-start'
                }}>
                    <TouchableOpacity
                        style={{ alignItems: 'center', width: '30%' }}
                        onPress={() => router.push('/(screens)/who-has-data')}
                    >
                        <View style={styles.actionIconWrapper}>
                            <Feather name="map" size={24} color="#111827" />
                        </View>
                        <BodySmallText style={{ textAlign: 'center', color: '#111827' }}>Exposure{'\n'}Map</BodySmallText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ alignItems: 'center', width: '30%' }}
                        onPress={() => router.push('/(screens)/improve-score')}
                    >
                        <View style={styles.actionIconWrapper}>
                            <Feather name="trending-up" size={24} color="#111827" />
                        </View>
                        <BodySmallText style={{ textAlign: 'center', color: '#111827' }}>Improve{'\n'}Score</BodySmallText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ alignItems: 'center', width: '30%' }}
                        onPress={() => router.push('/(screens)/revoke-shares')}
                    >
                        <View style={styles.actionIconWrapper}>
                            <Feather name="git-pull-request" size={24} color="#111827" />
                        </View>
                        <BodySmallText style={{ textAlign: 'center', color: '#111827' }}>Revoke{'\n'}Shares</BodySmallText>
                    </TouchableOpacity>
                </View>

                {/* What Affects Your Score */}
                <Label style={{ marginTop: ds.space.xl, marginBottom: ds.space.md }}>What Affects Your Score:</Label>
                <View style={{
                    backgroundColor: Colors.white,
                    borderRadius: ds.radius.lg,
                    paddingHorizontal: ds.space.lg,
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                }}>
                    <View style={styles.scoreRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
                            <Feather name="share-2" size={20} color="#111827" />
                            <BodyLargeText style={{ color: '#111827' }}>Active Shares</BodyLargeText>
                        </View>
                        <BodyLargeText style={{ color: '#111827' }}>-12 pts</BodyLargeText>
                    </View>

                    <View style={[styles.scoreRow, { borderTopWidth: 1, borderTopColor: '#F3F4F6' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
                            <Feather name="check-square" size={20} color="#111827" />
                            <BodyLargeText style={{ color: '#111827' }}>Credential Completeness</BodyLargeText>
                        </View>
                        <BodyLargeText style={{ color: '#111827' }}>+8 pts</BodyLargeText>
                    </View>

                    <View style={[styles.scoreRow, { borderTopWidth: 1, borderTopColor: '#F3F4F6' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds.space.md }}>
                            <Feather name="alert-circle" size={20} color="#111827" />
                            <BodyLargeText style={{ color: '#111827' }}>Breach History</BodyLargeText>
                        </View>
                        <BodyLargeText style={{ color: '#111827' }}>+10 pts</BodyLargeText>
                    </View>
                </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heroCard: {
        backgroundColor: '#0F1A24',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        overflow: 'hidden',
        minHeight: 160,
    },
    actionIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    }
});
