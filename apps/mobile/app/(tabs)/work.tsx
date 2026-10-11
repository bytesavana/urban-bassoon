import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSchool } from '@school/core';
import { colors, t } from '../../components/theme';

export default function Work() {
  const router = useRouter();
  const items = useSchool((s) => s.work);
  const open = useSchool((s) => s.openWorkItem);
  return (
    <ScrollView style={t.screen} contentContainerStyle={t.scroll}>
      <Text style={t.sub}>Your history of meaningful work</Text>
      {items.map((it) => (
        <Pressable key={it.id} onPress={async () => { await open(it); router.push('/conversation'); }} style={[t.card, t.row, { justifyContent: 'space-between', paddingVertical: 14 }]}>
          <View style={{ flex: 1 }}>
            <Text style={t.cardTitle}>{it.title}</Text>
            <Text style={[t.subtle, { marginTop: 3, fontSize: 12.5 }]}>{it.meta}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.subtle} />
        </Pressable>
      ))}
    </ScrollView>
  );
}
