import type {
  Automation, CustomizeCatalog, InboxItem, RoleKey, RoleProfile, RosterStudent, WorkItem,
} from '../types';

export const SCHOOL_NAME = 'Greenview Secondary School';

export const ROLES: Record<RoleKey, RoleProfile> = {
  teacher: { key: 'teacher', name: 'Mary Chebet', firstName: 'Mary', label: 'Teacher · Mathematics', initial: 'M',
    greetingSub: 'What are you teaching today?',
    suggestions: ['Take attendance', 'Check today’s schedule', 'Analyse my class performance', 'Plan a lesson', 'Message parents'] },
  bursar: { key: 'bursar', name: 'David Mwangi', firstName: 'David', label: 'Bursar', initial: 'D',
    greetingSub: 'What should we work on financially?',
    suggestions: ['Check fee collections', 'Review unmatched payments', 'Prepare fee reminders', 'Prepare a financial summary'] },
  principal: { key: 'principal', name: 'Grace Wanjiru', firstName: 'Grace', label: 'Principal', initial: 'G',
    greetingSub: 'What would you like to know about the school?',
    suggestions: ['Analyse school performance', 'Review today’s inbox', 'Prepare the end-of-term report', 'Check attendance trends'] },
};

export const ROSTER: RosterStudent[] = [
  { id: 's1', name: 'Abigael Njeri' }, { id: 's2', name: 'Brian Mwangi' },
  { id: 's3', name: 'Catherine Wambui' }, { id: 's4', name: 'Dennis Otieno' },
  { id: 's5', name: 'Esther Chebet' }, { id: 's6', name: 'Felix Kamau' },
  { id: 's7', name: 'Grace Nduta' }, { id: 's8', name: 'Henry Kiptoo' },
  { id: 's9', name: 'Ian Mutua' }, { id: 's10', name: 'Joyce Akinyi' },
  { id: 's11', name: 'Kevin Omondi' }, { id: 's12', name: 'Wanjiku Kariuki' },
];
export const ABSENT_DEFAULT = ['s2', 's12'];

export const FEE_RECIPIENTS = [
  { name: 'Parent of Abigael Njeri', balance: 'KES 12,500' }, { name: 'Parent of Catherine Wambui', balance: 'KES 38,000' },
  { name: 'Parent of Dennis Otieno', balance: 'KES 2,500' }, { name: 'Parent of Felix Kamau', balance: 'KES 21,000' },
  { name: 'Parent of Ian Mutua', balance: 'KES 9,800' }, { name: 'Parent of Kevin Omondi', balance: 'KES 15,200' },
];

export const UNMATCHED_PAYMENTS = [
  { primary: 'M-Pesa ref QK3821', secondary: 'Received 2 Oct · no matching student reference', amount: 'KES 3,500' },
  { primary: 'M-Pesa ref QK4410', secondary: 'Received 2 Oct · amount doesn’t match any invoice', amount: 'KES 12,000' },
  { primary: 'M-Pesa ref QK4502', secondary: 'Received 1 Oct · possible duplicate of an earlier payment', amount: 'KES 2,000' },
];

export const INBOX: Record<RoleKey, InboxItem[]> = {
  principal: [
    { id: 'i1', title: '3 M-Pesa payments could not be matched', detail: 'These may affect this term’s collection accuracy.', recommendation: 'Review and match manually', severity: 'warning', kind: 'finance_unmatched' },
    { id: 'i2', title: '12 teachers have not completed attendance', detail: 'Attendance registers for today are still incomplete.', recommendation: 'Send a reminder to teachers', severity: 'warning', kind: 'attendance_nudge' },
    { id: 'i3', title: 'Form 4 Mathematics marks are incomplete', detail: '6 students are missing a mid-term score.', recommendation: 'Follow up with the subject teacher', severity: 'danger', kind: 'marks_incomplete' },
    { id: 'i4', title: '2 actions are waiting for your approval', detail: 'Fee reminders are drafted and ready to review.', recommendation: 'Review and approve', severity: 'info', kind: 'fee_approval' },
    { id: 'i5', title: '5 parent replies need review', detail: 'Parents have responded about tomorrow’s sports day.', recommendation: 'Read and respond', severity: 'info', kind: 'parent_replies' },
  ],
  teacher: [
    { id: 'i6', title: 'Form 2 Blue attendance not submitted for yesterday', detail: 'Yesterday’s register for your class is still open.', recommendation: 'Submit attendance now', severity: 'danger', kind: 'attendance_take' },
    { id: 'i7', title: '2 of your students have unresolved absences this week', detail: 'Brian Mwangi and Wanjiku Kariuki have been absent 3 days.', recommendation: 'Review their attendance', severity: 'warning', kind: 'attendance_nudge' },
    { id: 'i8', title: '1 parent reply needs your response', detail: 'A parent asked about homework for this week.', recommendation: 'Read and respond', severity: 'info', kind: 'parent_replies' },
  ],
  bursar: [
    { id: 'i9', title: '3 M-Pesa payments could not be matched', detail: 'These may affect this term’s collection accuracy.', recommendation: 'Review and match manually', severity: 'warning', kind: 'finance_unmatched' },
    { id: 'i10', title: '18 accounts have outstanding balances over 30 days', detail: 'Combined balance is KES 412,000.', recommendation: 'Prepare fee reminders', severity: 'warning', kind: 'fee_approval' },
    { id: 'i11', title: '2 actions are waiting for your approval', detail: 'Fee reminders are drafted and ready to review.', recommendation: 'Review and approve', severity: 'info', kind: 'fee_approval' },
  ],
};

export const WORK: WorkItem[] = [
  { id: 'w1', title: 'End-of-Term Report — Form 3', meta: 'Updated 2 days ago', kind: 'document' },
  { id: 'w2', title: 'Form 4 Performance Analysis', meta: 'Updated 5 days ago', kind: 'results' },
  { id: 'w3', title: '2027 Timetable Planning', meta: 'Updated 1 week ago', kind: 'timetable' },
  { id: 'w4', title: 'Fee Collection Review — Term 2', meta: 'Updated 3 days ago', kind: 'finance' },
  { id: 'w5', title: 'Sports Day Parent Communication', meta: 'Updated yesterday', kind: 'communication_done' },
];

export const AUTOMATIONS: Automation[] = [
  { id: 'au1', name: 'Daily Payment Reconciliation', purpose: 'Matches M-Pesa payments to student accounts every morning.', trigger: 'Every weekday at 8:00 AM', steps: ['Retrieve M-Pesa payments', 'Match payments to students', 'Reconcile confident matches', 'Send uncertain matches to the Finance Inbox'], lastRun: 'Today, 8:03 AM', nextRun: 'Tomorrow, 8:00 AM', status: 'active' },
  { id: 'au2', name: 'Attendance Follow-up', purpose: 'Flags teachers who have not submitted attendance.', trigger: 'Every school day at 10:00 AM', steps: ['Check submitted attendance registers', 'Identify missing classes', 'Notify the relevant teachers', 'Escalate to the principal after 11:00 AM'], lastRun: 'Today, 10:00 AM', nextRun: 'Tomorrow, 10:00 AM', status: 'active' },
  { id: 'au3', name: 'Weekly Performance Digest', purpose: 'Summarises class performance trends for the principal.', trigger: 'Every Friday at 4:00 PM', steps: ['Aggregate assessment scores', 'Compare against previous term', 'Highlight classes needing attention', 'Prepare a short summary'], lastRun: 'Last Friday, 4:00 PM', nextRun: 'This Friday, 4:00 PM', status: 'active' },
  { id: 'au4', name: 'Fee Reminder Nudges', purpose: 'Sends reminders to accounts overdue by more than 7 days.', trigger: 'Every Monday at 9:00 AM', steps: ['Find balances overdue 7+ days', 'Exclude recently reminded accounts', 'Draft personalised SMS reminders', 'Queue for bursar approval'], lastRun: 'Mon, 9:02 AM', nextRun: 'Next Monday, 9:00 AM', status: 'paused' },
];

export const CUSTOMIZE: CustomizeCatalog = {
  agents: [
    { id: 'ag1', name: 'School Agent', description: 'Coordinates every request and delegates to specialists automatically.', footer: 'Default · always on', list: ['Finance Agent', 'Academic Agent', 'Teacher Assistant'], listLabel: 'Delegates to', enabled: true, locked: true },
    { id: 'ag2', name: 'Finance Agent', description: 'Handles fees, payments, financial analysis and reconciliation.', footer: 'Finance connector · M-Pesa connector', list: ['Finance connector', 'M-Pesa connector', 'Fee Follow-Up skill'], listLabel: 'Uses', enabled: true },
    { id: 'ag3', name: 'Academic Agent', description: 'Analyses results, attendance and curriculum progress.', footer: 'Reporting skill · Gradebook', list: ['Student Performance Analysis', 'Exam Analysis', 'Reporting skill'], listLabel: 'Uses', enabled: true },
    { id: 'ag4', name: 'Teacher Assistant', description: 'Helps teachers plan lessons and manage their classes.', footer: 'CBC Lesson Planner', list: ['CBC Lesson Planner', 'Attendance Follow-Up'], listLabel: 'Uses', enabled: true },
    { id: 'ag5', name: 'Admissions Agent', description: 'Manages enquiries, applications and enrolment.', footer: 'Admissions workflow', list: ['Admissions workflow', 'Parent Communication'], listLabel: 'Uses', enabled: false },
    { id: 'ag6', name: 'Student Support Agent', description: 'Tracks wellbeing, discipline and pastoral notes.', footer: 'Pastoral records', list: ['Pastoral records'], listLabel: 'Uses', enabled: false },
  ],
  skills: [
    { id: 'sk1', name: 'CBC Lesson Planner', description: 'Drafts curriculum-aligned lesson plans in minutes.', footer: 'Teachers', list: ['Teachers', 'Heads of Department'], listLabel: 'Who can use', enabled: true },
    { id: 'sk2', name: 'Student Performance Analysis', description: 'Finds trends and outliers across assessments.', footer: 'Teachers · Principal', list: ['Teachers', 'Principal'], listLabel: 'Who can use', enabled: true },
    { id: 'sk3', name: 'End-of-Term Report Writer', description: 'Compiles academic, attendance and fee summaries.', footer: 'Principal · Admin', list: ['Principal', 'Administrators'], listLabel: 'Who can use', enabled: true },
    { id: 'sk4', name: 'Fee Follow-Up', description: 'Drafts and sends reminders for outstanding balances.', footer: 'Bursar', list: ['Bursar'], listLabel: 'Who can use', enabled: true },
    { id: 'sk5', name: 'Parent Communication', description: 'Drafts messages to parents in a consistent tone.', footer: 'All staff', list: ['Teachers', 'Bursar', 'Principal'], listLabel: 'Who can use', enabled: true },
    { id: 'sk6', name: 'Attendance Follow-Up', description: 'Chases incomplete attendance registers.', footer: 'Teachers · Principal', list: ['Teachers', 'Principal'], listLabel: 'Who can use', enabled: true },
    { id: 'sk7', name: 'Exam Analysis', description: 'Deep-dives into a subject or class exam performance.', footer: 'Teachers · Principal', list: ['Teachers', 'Principal'], listLabel: 'Who can use', enabled: true },
  ],
  plugins: [
    { id: 'pl1', name: 'M-Pesa', description: 'Adds payment matching and reconciliation tools.', footer: 'Tools · Automations', list: ['Payment lookup tool', 'Daily Payment Reconciliation'], listLabel: 'Adds', status: 'installed', enabled: true },
    { id: 'pl2', name: 'Google Classroom', description: 'Syncs assignments and classwork into the workspace.', footer: 'Tools · Interfaces', list: ['Assignment sync', 'Classwork interface'], listLabel: 'Adds', status: 'installed', enabled: true },
    { id: 'pl3', name: 'Microsoft 365', description: 'Connects email, calendar and documents.', footer: 'Connectors', list: ['Mail connector', 'Calendar connector'], listLabel: 'Adds', status: 'not installed', enabled: false },
    { id: 'pl4', name: 'School Transport', description: 'Adds route planning and pickup notifications.', footer: 'Tools · Automations', list: ['Route planner', 'Pickup notifications'], listLabel: 'Adds', status: 'not installed', enabled: false },
    { id: 'pl5', name: 'Cambridge Curriculum', description: 'Adds Cambridge-aligned assessment and reporting tools.', footer: 'Skills', list: ['Cambridge Report Writer'], listLabel: 'Adds', status: 'not installed', enabled: false },
    { id: 'pl6', name: 'SMS Provider', description: 'Sends SMS reminders and announcements to parents.', footer: 'Tools', list: ['SMS sending tool'], listLabel: 'Adds', status: 'installed', enabled: true },
  ],
  connectors: [
    { id: 'co1', name: 'M-Pesa', description: 'Payment transactions and reconciliation data.', footer: 'Finance Agent', list: ['Finance Agent', 'Daily Payment Reconciliation'], listLabel: 'Used by', status: 'connected', enabled: true },
    { id: 'co2', name: 'Google Workspace', description: 'Staff email, documents and calendar.', footer: 'School Agent', list: ['School Agent'], listLabel: 'Used by', status: 'connected', enabled: true },
    { id: 'co3', name: 'WhatsApp', description: 'Parent messaging channel.', footer: 'Not connected', list: ['Parent Communication'], listLabel: 'Would be used by', status: 'not connected', enabled: false },
    { id: 'co4', name: 'Google Classroom', description: 'Assignments and classwork.', footer: 'Teacher Assistant', list: ['Teacher Assistant'], listLabel: 'Used by', status: 'connected', enabled: true },
    { id: 'co5', name: 'SMS Provider', description: 'Outbound SMS to parents.', footer: 'Finance Agent', list: ['Finance Agent', 'Fee Follow-Up'], listLabel: 'Used by', status: 'connected', enabled: true },
  ],
};

export const COMMANDS = [
  { type: 'Student', label: 'Brian Mwangi', sub: 'Form 3 East' },
  { type: 'Student', label: 'Wanjiku Kariuki', sub: 'Form 2 Blue' },
  { type: 'Teacher', label: 'Mary Chebet', sub: 'Mathematics' },
  { type: 'Automation', label: 'Daily Payment Reconciliation', sub: 'Active' },
  { type: 'Automation', label: 'Fee Reminder Nudges', sub: 'Paused' },
  { type: 'Skill', label: 'Student Performance Analysis', sub: 'Skill' },
  { type: 'Command', label: 'Take Form 1 attendance', sub: 'Run command' },
  { type: 'Command', label: 'Open fee report', sub: 'Run command' },
  { type: 'Command', label: 'Create automation', sub: 'Run command' },
] as const;

export const CONTEXT_SAMPLES: Record<string, string> = {
  Student: 'Brian Mwangi', Class: 'Form 3 East', Teacher: 'Mary Chebet', Subject: 'Mathematics',
  Assessment: 'Mid-Term Exam', Term: 'Term 2', Document: 'Fee Policy.pdf', Invoice: 'INV-2291', Report: 'End-of-Term Report',
};
