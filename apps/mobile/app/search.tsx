import { useMemo } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSchool, type CommandEntry } from '@school/core';
import { colors, t } from '../components/theme';

export default function Search() {
  const router = useRouter();
  const commands = useSchool((s) => s.commands);
  const query = useSchool((s) => s.commandQuery);
  const setQuery = useSchool((s) => s.setCommandQuery);
  const run = useSchool((s) => s.runCommand);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return commands.filter((c) => !q || c.label.toLowerCase().includes(q));
  }, [commands, query]);

  const pick = async (entry: CommandEntry) => {
    await run(entry);
    if (entry.type === 'Student') router.replace('/conversation');
    else if (entry.type === 'Automation') router.replace('/automations');
    else if (entry.type === 'Skill') router.replace('/customize');
    else router.replace('/');
  };

  return (
    <View style={[t.screen, { backgroundColor: colors.surface }]}>
      <View style={[t.row, { gap: 10, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.subtle} />
        <TextInput autoFocus value={query} onChangeText={setQuery} placeholder="Search students, tasks, automations, commands…" placeholderTextColor="#A6A19A" style={{ flex: 1, fontSize: 15, color: colors.text }} />
        <Pressable onPress={() => { setQuery(''); router.back(); }}><Text style={{ color: colors.accent, fontWeight: '600' }}>Cancel</Text></Pressable>
      </View>
      <FlatList data={results} keyExtractor={(r) => r.type + r.label} keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.subtle, padding: 24 }}>No results</Text>}
        renderItem={({ item }) => (
          <Pressable onPress={() => void pick(item)} style={[t.row, { gap: 12, paddingHorizontal: 16, paddingVertical: 14 }]}>
            <Text style={[t.pill, { color: colors.accent, backgroundColor: colors.accentSoft, borderRadius: 5, paddingHorizontal: 7 }]}>{item.type}</Text>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.text }}>{item.label}</Text>
            <Text style={t.subtle}>{item.sub}</Text>
          </Pressable>
        )} />
    </View>
  );
}
