import { Pressable, ScrollView, Text, View } from 'react-native';
import { effectiveAutomationStatus, useSchool } from '@school/core';
import { Pill } from '../../components/Pill';
import { colors, t } from '../../components/theme';

export default function Automations() {
  const automations = useSchool((s) => s.automations);
  const overrides = useSchool((s) => s.automationOverrides);
  const selectedId = useSchool((s) => s.automationSelectedId);
  const select = useSchool((s) => s.selectAutomation);
  const toggle = useSchool((s) => s.toggleAutomation);
  const toast = useSchool((s) => s.showToast);

  return (
    <ScrollView style={t.screen} contentContainerStyle={t.scroll}>
      <Text style={t.sub}>Workers that run quietly in the background</Text>
      {automations.map((a) => {
        const active = effectiveAutomationStatus(a, overrides) === 'active';
        const open = selectedId === a.id;
        return (
          <Pressable key={a.id} onPress={() => select(open ? null : a.id)} style={[t.card, { borderColor: open ? colors.accent : colors.border }]}>
            <View style={[t.row, { justifyContent: 'space-between', gap: 8 }]}>
              <Text style={[t.cardTitle, { flex: 1 }]}>{a.name}</Text>
              <Pill label={active ? 'Active' : 'Paused'} positive={active} />
            </View>
            <Text style={[t.muted, { marginTop: 6 }]}>{a.purpose}</Text>
            <Text style={[t.subtle, { marginTop: 10, fontSize: 11.5 }]}>{a.trigger}</Text>
            {open && (
              <View style={{ marginTop: 12, gap: 3 }}>
                {a.steps.map((s) => <Text key={s} style={{ fontSize: 12.5, color: colors.text2 }}>— {s}</Text>)}
                <View style={[t.row, { gap: 16, marginTop: 8 }]}>
                  <Text style={t.subtle}>Last run: {a.lastRun}</Text>
                  <Text style={t.subtle}>Next: {a.nextRun}</Text>
                </View>
                <View style={[t.row, { gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider }]}>
                  <Pressable style={t.btnGhost} onPress={() => toast(`${a.name} is running…`)}><Text style={t.btnGhostText}>Run now</Text></Pressable>
                  <Pressable style={t.btnGhost} onPress={() => toast('Opening automation editor…')}><Text style={t.btnGhostText}>Edit</Text></Pressable>
                  <Pressable style={t.btnGhost} onPress={() => toggle(a)}><Text style={t.btnGhostText}>{active ? 'Pause' : 'Resume'}</Text></Pressable>
                </View>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
