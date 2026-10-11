import type {
  AgentClient, AgentReply, Approval, AttendanceCanvas, Canvas, ConversationSeed, InboxItem, RoleKey, WorkItem,
} from '../types';
import {
  ABSENT_DEFAULT, AUTOMATIONS, COMMANDS, CUSTOMIZE, FEE_RECIPIENTS, INBOX, ROLES, ROSTER, UNMATCHED_PAYMENTS, WORK,
} from './data';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const canvases = {
  attendance: (): AttendanceCanvas => ({
    type: 'attendance', className: 'Form 2 Blue', date: '3 October 2026',
    roster: ROSTER, absentIds: [...ABSENT_DEFAULT], saved: false,
  }),
  results: (f4 = false): Canvas => ({
    type: 'results', kicker: f4 ? 'Results — Form 4' : 'Results',
    title: f4 ? 'Form 4 Mathematics' : 'Form 3 Mathematics',
    subtitle: f4 ? 'Performance analysis — Term 2' : 'East improved, West declined this term',
    bars: [
      { label: f4 ? 'Form 4 East' : 'Form 3 East', pct: 72, delta: 7 },
      { label: f4 ? 'Form 4 West' : 'Form 3 West', pct: 61, delta: -7 },
    ],
    students: [
      { name: 'Peter Kiprotich', classLabel: 'West · Algebra', score: '60', delta: -15 },
      { name: 'Brian Mwangi', classLabel: 'East', score: '71', delta: 13 },
      { name: 'Sarah Njoki', classLabel: 'West', score: '64', delta: -2 },
    ],
  }),
  unmatched: (): Canvas => ({
    type: 'finance', title: 'Unreconciled Payments',
    subtitle: `${UNMATCHED_PAYMENTS.length} payments need a manual match`, rows: UNMATCHED_PAYMENTS,
  }),
  recipients: (): Canvas => ({
    type: 'finance', title: 'Fee Reminder Recipients',
    subtitle: `${FEE_RECIPIENTS.length} parents with outstanding balances`,
    rows: FEE_RECIPIENTS.map((r) => ({ primary: r.name, secondary: 'Outstanding balance', amount: r.balance })),
  }),
  student: (name = 'Brian Mwangi'): Canvas => ({
    type: 'student', name, firstName: name.split(' ')[0] ?? name, classLabel: 'Form 3 East', studentId: 'STU-2291',
    sections: [
      { label: 'Academic performance', value: 'Mathematics improved from 58 to 71 this term (+13 pts).' },
      { label: 'Attendance', value: '2 absences this week · 96% attendance this term.' },
      { label: 'Recent assessments', value: 'Mid-Term Exam: 71/100 · CAT 2: 66/100' },
      { label: 'Teacher observations', value: '"Brian is more confident answering in class since the start of term." — Mary Chebet' },
    ],
  }),
  document: (): Canvas => ({
    type: 'document', title: 'End-of-Term Report — Form 3', subtitle: 'Draft · 4 sections',
    sections: [
      { heading: 'Academic performance', preview: 'Form 3 East improved overall; Form 3 West declined, mainly in algebra.' },
      { heading: 'Attendance summary', preview: 'Average attendance 94% across both classes this term.' },
      { heading: 'Fee status', preview: '6 accounts remain outstanding, totalling KES 98,500.' },
      { heading: 'Teacher remarks', preview: 'Compiled from 2 teachers · ready for review.' },
    ],
  }),
  timetable: (): Canvas => ({
    type: 'timetable', title: 'Form 2 Blue — Weekly Timetable', subtitle: 'Draft · 5 periods shown',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    rows: [
      ['Math', 'English', 'Science', 'Math', 'CRE'], ['English', 'Science', 'Math', 'Geography', 'Math'],
      ['Science', 'Math', 'English', 'Math', 'PE'], ['Math', 'CRE', 'Geography', 'English', 'Science'],
      ['Geography', 'Math', 'PE', 'Science', 'English'],
    ].map((cells, i) => ({ period: `P${i + 1}`, cells })),
  }),
};

const feeApproval = (): Approval => ({
  kind: 'fee_reminder', status: 'pending',
  title: `Ready to send ${FEE_RECIPIENTS.length} fee reminders`,
  lines: [`${FEE_RECIPIENTS.length} parents will receive an SMS.`, 'Balances range from KES 2,500 to KES 38,000.', 'No parent has received a reminder in the last 72 hours.'],
  primaryLabel: `Send ${FEE_RECIPIENTS.length} messages`, secondaryLabel: 'Review recipients',
  resolutionText: `Sent ${FEE_RECIPIENTS.length} reminders`, secondaryCanvas: canvases.recipients(),
});
const commsApproval = (): Approval => ({
  kind: 'communication', status: 'pending', title: 'Ready to send this message',
  lines: ['All Form-wide parents will receive this via SMS and app notification.', 'No message about Sports Day has been sent before.'],
  primaryLabel: 'Send message', secondaryLabel: 'Edit message', resolutionText: 'Message sent',
});

/** Keyword-routed stand-in for the real agent backend (ported from the design prototype). */
export class MockAgentClient implements AgentClient {
  constructor(private latencyMs = 450) {}

  async respond({ text, focusStudent }: { text: string; role: RoleKey; focusStudent?: string }): Promise<AgentReply> {
    await sleep(this.latencyMs);
    const t = text.toLowerCase();
    if (focusStudent) {
      const first = focusStudent.split(' ')[0];
      return { activity: [`Reviewing ${first}’s records…`], text: `${first}’s Mathematics score rose from 58 to 71 this term, and his attendance shows two absences this week — both recorded today.` };
    }
    if (t.includes('attend')) {
      return { activity: ['Opening Form 2 Blue register…'], canvas: canvases.attendance(),
        text: 'Form 2 Blue — 10 present, 2 absent today. I’ve marked Brian Mwangi and Wanjiku Kariuki as absent based on what you told me. Review and save below.' };
    }
    if (t.includes('perform') || t.includes('result') || t.includes('analys')) {
      return { activity: ['Pulling Form 3 Mathematics assessment scores…', 'Comparing against last term…'], canvas: canvases.results(),
        text: 'Form 3 East improved while Form 3 West declined. The largest drop occurred in algebra — Peter Kiprotich fell 15 points. Full breakdown is on the right.' };
    }
    if (t.includes('remind') || t.includes('outstanding') || t.includes('balance')) {
      return { activity: ['Checking outstanding balances…', 'Excluding accounts reminded in the last 72 hours…', 'Preparing parent messages…'], approval: feeApproval() };
    }
    if (t.includes('reconcil') || t.includes('could not') || t.includes('unmatched') || t.includes('m-pesa') || t.includes('mpesa')) {
      return { activity: ['Matching recent M-Pesa payments…', 'Flagging payments with no confident match…'], canvas: canvases.unmatched(),
        text: 'I found 3 M-Pesa payments I couldn’t match automatically. Details are on the right — you can match them manually or send them to the Finance Inbox.' };
    }
    if (t.includes('report')) {
      return { activity: ['Compiling academic, attendance and fee summaries…'], canvas: canvases.document(),
        text: 'I’ve drafted the end-of-term report. It’s structured into four sections — you can export it once it looks right.' };
    }
    if (t.includes('timetable')) {
      return { activity: ['Checking teacher availability…', 'Balancing subject loads across the week…'], canvas: canvases.timetable(),
        text: 'Here’s a draft weekly timetable for Form 2 Blue. Let me know if any subject needs to move.' };
    }
    if (t.includes('message') || t.includes('communicat') || (t.includes('parent') && !t.includes('replies'))) {
      return { activity: ['Drafting a message to parents…'], approval: commsApproval(),
        text: 'Dear parent, this is a reminder that Sports Day takes place tomorrow from 9:00 AM. Students should arrive in house colours by 8:30 AM.' };
    }
    if (t.includes('brian')) {
      return { activity: ['Opening Brian Mwangi’s profile…'], canvas: canvases.student(),
        text: 'Here’s Brian Mwangi’s profile. His Mathematics score improved 13 points this term, though his attendance has had two absences this week.' };
    }
    return { activity: ['Thinking…'],
      text: 'I can help with attendance, results, fees, communication, reports or timetables — tell me what you’d like to do, or add context first.' };
  }

  async openInboxItem(item: InboxItem): Promise<ConversationSeed> {
    const reply: AgentReply = { activity: ['Looking into this…'], text: item.detail };
    switch (item.kind) {
      case 'finance_unmatched': Object.assign(reply, { text: `Here are the ${UNMATCHED_PAYMENTS.length} payments I couldn’t match automatically.`, canvas: canvases.unmatched() }); break;
      case 'attendance_nudge': reply.text = '12 teachers haven’t completed today’s attendance yet. I’ve sent a reminder to each of them.'; break;
      case 'marks_incomplete': reply.text = '6 students in Form 4 Mathematics are missing a mid-term score. I’ve notified the subject teacher to complete entry.'; break;
      case 'fee_approval': reply.text = null; reply.approval = feeApproval(); break;
      case 'parent_replies': reply.text = 'Parents have been asking about pickup times for Sports Day. I’ve drafted a clarifying reply — happy to send it on your behalf.'; break;
      case 'attendance_take': Object.assign(reply, { text: 'Opening yesterday’s Form 2 Blue register so you can complete it.', canvas: canvases.attendance() }); break;
    }
    return { title: item.title, reply };
  }

  async openWorkItem(item: WorkItem): Promise<ConversationSeed> {
    const map: Record<WorkItem['kind'], AgentReply> = {
      document: { text: 'Here’s where we left the end-of-term report.', canvas: canvases.document() },
      results: { text: 'Reopening the Form 4 performance analysis.', canvas: canvases.results(true) },
      timetable: { text: 'Here’s the draft 2027 timetable.', canvas: canvases.timetable() },
      finance: { text: 'Reopening the fee collection review for Term 2.', canvas: canvases.unmatched() },
      communication_done: { text: 'The Sports Day message was sent to 214 parents on Monday.',
        approval: { kind: 'done', status: 'resolved', title: 'Message sent', lines: [], primaryLabel: '', secondaryLabel: '', resolutionText: 'Sent to 214 parents' } },
    };
    return { title: item.title, reply: map[item.kind] };
  }

  async openStudent(name: string): Promise<ConversationSeed> {
    return { title: name, reply: { activity: [`Opening ${name}’s profile…`], text: `Here’s ${name}’s profile.`, canvas: canvases.student(name) } };
  }

  listRoles = async () => Object.values(ROLES);
  listInbox = async (role: RoleKey) => INBOX[role];
  listWork = async () => WORK;
  listAutomations = async () => AUTOMATIONS;
  listCustomize = async () => CUSTOMIZE;
  listCommands = async () => COMMANDS.map((c) => ({ ...c }));
}
