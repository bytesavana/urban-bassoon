import { isCustomizeEnabled, useSchool, type CustomizeItem, type CustomizeTab } from '@school/core';
import { CloseIcon } from '../components/icons';

const TABS: [CustomizeTab, string][] = [['agents', 'Agents'], ['skills', 'Skills'], ['plugins', 'Plugins'], ['connectors', 'Connectors']];
const STATUS: Record<string, string> = { connected: 'Connected', 'not connected': 'Not connected', installed: 'Installed', 'not installed': 'Not installed' };

function statusLabel(ci: CustomizeItem, enabled: boolean) {
  return ci.status ? STATUS[ci.status]! : enabled ? 'Enabled' : 'Disabled';
}
function isPositive(ci: CustomizeItem, enabled: boolean) {
  return ci.status === 'connected' || ci.status === 'installed' || (!ci.status && enabled);
}

export function CustomizeView() {
  const tab = useSchool((s) => s.customizeTab);
  const setTab = useSchool((s) => s.setCustomizeTab);
  const items = useSchool((s) => s.customize[s.customizeTab]);
  const overrides = useSchool((s) => s.customizeOverrides);
  const selectedId = useSchool((s) => s.customizeSelectedId);
  const select = useSchool((s) => s.selectCustomize);
  const toggle = useSchool((s) => s.toggleCustomize);
  const selected = items.find((i) => i.id === selectedId);
  const selEnabled = selected ? isCustomizeEnabled(selected, overrides) : false;

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-1 text-xl font-semibold">Customize</div>
        <div className="mb-[18px] text-[13.5px] text-muted">Configure the AI platform behind your school</div>
        <div role="tablist" className="mb-[18px] flex gap-1 border-b border-border">
          {TABS.map(([key, label]) => (
            <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
              className={`border-b-2 px-3.5 py-[9px] text-[13.5px] font-semibold ${tab === key ? 'border-accent text-accent' : 'border-transparent text-muted'}`}>{label}</button>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
          {items.map((ci) => {
            const enabled = isCustomizeEnabled(ci, overrides);
            return (
              <button key={ci.id} onClick={() => select(ci.id)}
                className={`rounded-xl border bg-surface p-4 text-left hover:border-border-strong ${selectedId === ci.id ? 'border-accent' : 'border-border'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold">{ci.name}</div>
                  <span className={`whitespace-nowrap rounded-[10px] px-2 py-0.5 text-[11px] font-bold ${isPositive(ci, enabled) ? 'bg-success-soft text-success' : 'bg-hover text-subtle'}`}>{statusLabel(ci, enabled)}</span>
                </div>
                <div className="mt-1.5 text-[12.5px] text-muted">{ci.description}</div>
                <div className="mt-2.5 text-[11.5px] text-subtle">{ci.footer}</div>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-5 rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[15px] font-semibold">{selected.name}</div>
                <div className="mt-1 text-[13px] text-muted">{selected.description}</div>
              </div>
              <button aria-label="Close" onClick={() => select(null)} className="text-subtle"><CloseIcon /></button>
            </div>
            <div className="mb-1.5 mt-3.5 text-xs font-bold uppercase tracking-wide text-subtle">{selected.listLabel}</div>
            <div className="flex flex-wrap gap-1.5">
              {selected.list.map((li) => <span key={li} className="rounded-md bg-hover px-2.5 py-1 text-[12.5px]">{li}</span>)}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-divider pt-3.5">
              <span className="text-[13px] font-semibold">
                {selected.status === 'connected' || selected.status === 'not connected'
                  ? (selected.status === 'connected' ? 'Connected' : 'Connect')
                  : (selEnabled ? 'Enabled' : 'Disabled')}
              </span>
              <button role="switch" aria-checked={selEnabled} aria-label="Toggle" onClick={() => toggle(selected)}
                className={`relative h-[22px] w-[38px] shrink-0 rounded-full border-none ${selEnabled ? 'bg-accent' : 'bg-toggle-off'}`}>
                <span className={`absolute top-0.5 size-[18px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.2)] transition-[left] ${selEnabled ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
