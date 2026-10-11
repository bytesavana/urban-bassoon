/** Single source of truth for the visual language (extracted from the design prototype). */
export const colors = {
  bg: '#F7F6F4',
  surface: '#FFFFFF',
  canvas: '#FBFAF9',
  border: '#E4E1DC',
  borderStrong: '#C7C3BC',
  divider: '#EEECE8',
  hover: '#F1EFEC',
  kbd: '#EDEBE7',
  text: '#1D1B18',
  text2: '#4A463F',
  muted: '#716C64',
  subtle: '#9A958C',
  placeholder: '#A6A19A',
  accent: '#BF5B3D',
  accentHover: '#9C4A31',
  accentSoft: '#F5E6DE',
  success: '#2F8F5B',
  successSoft: '#EAF6EF',
  successText: '#4A6C57',
  danger: '#C94A3B',
  dangerSoft: '#FBEAE7',
  dangerText: '#8A5349',
  warning: '#B9790C',
  info: '#3B6FB0',
  toggleOff: '#D7D4CE',
  scrim: 'rgba(20,18,16,.35)',
} as const;

export const radii = { sm: 6, md: 8, lg: 10, xl: 12, '2xl': 16, pill: 20 } as const;

export const fontFamily = 'Public Sans';

export type ColorToken = keyof typeof colors;
