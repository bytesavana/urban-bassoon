import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { isCustomizeEnabled, useSchool, type CustomizeItem, type CustomizeTab } from '@school/core';
import { Pill } from '../../components/Pill';
import { colors, t } from '../../components/theme';

const TABS: [CustomizeTab, string][] = [['agents', 'Agents'], ['skills', 'Skills'], ['plugins', 'Plugins'], ['connectors', 'Connectors']];
const STATUS: Record<string, string> = { connected: 'Connected', 'not connected': 'Not connected', installed: 'Installed', 'not installed': 'Not installed' };
const label = (ci: CustomizeItem, on: boolean) => (ci.status ? STATUS[ci.status]! : on ? 'Enabled' : 'Disabled');
const positive = (ci: CustomizeItem, on: boolean) => ci.status === 'connected' || ci.status === 'installed' || (!ci.status && on);

export default function Customize() {
  const tab = useSchool((s) => s.customizeTab);
  const setTab = useSchool((s) => s.setCustomizeTab);
  const items = useSchool((s) => s.customize[s.customizeTab]);
  const overrides = useSchool((s) => s.customizeOverrides);
  const selectedId = useSchool((s) => s.customizeSelectedId);
  const select = useSchool((s) => s.selectCustomize);
  const toggle = useSchool((s) => s.toggleCustomize);

  return (
    <ScrollView style={t.screen} contentContainerStyle={t.scroll}>
      <Text style={t.sub}>Configure the AI platform behind your school</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 6 }}>
        {TABS.map(([key, name]) => (
          <Pressable key={key} onPress={() => setTab(key)} style={{ paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 2, borderBottomColor: tab === key ? colors.accent : 'transparent' }}>
            <Text style={{ fontSize: 13.5, fontWeight: '600', color: tab === key ? colors.accent : colors.muted }}>{name}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {items.map((ci) => {
        const on = isCustomizeEnabled(ci, overrides);
        const open = selectedId === ci.id;
        return (
          <Pressable key={ci.id} onPress={() => select(open ? null : ci.id)} style={[t.card, { borderColor: open ? colors.accent : colors.border }]}>
            <View style={[t.row, { justifyContent: 'space-between', gap: 8 }]}>
              <Text style={[t.cardTitle, { flex: 1 }]}>{ci.name}</Text>
              <Pill label={label(ci, on)} positive={positive(ci, on)} />
            </View>
            <Text style={[t.muted, { marginTop: 6 }]}>{ci.description}</Text>
            <Text style={[t.subtle, { marginTop: 10, fontSize: 11.5 }]}>{ci.footer}</Text>
            {open && (
              <View style={{ marginTop: 12 }}>
                <Text style={[t.label, { marginBottom: 6 }]}>{ci.listLabel}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {ci.list.map((li) => <Text key={li} style={{ backgroundColor: colors.hover, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, fontSize: 12.5, overflow: 'hidden' }}>{li}</Text>)}
                </View>
                <View style={[t.row, { justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider }]}>
                  <Text style={{ fontSize: 13, fontWeight: '600' }}>
                    {ci.status === 'connected' || ci.status === 'not connected' ? (ci.status === 'connected' ? 'Connected' : 'Connect') : on ? 'Enabled' : 'Disabled'}
                  </Text>
                  <Switch value={on} onValueChange={() => toggle(ci)} trackColor={{ true: colors.accent, false: colors.toggleOff }} />
                </View>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
