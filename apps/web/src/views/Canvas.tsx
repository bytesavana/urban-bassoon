import { useState } from 'react';
import { CANVAS_KICKER, useSchool, type Canvas } from '@school/core';
import { CheckIcon, CloseIcon } from '../components/icons';
import { deltaClass, fmtDelta } from '../hooks';

const H = ({ title, sub }: { title: string; sub: string }) => (
  <>
    <div className="text-[19px] font-semibold">{title}</div>
    <div className="mt-0.5 text-[13px] text-muted">{sub}</div>
  </>
);
const Label = ({ children }: { children: string }) => <div className="mb-2 text-xs font-bold uppercase tracking-wide text-subtle">{children}</div>;
const PrimaryBtn = ({ onClick, children }: { onClick: () => void; children: string }) => (
  <button onClick={onClick} className="mt-4 rounded-lg bg-accent px-4 py-[9px] text-[13px] font-semibold text-white hover:bg-accent-hover">{children}</button>
);

export function CanvasPanel({ canvas }: { canvas: Canvas }) {
  const close = useSchool((s) => s.closeCanvas);
  const kicker = canvas.type === 'results' ? canvas.kicker : CANVAS_KICKER[canvas.type];
  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
        <div className="text-[13.5px] font-semibold uppercase tracking-wide text-muted">{kicker}</div>
        <button aria-label="Close panel" onClick={close} className="flex p-1 text-subtle hover:text-ink"><CloseIcon /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {canvas.type === 'attendance' && <Attendance canvas={canvas} />}
        {canvas.type === 'results' && <Results canvas={canvas} />}
        {canvas.type === 'finance' && <Finance canvas={canvas} />}
        {canvas.type === 'student' && <Student canvas={canvas} />}
        {canvas.type === 'document' && <Document canvas={canvas} />}
        {canvas.type === 'timetable' && <Timetable canvas={canvas} />}
      </div>
    </>
  );
}

function Attendance({ canvas }: { canvas: Extract<Canvas, { type: 'attendance' }> }) {
  const toggle = useSchool((s) => s.toggleAttendance);
  const setSaved = useSchool((s) => s.setAttendanceSaved);
  const absent = canvas.absentIds.length;
  return (
    <>
      <H title={canvas.className} sub={`Today's attendance · ${canvas.date}`} />
      <div className="my-4 flex gap-2.5">
        <div className="flex-1 rounded-[10px] bg-success-soft px-3.5 py-3"><div className="text-[22px] font-bold text-success">{canvas.roster.length - absent}</div><div className="text-xs font-semibold text-success-text">Present</div></div>
        <div className="flex-1 rounded-[10px] bg-danger-soft px-3.5 py-3"><div className="text-[22px] font-bold text-danger">{absent}</div><div className="text-xs font-semibold text-danger-text">Absent</div></div>
      </div>
      <div className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-surface">
        {canvas.roster.map((stu) => {
          const isAbsent = canvas.absentIds.includes(stu.id);
          return (
            <button key={stu.id} disabled={canvas.saved} onClick={() => toggle(stu.id)}
              className="flex w-full items-center justify-between border-b border-divider px-3.5 py-2.5 text-left last:border-b-0 enabled:hover:bg-bg">
              <span className="text-[13.5px]">{stu.name}</span>
              <span className={`rounded-xl px-[9px] py-[3px] text-xs font-bold ${isAbsent ? 'bg-danger-soft text-danger' : 'bg-success-soft text-success'}`}>{isAbsent ? 'Absent' : 'Present'}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2.5">
        {canvas.saved ? (
          <>
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-success"><CheckIcon size={14} />Attendance saved</div>
            <button onClick={() => setSaved(false)} className="ml-auto rounded-lg border border-border bg-surface px-3.5 py-2 text-[13px] font-semibold">Make changes</button>
          </>
        ) : (
          <button onClick={() => setSaved(true)} className="rounded-lg bg-accent px-4 py-[9px] text-[13px] font-semibold text-white">Save attendance</button>
        )}
      </div>
    </>
  );
}

function Results({ canvas }: { canvas: Extract<Canvas, { type: 'results' }> }) {
  return (
    <>
      <H title={canvas.title} sub={canvas.subtitle} />
      <div className="my-[18px] flex flex-col gap-2.5">
        {canvas.bars.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex justify-between text-[13px]"><span className="font-semibold">{b.label}</span><span className={`font-semibold ${deltaClass(b.delta)}`}>{fmtDelta(b.delta, ' pts')}</span></div>
            <div className="h-2.5 overflow-hidden rounded-md bg-divider"><div className={`h-full rounded-md ${b.delta >= 0 ? 'bg-success' : 'bg-danger'}`} style={{ width: `${b.pct}%` }} /></div>
          </div>
        ))}
      </div>
      <Label>Students to watch</Label>
      <div className="overflow-hidden rounded-[10px] border border-border bg-surface">
        {canvas.students.map((st) => (
          <div key={st.name} className="flex items-center justify-between border-b border-divider px-3.5 py-2.5 last:border-b-0">
            <div><div className="text-[13.5px] font-medium">{st.name}</div><div className="text-xs text-subtle">{st.classLabel}</div></div>
            <div className="text-right"><div className="text-[13.5px] font-semibold">{st.score}</div><div className={`text-xs font-semibold ${deltaClass(st.delta)}`}>{fmtDelta(st.delta)}</div></div>
          </div>
        ))}
      </div>
    </>
  );
}

function Finance({ canvas }: { canvas: Extract<Canvas, { type: 'finance' }> }) {
  return (
    <>
      <H title={canvas.title} sub={canvas.subtitle} />
      <div className="mt-4 flex flex-col overflow-hidden rounded-[10px] border border-border bg-surface">
        {canvas.rows.map((r) => (
          <div key={r.primary} className="flex items-center justify-between gap-2.5 border-b border-divider px-3.5 py-3 last:border-b-0">
            <div className="min-w-0"><div className="text-[13.5px] font-medium">{r.primary}</div><div className="text-xs text-subtle">{r.secondary}</div></div>
            <div className="whitespace-nowrap text-[13.5px] font-bold">{r.amount}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function Student({ canvas }: { canvas: Extract<Canvas, { type: 'student' }> }) {
  const send = useSchool((s) => s.sendReply);
  const [draft, setDraft] = useState('');
  const ask = () => { const t = draft.trim(); if (t) { setDraft(''); void send(t, { focusStudent: canvas.name }); } };
  return (
    <>
      <H title={canvas.name} sub={`${canvas.classLabel} · ${canvas.studentId}`} />
      <div className="mt-4 flex flex-col gap-3.5">
        {canvas.sections.map((s) => (
          <div key={s.label} className="rounded-[10px] border border-border bg-surface px-3.5 py-3">
            <div className="mb-[5px] text-xs font-bold uppercase tracking-wide text-subtle">{s.label}</div>
            <div className="text-[13.5px]">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-[18px] border-t border-border pt-3.5">
        <div className="mb-2 text-[12.5px] font-semibold text-muted">Ask about {canvas.firstName}</div>
        <div className="flex gap-2">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ask()}
            placeholder="e.g. Has his performance changed recently?" className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-[13px] outline-none" />
          <button onClick={ask} className="rounded-lg bg-accent px-3.5 py-2 text-[13px] font-semibold text-white">Ask</button>
        </div>
      </div>
    </>
  );
}

function Document({ canvas }: { canvas: Extract<Canvas, { type: 'document' }> }) {
  const toast = useSchool((s) => s.showToast);
  return (
    <>
      <H title={canvas.title} sub={canvas.subtitle} />
      <div className="mt-4 flex flex-col gap-2.5">
        {canvas.sections.map((s) => (
          <div key={s.heading} className="rounded-[10px] border border-border bg-surface px-3.5 py-3">
            <div className="mb-1 text-[13.5px] font-semibold">{s.heading}</div>
            <div className="text-[13px] text-ink2">{s.preview}</div>
          </div>
        ))}
      </div>
      <PrimaryBtn onClick={() => toast('Export started')}>Export as PDF</PrimaryBtn>
    </>
  );
}

function Timetable({ canvas }: { canvas: Extract<Canvas, { type: 'timetable' }> }) {
  const toast = useSchool((s) => s.showToast);
  const cell = 'bg-bg px-1 py-2 text-center font-bold text-muted';
  return (
    <>
      <H title={canvas.title} sub={canvas.subtitle} />
      <div className="mt-4 grid grid-cols-[70px_repeat(5,minmax(0,1fr))] gap-px overflow-hidden rounded-[10px] border border-border bg-border text-[11.5px]">
        <div className={cell} />
        {canvas.days.map((d) => <div key={d} className={cell}>{d}</div>)}
        {canvas.rows.map((r) => (
          <div key={r.period} className="contents">
            <div className={cell}>{r.period}</div>
            {r.cells.map((c, i) => <div key={i} className="bg-surface px-1 py-2 text-center">{c}</div>)}
          </div>
        ))}
      </div>
      <PrimaryBtn onClick={() => toast('Timetable published')}>Publish timetable</PrimaryBtn>
    </>
  );
}
