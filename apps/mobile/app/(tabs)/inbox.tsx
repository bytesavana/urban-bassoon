import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSchool, type InboxItem } from '@school/core';
import { colors, t } from '../../components/theme';

const DOT: Record<InboxItem['severity'], string> = { warning: colors.warning, danger: colors.danger, info: colors.info };

export default function Inbox() {
  const router = useRouter();
  const items = useSchool((s) => s.inbox);
  const open = useSchool((s) => s.openInboxItem);
  return (
    <ScrollView style={t.screen} contentContainerStyle={t.scroll}>
      <Text style={t.sub}>Things that need your attention</Text>
      {items.map((it) => (
        <Pressable key={it.id} onPress={async () => { await open(it); router.push('/conversation'); }} style={[t.card, { flexDirection: 'row', gap: 14 }]}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: DOT[it.severity], marginTop: 6 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14.5, fontWeight: '600', color: colors.text }}>{it.title}</Text>
            <Text style={[t.muted, { marginTop: 3, fontSize: 13 }]}>{it.detail}</Text>
            <Text style={{ color: colors.accent, fontWeight: '600', fontSize: 12.5, marginTop: 6 }}>{it.recommendation}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}
