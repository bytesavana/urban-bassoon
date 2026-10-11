import { useSchool, type InboxItem } from '@school/core';
import { ChevronRightIcon } from '../components/icons';

const DOT: Record<InboxItem['severity'], string> = { warning: 'bg-warning', danger: 'bg-danger', info: 'bg-info' };

export function InboxView() {
  const items = useSchool((s) => s.inbox);
  const open = useSchool((s) => s.openInboxItem);
  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-1 text-xl font-semibold">Inbox</div>
        <div className="mb-5 text-[13.5px] text-muted">Things that need your attention</div>
        <div className="flex flex-col gap-2.5">
          {items.map((it) => (
            <button key={it.id} onClick={() => void open(it)} className="flex items-start gap-3.5 rounded-xl border border-border bg-surface px-[18px] py-4 text-left hover:border-border-strong">
              <div className={`mt-1.5 size-2 shrink-0 rounded-full ${DOT[it.severity]}`} />
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-semibold">{it.title}</div>
                <div className="mt-[3px] text-[13px] text-muted">{it.detail}</div>
                <div className="mt-1.5 text-[12.5px] font-semibold text-accent">{it.recommendation}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorkView() {
  const items = useSchool((s) => s.work);
  const open = useSchool((s) => s.openWorkItem);
  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-1 text-xl font-semibold">Work</div>
        <div className="mb-5 text-[13.5px] text-muted">Your history of meaningful work</div>
        <div className="flex flex-col gap-2">
          {items.map((it) => (
            <button key={it.id} onClick={() => void open(it)} className="flex items-center justify-between rounded-[10px] border border-border bg-surface px-4 py-3.5 text-left hover:border-border-strong">
              <div>
                <div className="text-sm font-semibold">{it.title}</div>
                <div className="mt-[3px] text-[12.5px] text-subtle">{it.meta}</div>
              </div>
              <ChevronRightIcon size={15} stroke="#9A958C" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
