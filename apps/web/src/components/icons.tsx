import type { ReactNode } from 'react';

const Svg = ({ size = 16, sw = 2, children, stroke = 'currentColor' }: { size?: number; sw?: number; stroke?: string; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw}>{children}</svg>
);
type P = { size?: number; stroke?: string };

export const PlusIcon = (p: P) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const SearchIcon = (p: P) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Svg>;
export const ArrowRightIcon = (p: P) => <Svg {...p}><path d="M5 12h14M13 5l7 7-7 7" /></Svg>;
export const ChevronRightIcon = (p: P) => <Svg {...p}><path d="M9 6l6 6-6 6" /></Svg>;
export const CloseIcon = (p: P) => <Svg {...p}><path d="M18 6L6 18M6 6l12 12" /></Svg>;
export const CheckIcon = (p: P) => <Svg {...p} sw={2.5}><path d="M20 6L9 17l-5-5" /></Svg>;
export const InboxIcon = (p: P) => <Svg {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" /></Svg>;
export const WorkIcon = (p: P) => <Svg {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></Svg>;
export const BoltIcon = (p: P) => <Svg {...p}><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" /></Svg>;
export const SettingsIcon = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h0a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /></Svg>;
