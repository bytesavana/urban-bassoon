import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSchool, type Canvas } from '@school/core';
import { colors, deltaColor, fmtDelta, t } from './theme';

type Of<K extends Canvas['type']> = Extract<Canvas, { type: K }>;

const Head = ({ title, sub }: { title: string; sub: string }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={{ fontSize: 19, fontWeight: '600', color: colors.text }}>{title}</Text>
    <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>{sub}</Text>
  </View>
);
const Box = ({ children }: { children: React.ReactNode }) => (
  <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, overflow: 'hidden', backgroundColor: colors.surface }}>{children}</View>
);
const Sep = ({ last }: { last: boolean }) => (last ? null : <View style={{ height: 1, backgroundColor: colors.divider }} />);
const Primary = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable onPress={onPress} style={[t.btn, { marginTop: 16, alignSelf: 'flex-start' }]}><Text style={t.btnText}>{label}</Text></Pressable>
);

export function CanvasContent({ canvas }: { canvas: Canvas }) {
  switch (canvas.type) {
    case 'attendance': return <Attendance c={canvas} />;
    case 'results': return <Results c={canvas} />;
    case 'finance': return <Finance c={canvas} />;
    case 'student': return <Student c={canvas} />;
    case 'document': return <Document c={canvas} />;
    case 'timetable': return <Timetable c={canvas} />;
  }
}

function Attendance({ c }: { c: Of<'attendance'> }) {
  const toggle = useSchool((s) => s.toggleAttendance);
  const setSaved = useSchool((s) => s.setAttendanceSaved);
  const absent = c.absentIds.length;
  return (
    <View>
      <Head title={c.className} sub={`Today's attendance · ${c.date}`} />
      <View style={[t.row, { gap: 10, marginBottom: 16 }]}>
        <View style={{ flex: 1, backgroundColor: colors.successSoft, borderRadius: 10, padding: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.success }}>{c.roster.length - absent}</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.successText }}>Present</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: colors.dangerSoft, borderRadius: 10, padding: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.danger }}>{absent}</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.dangerText }}>Absent</Text>
        </View>
      </View>
      <Box>
        {c.roster.map((stu, i) => {
          const isAbsent = c.absentIds.includes(stu.id);
          return (
            <View key={stu.id}>
              <Pressable disabled={c.saved} onPress={() => toggle(stu.id)} style={[t.row, { justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 }]}>
                <Text style={{ fontSize: 13.5, color: colors.text }}>{stu.name}</Text>
                <Text style={[t.pill, { fontSize: 12, paddingVertical: 3, paddingHorizontal: 9, backgroundColor: isAbsent ? colors.dangerSoft : colors.successSoft, color: isAbsent ? colors.danger : colors.success }]}>{isAbsent ? 'Absent' : 'Present'}</Text>
              </Pressable>
              <Sep last={i === c.roster.length - 1} />
            </View>
          );
        })}
      </Box>
      <View style={[t.row, { marginTop: 16, justifyContent: 'space-between' }]}>
        {c.saved ? (
          <>
            <View style={[t.row, { gap: 6 }]}><Ionicons name="checkmark" size={14} color={colors.success} /><Text style={{ color: colors.success, fontWeight: '600', fontSize: 13 }}>Attendance saved</Text></View>
            <Pressable style={t.btnGhost} onPress={() => setSaved(false)}><Text style={t.btnGhostText}>Make changes</Text></Pressable>
          </>
        ) : (
          <Pressable style={t.btn} onPress={() => setSaved(true)}><Text style={t.btnText}>Save attendance</Text></Pressable>
        )}
      </View>
    </View>
  );
}

function Results({ c }: { c: Of<'results'> }) {
  return (
    <View>
      <Head title={c.title} sub={c.subtitle} />
      <View style={{ gap: 10, marginBottom: 18 }}>
        {c.bars.map((b) => (
          <View key={b.label}>
            <View style={[t.row, { justifyContent: 'space-between', marginBottom: 4 }]}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{b.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: deltaColor(b.delta) }}>{fmtDelta(b.delta, ' pts')}</Text>
            </View>
            <View style={{ height: 10, borderRadius: 6, backgroundColor: colors.divider, overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${b.pct}%`, borderRadius: 6, backgroundColor: deltaColor(b.delta) }} />
            </View>
          </View>
        ))}
      </View>
      <Text style={[t.label, { marginBottom: 8 }]}>Students to watch</Text>
      <Box>
        {c.students.map((s, i) => (
          <View key={s.name}>
            <View style={[t.row, { justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10 }]}>
              <View><Text style={{ fontSize: 13.5, fontWeight: '500', color: colors.text }}>{s.name}</Text><Text style={t.subtle}>{s.classLabel}</Text></View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 13.5, fontWeight: '600', color: colors.text }}>{s.score}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: deltaColor(s.delta) }}>{fmtDelta(s.delta)}</Text>
              </View>
            </View>
            <Sep last={i === c.students.length - 1} />
          </View>
        ))}
      </Box>
    </View>
  );
}

function Finance({ c }: { c: Of<'finance'> }) {
  return (
    <View>
      <Head title={c.title} sub={c.subtitle} />
      <Box>
        {c.rows.map((r, i) => (
          <View key={r.primary}>
            <View style={[t.row, { justifyContent: 'space-between', gap: 10, paddingHorizontal: 14, paddingVertical: 12 }]}>
              <View style={{ flex: 1 }}><Text style={{ fontSize: 13.5, fontWeight: '500', color: colors.text }}>{r.primary}</Text><Text style={t.subtle}>{r.secondary}</Text></View>
              <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.text }}>{r.amount}</Text>
            </View>
            <Sep last={i === c.rows.length - 1} />
          </View>
        ))}
      </Box>
    </View>
  );
}

function Student({ c }: { c: Of<'student'> }) {
  const send = useSchool((s) => s.sendReply);
  const [draft, setDraft] = useState('');
  const ask = () => { const text = draft.trim(); if (text) { setDraft(''); void send(text, { focusStudent: c.name }); } };
  return (
    <View>
      <Head title={c.name} sub={`${c.classLabel} · ${c.studentId}`} />
      <View style={{ gap: 12 }}>
        {c.sections.map((s) => (
          <View key={s.label} style={[t.card, { borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14 }]}>
            <Text style={[t.label, { marginBottom: 5 }]}>{s.label}</Text>
            <Text style={{ fontSize: 13.5, color: colors.text }}>{s.value}</Text>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border }}>
        <Text style={{ fontSize: 12.5, fontWeight: '600', color: colors.muted, marginBottom: 8 }}>Ask about {c.firstName}</Text>
        <View style={[t.row, { gap: 8 }]}>
          <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={ask} placeholder="e.g. Has his performance changed recently?" placeholderTextColor="#A6A19A" style={[t.input, { flex: 1, fontSize: 13, paddingVertical: 8 }]} />
          <Pressable style={[t.btn, { paddingVertical: 9 }]} onPress={ask}><Text style={t.btnText}>Ask</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

function Document({ c }: { c: Of<'document'> }) {
  const toast = useSchool((s) => s.showToast);
  return (
    <View>
      <Head title={c.title} sub={c.subtitle} />
      <View style={{ gap: 10 }}>
        {c.sections.map((s) => (
          <View key={s.heading} style={[t.card, { borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14 }]}>
            <Text style={{ fontSize: 13.5, fontWeight: '600', marginBottom: 4, color: colors.text }}>{s.heading}</Text>
            <Text style={{ fontSize: 13, color: colors.text2 }}>{s.preview}</Text>
          </View>
        ))}
      </View>
      <Primary label="Export as PDF" onPress={() => toast('Export started')} />
    </View>
  );
}

function Timetable({ c }: { c: Of<'timetable'> }) {
  const toast = useSchool((s) => s.showToast);
  const cell = (child: string, head = false, key?: string) => (
    <View key={key} style={{ flex: 1, backgroundColor: head ? colors.bg : colors.surface, paddingVertical: 8, paddingHorizontal: 2, alignItems: 'center', borderLeftWidth: 1, borderLeftColor: colors.border }}>
      <Text numberOfLines={1} style={{ fontSize: 11.5, fontWeight: head ? '700' : '400', color: head ? colors.muted : colors.text }}>{child}</Text>
    </View>
  );
  return (
    <View>
      <Head title={c.title} sub={c.subtitle} />
      <Box>
        <View style={{ flexDirection: 'row' }}>{[cell('', true, 'corner'), ...c.days.map((d) => cell(d, true, d))]}</View>
        {c.rows.map((r) => (
          <View key={r.period} style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border }}>
            {cell(r.period, true, 'p')}
            {r.cells.map((x, i) => cell(x, false, `${r.period}${i}`))}
          </View>
        ))}
      </Box>
      <Primary label="Publish timetable" onPress={() => toast('Timetable published')} />
    </View>
  );
}
