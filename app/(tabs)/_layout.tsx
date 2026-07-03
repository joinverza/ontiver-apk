import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { ASSETS } from '../../utils/assets';
import { useDesignSystem } from '../../utils/design-system';

const TabBarIcon = ({
  focused,
  ActiveIcon,
  InactiveIcon,
  size
}: {
  focused: boolean;
  ActiveIcon: any;
  InactiveIcon: any;
  size: number;
}) => {
  const Icon = focused ? ActiveIcon : InactiveIcon;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', position: 'relative' }}>
      {focused && (
        <View
          style={{
            position: 'absolute',
            top: -5,
            width: 30,
            height: 4,
            backgroundColor: '#0F1A24',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
        />
      )}
      <View style={{ marginTop: 8 }}>
        <Icon width={size} height={size} />
      </View>
    </View>
  );
};

export default function TabLayout() {
  const ds = useDesignSystem();
  const { bottom: bottomInset } = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondaryText,
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: ds.space['7xl'] + bottomInset,
          paddingBottom: ds.space.sm,
        },
        tabBarBackground: () => (
          <BlurView intensity={1900} tint="light" style={StyleSheet.absoluteFill} />
        ),
        tabBarLabelStyle: {
          fontFamily: ds.typography.micro.fontFamily,
          fontSize: ds.typography.micro.fontSize,
          marginTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} ActiveIcon={ASSETS.TABS.HOME_ACTIVE} InactiveIcon={ASSETS.TABS.HOME_INACTIVE} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="vault"
        options={{
          title: 'Vault',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} ActiveIcon={ASSETS.TABS.VAULT_ACTIVE} InactiveIcon={ASSETS.TABS.VAULT_INACTIVE} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: 'Share',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} ActiveIcon={ASSETS.TABS.SHARE_INACTIVE} InactiveIcon={ASSETS.TABS.SHARE_INACTIVE} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="privacy"
        options={{
          title: 'Privacy',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} ActiveIcon={ASSETS.TABS.PRIVACY_ACTIVE} InactiveIcon={ASSETS.TABS.PRIVACY_INACTIVE} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} ActiveIcon={ASSETS.TABS.SETTINGS_ACTIVE} InactiveIcon={ASSETS.TABS.SETTINGS_INACTIVE} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
