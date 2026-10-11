export type RoleKey = 'principal' | 'teacher' | 'bursar';
export type ViewKey = 'home' | 'conversation' | 'inbox' | 'work' | 'automations' | 'customize';
export type CustomizeTab = 'agents' | 'skills' | 'plugins' | 'connectors';

export interface RoleProfile {
  key: RoleKey;
  name: string;
  firstName: string;
  label: string;
  initial: string;
  greetingSub: string;
  suggestions: string[];
}

// ---------- canvas (typed artifacts rendered beside the conversation) ----------
export interface RosterStudent { id: string; name: string }

export interface AttendanceCanvas {
  type: 'attendance';
  className: string;
  date: string;
  roster: RosterStudent[];
  absentIds: string[];
  saved: boolean;
}
export interface ResultsCanvas {
  type: 'results';
  kicker: string;
  title: string;
  subtitle: string;
  bars: { label: string; pct: number; delta: number }[];
  students: { name: string; classLabel: string; score: string; delta: number }[];
}
export interface FinanceCanvas {
  type: 'finance';
  title: string;
  subtitle: string;
  rows: { primary: string; secondary: string; amount: string }[];
}
export interface StudentCanvas {
  type: 'student';
  name: string;
  firstName: string;
  classLabel: string;
  studentId: string;
  sections: { label: string; value: string }[];
}
export interface DocumentCanvas {
  type: 'document';
  title: string;
  subtitle: string;
  sections: { heading: string; preview: string }[];
}
export interface TimetableCanvas {
  type: 'timetable';
  title: string;
  subtitle: string;
  days: string[];
  rows: { period: string; cells: string[] }[];
}
export type Canvas =
  | AttendanceCanvas | ResultsCanvas | FinanceCanvas | StudentCanvas | DocumentCanvas | TimetableCanvas;

export const CANVAS_KICKER: Record<Canvas['type'], string> = {
  attendance: 'Attendance', results: 'Results', finance: 'Finance',
  student: 'Student', document: 'Document', timetable: 'Timetable',
};

// ---------- conversation ----------
export interface Approval {
  kind: 'fee_reminder' | 'communication' | 'done';
  title: string;
  lines: string[];
  status: 'pending' | 'resolved';
  primaryLabel: string;
  secondaryLabel: string;
  /** Shown on resolve. */
  resolutionText: string;
  /** If set, the secondary button opens this canvas; otherwise it shows a toast. */
  secondaryCanvas?: Canvas;
}
export interface Message {
  id: number;
  role: 'user' | 'ai';
  text?: string | null;
  activity?: string[];
  approval?: Approval;
}
export interface Conversation {
  title: string;
  messages: Message[];
  canvas: Canvas | null;
  nextId: number;
}

// ---------- lists ----------
export type InboxKind =
  | 'finance_unmatched' | 'attendance_nudge' | 'marks_incomplete'
  | 'fee_approval' | 'parent_replies' | 'attendance_take';
export interface InboxItem {
  id: string; title: string; detail: string; recommendation: string;
  severity: 'warning' | 'danger' | 'info'; kind: InboxKind;
}
export type WorkKind = 'document' | 'results' | 'timetable' | 'finance' | 'communication_done';
export interface WorkItem { id: string; title: string; meta: string; kind: WorkKind }

export interface Automation {
  id: string; name: string; purpose: string; trigger: string; steps: string[];
  lastRun: string; nextRun: string; status: 'active' | 'paused';
}
export interface CustomizeItem {
  id: string; name: string; description: string; footer: string;
  list: string[]; listLabel: string; enabled: boolean; locked?: boolean;
  status?: 'installed' | 'not installed' | 'connected' | 'not connected';
}
export type CustomizeCatalog = Record<CustomizeTab, CustomizeItem[]>;

export interface CommandEntry { type: 'Student' | 'Teacher' | 'Automation' | 'Skill' | 'Command'; label: string; sub: string }

// ---------- agent contract (Mock today, HTTP/SSE to FastAPI + LangGraph later) ----------
export interface AgentReply {
  activity?: string[];
  text?: string | null;
  approval?: Approval;
  /** undefined = leave current canvas unchanged; null = clear it. */
  canvas?: Canvas | null;
}
export interface ConversationSeed { title: string; reply: AgentReply }

export interface AgentClient {
  respond(input: { text: string; role: RoleKey; focusStudent?: string }): Promise<AgentReply>;
  openInboxItem(item: InboxItem): Promise<ConversationSeed>;
  openWorkItem(item: WorkItem): Promise<ConversationSeed>;
  openStudent(name: string): Promise<ConversationSeed>;
  listRoles(): Promise<RoleProfile[]>;
  listInbox(role: RoleKey): Promise<InboxItem[]>;
  listWork(role: RoleKey): Promise<WorkItem[]>;
  listAutomations(): Promise<Automation[]>;
  listCustomize(): Promise<CustomizeCatalog>;
  listCommands(): Promise<CommandEntry[]>;
}
