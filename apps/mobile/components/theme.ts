import { StyleSheet } from 'react-native';
import { colors, radii } from '@school/design-tokens';

export { colors, radii };

export const t = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, gap: 10 },
  h1: { fontSize: 20, fontWeight: '600', color: colors.text },
  sub: { fontSize: 13.5, color: colors.muted, marginBottom: 6 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.xl, padding: 16 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  muted: { fontSize: 12.5, color: colors.muted },
  subtle: { fontSize: 12, color: colors.subtle },
  label: { fontSize: 12, fontWeight: '700', color: colors.subtle, textTransform: 'uppercase', letterSpacing: 0.4 },
  btn: { backgroundColor: colors.accent, borderRadius: radii.md, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  btnGhost: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingVertical: 8, paddingHorizontal: 13, alignItems: 'center' },
  btnGhostText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  pill: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden', fontSize: 11, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radii.lg, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center' },
});

export const fmtDelta = (n: number, suffix = '') => `${n > 0 ? '+' : '–'}${Math.abs(n)}${suffix}`;
export const deltaColor = (n: number) => (n >= 0 ? colors.success : colors.danger);
