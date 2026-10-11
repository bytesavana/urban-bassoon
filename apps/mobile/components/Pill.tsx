import { Text } from 'react-native';
import { colors, t } from './theme';

export function Pill({ label, positive }: { label: string; positive: boolean }) {
  return <Text style={[t.pill, { backgroundColor: positive ? colors.successSoft : colors.hover, color: positive ? colors.success : colors.muted }]}>{label}</Text>;
}
