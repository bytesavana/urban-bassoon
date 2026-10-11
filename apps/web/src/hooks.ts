import { useEffect, useState } from 'react';

/** Matches the prototype's 880px breakpoint (sidebar collapses, conversation stacks). */
export function useIsNarrow(breakpoint = 880) {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return narrow;
}

export const fmtDelta = (n: number, suffix = '') => `${n > 0 ? '+' : '–'}${Math.abs(n)}${suffix}`;
export const deltaClass = (n: number) => (n >= 0 ? 'text-success' : 'text-danger');
