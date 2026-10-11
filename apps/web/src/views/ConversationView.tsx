import { useEffect, useRef, useState } from 'react';
import { useSchool, type Approval, type Message } from '@school/core';
import { CheckIcon } from '../components/icons';
import { CanvasPanel } from './Canvas';

function ApprovalCard({ msg, approval }: { msg: Message; approval: Approval }) {
  const resolve = useSchool((s) => s.resolveApproval);
  const secondary = useSchool((s) => s.approvalSecondary);
  return (
    <div className="flex min-w-[280px] flex-col gap-2 rounded-xl border border-border bg-surface p-4">
      <div className="text-sm font-semibold">{approval.title}</div>
      {approval.lines.map((l) => <div key={l} className="text-[13px] text-ink2">{l}</div>)}
      {approval.status === 'resolved' ? (
        <div className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-success"><CheckIcon size={14} />{approval.resolutionText}</div>
      ) : (
        <div className="mt-1.5 flex gap-2">
          <button onClick={() => secondary(msg.id)} className="rounded-lg border border-border bg-surface px-3 py-[7px] text-[13px] font-semibold hover:bg-hover">{approval.secondaryLabel}</button>
          <button onClick={() => resolve(msg.id)} className="rounded-lg bg-accent px-3 py-[7px] text-[13px] font-semibold text-white">{approval.primaryLabel}</button>
        </div>
      )}
    </div>
  );
}

function MessageView({ msg }: { msg: Message }) {
  if (msg.role === 'user') {
    return <div className="max-w-[72%] self-end rounded-[14px_14px_4px_14px] bg-accent px-3.5 py-2.5 text-sm text-white">{msg.text}</div>;
  }
  return (
    <div className="flex max-w-[78%] flex-col gap-2 self-start">
      {msg.activity?.length ? (
        <div className="flex flex-col gap-1">
          {msg.activity.map((step) => (
            <div key={step} className="flex items-center gap-1.5 text-[12.5px] text-subtle"><span className="size-[5px] rounded-full bg-subtle" />{step}</div>
          ))}
        </div>
      ) : null}
      {msg.text && <div className="whitespace-pre-wrap rounded-[4px_14px_14px_14px] border border-border bg-surface px-3.5 py-3 text-sm">{msg.text}</div>}
      {msg.approval && <ApprovalCard msg={msg} approval={msg.approval} />}
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex items-center gap-1 self-start px-1" aria-label="Assistant is working">
      {[0, 1, 2].map((i) => <span key={i} className="size-1.5 rounded-full bg-subtle" style={{ animation: `dotPulse 1s ${i * 0.2}s infinite` }} />)}
    </div>
  );
}

export function ConversationView({ narrow }: { narrow: boolean }) {
  const conv = useSchool((s) => s.conversation);
  const thinking = useSchool((s) => s.thinking);
  const send = useSchool((s) => s.sendReply);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [conv?.messages.length, thinking]);
  if (!conv) return null;

  const submit = () => { const t = draft.trim(); if (t) { setDraft(''); void send(t); } };
  const hasCanvas = !!conv.canvas;

  return (
    <div className={`flex min-h-0 min-w-0 flex-1 ${narrow ? 'flex-col' : 'flex-row'}`}>
      <div className={`flex min-h-0 min-w-0 flex-col ${hasCanvas ? (narrow ? 'flex-[1_1_50%]' : 'flex-[1_1_55%] border-r border-border') : 'flex-1'}`}>
        <div className="flex flex-1 flex-col gap-[18px] overflow-y-auto p-6">
          {conv.messages.map((m) => <MessageView key={m.id} msg={m} />)}
          {thinking && <Thinking />}
          <div ref={endRef} />
        </div>
        <div className="flex shrink-0 items-center gap-2.5 border-t border-border px-6 py-4">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Message…" className="flex-1 rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm outline-none" />
          <button onClick={submit} className="rounded-[10px] bg-accent px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-accent-hover">Send</button>
        </div>
      </div>
      {conv.canvas && (
        <div className={`flex min-h-0 min-w-0 flex-col bg-canvas ${narrow ? 'flex-[1_1_50%]' : 'flex-[1_1_45%]'}`}>
          <CanvasPanel canvas={conv.canvas} />
        </div>
      )}
    </div>
  );
}
