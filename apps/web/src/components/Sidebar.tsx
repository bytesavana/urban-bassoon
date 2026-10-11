import type { ReactNode } from 'react';
import { SCHOOL_NAME, useSchool, type ViewKey } from '@school/core';
import { BoltIcon, InboxIcon, PlusIcon, SettingsIcon, WorkIcon } from './icons';

const NAV: { key: ViewKey; label: string; icon: ReactNode }[] = [
  { key: 'inbox', label: 'Inbox', icon: <InboxIcon /> },
  { key: 'work', label: 'Work', icon: <WorkIcon /> },
  { key: 'automations', label: 'Automations', icon: <BoltIcon /> },
  { key: 'customize', label: 'Customize', icon: <SettingsIcon /> },
];

export function Sidebar({ narrow }: { narrow: boolean }) {
  const view = useSchool((s) => s.view);
  const setView = useSchool((s) => s.setView);
  const newTask = useSchool((s) => s.newTask);
  const cycleRole = useSchool((s) => s.cycleRole);
  const role = useSchool((s) => s.roles[s.role]);
  const inboxCount = useSchool((s) => s.inbox.length);

  return (
    <aside className={`flex shrink-0 flex-col justify-between overflow-hidden border-r border-border bg-surface transition-[width] duration-150 ${narrow ? 'w-16' : 'w-[232px]'}`}>
      <div className="flex flex-col gap-0.5 px-3 py-4">
        <div className="flex items-center gap-2 px-2 pb-[18px] pt-1">
          <div className="size-[22px] shrink-0 rounded-md bg-accent" />
          {!narrow && <div className="min-w-0 flex-1 truncate text-sm font-semibold">{SCHOOL_NAME}</div>}
        </div>

        <button onClick={newTask} className="mb-2.5 flex items-center gap-2.5 rounded-lg border border-border bg-bg px-2.5 py-[9px] font-semibold hover:bg-hover">
          <PlusIcon /> {!narrow && <span>New task</span>}
        </button>

        {NAV.map((n) => {
          const active = view === n.key;
          const badge = n.key === 'inbox' ? inboxCount : 0;
          return (
            <button key={n.key} onClick={() => setView(n.key)}
              className={`relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-left hover:bg-hover ${active ? 'bg-accent-soft font-bold text-accent' : 'font-medium'}`}>
              <span className="flex size-4 shrink-0">{n.icon}</span>
              {!narrow && <span className="flex-1">{n.label}</span>}
              {badge > 0 && (
                <span className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-[5px] text-[11px] font-bold text-white ${narrow ? 'absolute right-1 top-1' : ''}`}>{badge}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-border p-3">
        {!narrow && <div className="truncate px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{SCHOOL_NAME}</div>}
        <button onClick={cycleRole} title="Switch role (demo)" className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left hover:bg-hover">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">{role.initial}</div>
          {!narrow && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold">{role.name}</div>
              <div className="truncate text-xs text-muted">{role.label}</div>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
