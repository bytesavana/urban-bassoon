import { Pressable, Text, View, type ColorValue } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSchool } from '@school/core';
import { colors } from '../../components/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const icon = (name: IconName) => ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={name} size={size} color={color} />;

export default function TabsLayout() {
  const router = useRouter();
  const role = useSchool((s) => s.roles[s.role]);
  const cycleRole = useSchool((s) => s.cycleRole);
  const inboxCount = useSchool((s) => s.inbox.length);

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.accent, tabBarInactiveTintColor: colors.muted,
      headerStyle: { backgroundColor: colors.surface }, headerShadowVisible: false, headerTitleStyle: { fontWeight: '600', fontSize: 16 },
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      headerLeft: () => (
        <Pressable accessibilityLabel="Search" onPress={() => router.push('/search')} style={{ paddingHorizontal: 16 }}>
          <Ionicons name="search" size={20} color={colors.text} />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable accessibilityLabel="Switch role (demo)" onPress={cycleRole} style={{ paddingHorizontal: 16 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 12 }}>{role.initial}</Text>
          </View>
        </Pressable>
      ),
    }}>
      <Tabs.Screen name="index" options={{ title: 'New task', tabBarIcon: icon('add-circle-outline') }} />
      <Tabs.Screen name="inbox" options={{ title: 'Inbox', tabBarIcon: icon('file-tray-outline'), tabBarBadge: inboxCount > 0 ? inboxCount : undefined, tabBarBadgeStyle: { backgroundColor: colors.danger } }} />
      <Tabs.Screen name="work" options={{ title: 'Work', tabBarIcon: icon('briefcase-outline') }} />
      <Tabs.Screen name="automations" options={{ title: 'Automations', tabBarIcon: icon('flash-outline') }} />
      <Tabs.Screen name="customize" options={{ title: 'Customize', tabBarIcon: icon('settings-outline') }} />
    </Tabs>
  );
}
