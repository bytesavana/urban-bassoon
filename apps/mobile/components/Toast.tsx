import { Text, View } from 'react-native';
import { useSchool } from '@school/core';
import { colors } from './theme';

export function Toast() {
  const toast = useSchool((s) => s.toast);
  if (!toast) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center', zIndex: 100 }}>
      <View style={{ backgroundColor: colors.text, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 }}>
        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '500' }}>{toast}</Text>
      </View>
    </View>
  );
}
