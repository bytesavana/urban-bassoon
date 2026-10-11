import { useState } from 'react';
import { CONTEXT_SAMPLES, greeting, useSchool } from '@school/core';
import { ArrowRightIcon, PlusIcon } from '../components/icons';

export function HomeView() {
  const role = useSchool((s) => s.roles[s.role]);
  const draft = useSchool((s) => s.homeDraft);
  const setDraft = useSchool((s) => s.setHomeDraft);
  const chips = useSchool((s) => s.contextChips);
  const addContext = useSchool((s) => s.addContext);
  const removeContext = useSchool((s) => s.removeContext);
  const submit = useSchool((s) => s.submitHome);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10">
      <div className="flex w-full max-w-[640px] flex-col items-center gap-7">
        <div className="text-center">
          <div className="text-[clamp(22px,3vw,28px)] font-semibold tracking-tight">{greeting(role)}</div>
          <div className="mt-1.5 text-[15px] text-muted">{role.greetingSub}</div>
        </div>

        <div className="w-full rounded-2xl border border-border bg-surface px-[18px] py-4 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && void submit()}
            placeholder="What would you like to do?" className="w-full border-none bg-transparent text-base outline-none" />
          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {chips.map((c, i) => (
                <div key={c + i} className="flex items-center gap-1.5 rounded-md bg-accent-soft px-2 py-1 text-xs font-semibold text-accent">
                  <span>{c}</span>
                  <button aria-label={`Remove ${c}`} onClick={() => removeContext(i)} className="flex border-none bg-transparent p-0 text-sm leading-none text-accent">×</button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3.5 flex items-center justify-between border-t border-divider pt-3">
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-1.5 px-1.5 py-1 text-[13px] font-semibold text-muted hover:text-ink">
                <PlusIcon size={14} /> Add context
              </button>
              {menuOpen && (
                <div className="absolute bottom-8 left-0 z-20 flex min-w-[160px] flex-col gap-px rounded-[10px] border border-border bg-surface p-1.5 shadow-[0_8px_24px_rgba(0,0,0,.08)]">
                  {Object.entries(CONTEXT_SAMPLES).map(([label, sample]) => (
                    <button key={label} onClick={() => { addContext(sample); setMenuOpen(false); }}
                      className="rounded-md px-2.5 py-[7px] text-left text-[13px] hover:bg-hover">{label}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => void submit()} className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-accent-hover">
              Go <ArrowRightIcon size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {role.suggestions.map((label) => (
            <button key={label} onClick={() => setDraft(label)}
              className="rounded-full border border-border bg-surface px-3.5 py-[7px] text-[13px] hover:border-accent hover:text-accent">{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
