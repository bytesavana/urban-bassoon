import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CONTEXT_SAMPLES, greeting, useSchool } from '@school/core';
import { colors, radii, t } from '../../components/theme';

export default function Home() {
  const router = useRouter();
  const role = useSchool((s) => s.roles[s.role]);
  const draft = useSchool((s) => s.homeDraft);
  const setDraft = useSchool((s) => s.setHomeDraft);
  const chips = useSchool((s) => s.contextChips);
  const addContext = useSchool((s) => s.addContext);
  const removeContext = useSchool((s) => s.removeContext);
  const submit = useSchool((s) => s.submitHome);
  const [menuOpen, setMenuOpen] = useState(false);

  const go = () => {
    if (!draft.trim()) return;
    void submit();
    router.push('/conversation');
  };

  return (
    <KeyboardAvoidingView style={t.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 36, gap: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 26, fontWeight: '600', color: colors.text, textAlign: 'center' }}>{greeting(role)}</Text>
          <Text style={{ fontSize: 15, color: colors.muted, marginTop: 6, textAlign: 'center' }}>{role.greetingSub}</Text>
        </View>

        <View style={[t.card, { borderRadius: radii['2xl'], gap: 12 }]}>
          <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={go} returnKeyType="go" multiline
            placeholder="What would you like to do?" placeholderTextColor="#A6A19A" style={{ fontSize: 16, color: colors.text, minHeight: 44 }} />
          {chips.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {chips.map((c, i) => (
                <Pressable key={c + i} onPress={() => removeContext(i)} style={[t.row, { gap: 6, backgroundColor: colors.accentSoft, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }]}>
                  <Text style={{ color: colors.accent, fontSize: 12, fontWeight: '600' }}>{c}</Text>
                  <Text style={{ color: colors.accent, fontSize: 14 }}>×</Text>
                </Pressable>
              ))}
            </View>
          )}
          <View style={[t.row, { justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 12 }]}>
            <Pressable onPress={() => setMenuOpen((o) => !o)} style={[t.row, { gap: 6 }]}>
              <Ionicons name="add" size={16} color={colors.muted} />
              <Text style={{ color: colors.muted, fontWeight: '600', fontSize: 13 }}>Add context</Text>
            </Pressable>
            <Pressable onPress={go} style={[t.btn, t.row, { gap: 6, paddingVertical: 8 }]}>
              <Text style={t.btnText}>Go</Text>
              <Ionicons name="arrow-forward" size={14} color="#fff" />
            </Pressable>
          </View>
          {menuOpen && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {Object.entries(CONTEXT_SAMPLES).map(([label, sample]) => (
                <Pressable key={label} onPress={() => { addContext(sample); setMenuOpen(false); }} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 }}>
                  <Text style={{ fontSize: 13, color: colors.text }}>{label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {role.suggestions.map((label) => (
            <Pressable key={label} onPress={() => setDraft(label)} style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radii.pill, paddingHorizontal: 14, paddingVertical: 7 }}>
              <Text style={{ fontSize: 13, color: colors.text }}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
