import { effectiveAutomationStatus, useSchool } from '@school/core';
import { CloseIcon } from '../components/icons';

export function AutomationsView() {
  const automations = useSchool((s) => s.automations);
  const overrides = useSchool((s) => s.automationOverrides);
  const selectedId = useSchool((s) => s.automationSelectedId);
  const select = useSchool((s) => s.selectAutomation);
  const toggle = useSchool((s) => s.toggleAutomation);
  const toast = useSchool((s) => s.showToast);
  const selected = automations.find((a) => a.id === selectedId);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-1 text-xl font-semibold">Automations</div>
        <div className="mb-5 text-[13.5px] text-muted">Workers that run quietly in the background</div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {automations.map((a) => {
            const active = effectiveAutomationStatus(a, overrides) === 'active';
            return (
              <button key={a.id} onClick={() => select(a.id)}
                className={`rounded-xl border bg-surface p-4 text-left hover:border-border-strong ${selectedId === a.id ? 'border-accent' : 'border-border'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold">{a.name}</div>
                  <span className={`whitespace-nowrap rounded-[10px] px-2 py-0.5 text-[11px] font-bold ${active ? 'bg-success-soft text-success' : 'bg-hover text-muted'}`}>{active ? 'Active' : 'Paused'}</span>
                </div>
                <div className="mt-1.5 text-[12.5px] text-muted">{a.purpose}</div>
                <div className="mt-2.5 text-[11.5px] text-subtle">{a.trigger}</div>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-5 rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[15px] font-semibold">{selected.name}</div>
                <div className="mt-1 text-[13px] text-muted">{selected.purpose}</div>
              </div>
              <button aria-label="Close" onClick={() => select(null)} className="text-subtle"><CloseIcon /></button>
            </div>
            <div className="mt-2.5 text-[12.5px] text-subtle">{selected.trigger}</div>
            <div className="mt-2.5 flex flex-col gap-[3px]">
              {selected.steps.map((step) => (
                <div key={step} className="flex gap-1.5 text-[12.5px] text-ink2"><span className="text-border-strong">—</span>{step}</div>
              ))}
            </div>
            <div className="mt-3.5 flex gap-4 text-xs text-subtle"><span>Last run: {selected.lastRun}</span><span>Next run: {selected.nextRun}</span></div>
            <div className="mt-4 flex gap-2 border-t border-divider pt-3.5">
              {[
                { label: 'Run now', on: () => toast(`${selected.name} is running…`) },
                { label: 'Edit', on: () => toast('Opening automation editor…') },
                { label: effectiveAutomationStatus(selected, overrides) === 'active' ? 'Pause' : 'Resume', on: () => toggle(selected) },
              ].map((b) => (
                <button key={b.label} onClick={b.on} className="rounded-lg border border-border bg-surface px-[13px] py-[7px] text-[12.5px] font-semibold hover:bg-hover">{b.label}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
