import { useEffect, useMemo, useRef, useState } from 'react';
import { useSchool } from '@school/core';
import { SearchIcon } from './icons';

export function CommandPalette() {
  const open = useSchool((s) => s.commandOpen);
  const query = useSchool((s) => s.commandQuery);
  const commands = useSchool((s) => s.commands);
  const setOpen = useSchool((s) => s.setCommandOpen);
  const setQuery = useSchool((s) => s.setCommandQuery);
  const run = useSchool((s) => s.runCommand);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return commands.filter((c) => !q || c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => { setActive(0); }, [query, open]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && results[active]) void run(results[active]);
  };

  return (
    <div onClick={() => setOpen(false)} className="fixed inset-0 z-[100] flex justify-center bg-[rgba(20,18,16,.35)] pt-[12vh]">
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-[60vh] w-[560px] max-w-[90vw] flex-col overflow-hidden rounded-[14px] bg-surface shadow-[0_20px_60px_rgba(0,0,0,.25)]">
        <div className="flex items-center gap-2.5 border-b border-border px-[18px] py-3.5">
          <SearchIcon stroke="#9A958C" />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown}
            placeholder="Search students, tasks, automations, commands…" className="flex-1 border-none bg-transparent text-[15px] outline-none" />
        </div>
        <div className="overflow-y-auto p-1.5">
          {results.length === 0 && <div className="px-3 py-6 text-center text-[13px] text-subtle">No results</div>}
          {results.map((r, i) => (
            <button key={r.type + r.label} onClick={() => void run(r)} onMouseEnter={() => setActive(i)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${i === active ? 'bg-hover' : ''}`}>
              <span className="shrink-0 rounded-[5px] bg-accent-soft px-[7px] py-0.5 text-[11px] font-bold text-accent">{r.type}</span>
              <span className="flex-1 text-[13.5px] font-medium">{r.label}</span>
              <span className="text-xs text-subtle">{r.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
