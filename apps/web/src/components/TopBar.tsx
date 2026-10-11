import { useSchool } from '@school/core';
import { SearchIcon } from './icons';

export function TopBar() {
  const setCommandOpen = useSchool((s) => s.setCommandOpen);
  const title = useSchool((s) => (s.view === 'conversation' ? s.conversation?.title : undefined));
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-b border-border bg-surface px-5 py-2.5">
      <button onClick={() => setCommandOpen(true)}
        className="flex max-w-[420px] flex-1 items-center gap-2 rounded-lg border border-border bg-bg px-3 py-[7px] text-left text-muted hover:border-border-strong">
        <SearchIcon size={14} />
        <span className="flex-1 text-[13px]">Search or type a command</span>
        <span className="rounded bg-kbd px-1.5 py-px text-[11px] text-subtle">⌘K</span>
      </button>
      {title && <div className="ml-auto truncate text-[13px] font-medium text-muted">{title}</div>}
    </div>
  );
}
