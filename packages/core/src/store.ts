import { create } from 'zustand';
import type {
  AgentClient, AgentReply, Automation, CommandEntry, Conversation, CustomizeCatalog, CustomizeItem, CustomizeTab,
  InboxItem, Message, RoleKey, RoleProfile, ViewKey, WorkItem,
} from './types';
import { ROLES } from './mock/data';

const ROLE_ORDER: RoleKey[] = ['principal', 'teacher', 'bursar'];

export interface SchoolState {
  // data (loaded through the AgentClient)
  roles: Record<RoleKey, RoleProfile>;
  inbox: InboxItem[];
  work: WorkItem[];
  automations: Automation[];
  customize: CustomizeCatalog;
  commands: CommandEntry[];
  // ui
  view: ViewKey;
  role: RoleKey;
  homeDraft: string;
  contextChips: string[];
  conversation: Conversation | null;
  thinking: boolean;
  commandOpen: boolean;
  commandQuery: string;
  customizeTab: CustomizeTab;
  customizeSelectedId: string | null;
  customizeOverrides: Record<string, boolean>;
  automationOverrides: Record<string, 'active' | 'paused'>;
  automationSelectedId: string | null;
  toast: string | null;

  init(): Promise<void>;
  setView(view: ViewKey): void;
  newTask(): void;
  cycleRole(): void;
  setHomeDraft(text: string): void;
  addContext(label: string): void;
  removeContext(index: number): void;
  submitHome(): Promise<void>;
  sendReply(text: string, opts?: { focusStudent?: string }): Promise<void>;
  closeCanvas(): void;
  toggleAttendance(studentId: string): void;
  setAttendanceSaved(saved: boolean): void;
  resolveApproval(messageId: number): void;
  approvalSecondary(messageId: number): void;
  openInboxItem(item: InboxItem): Promise<void>;
  openWorkItem(item: WorkItem): Promise<void>;
  openStudent(name: string): Promise<void>;
  runCommand(entry: CommandEntry): Promise<void>;
  setCommandOpen(open: boolean): void;
  setCommandQuery(q: string): void;
  setCustomizeTab(tab: CustomizeTab): void;
  selectCustomize(id: string | null): void;
  toggleCustomize(item: CustomizeItem): void;
  selectAutomation(id: string | null): void;
  toggleAutomation(a: Automation): void;
  showToast(text: string): void;
}

const aiMessage = (id: number, reply: AgentReply): Message => ({
  id, role: 'ai', activity: reply.activity, text: reply.text ?? null, approval: reply.approval,
});

export function greeting(role: RoleProfile, date = new Date()): string {
  const h = date.getHours();
  const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  return `Good ${part}, ${role.firstName}.`;
}

export function isCustomizeEnabled(item: CustomizeItem, overrides: Record<string, boolean>): boolean {
  return overrides[item.id] ?? item.enabled;
}
export function effectiveAutomationStatus(a: Automation, overrides: Record<string, 'active' | 'paused'>) {
  return overrides[a.id] ?? a.status;
}

export function createSchoolStore(client: AgentClient) {
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  /** Bumped whenever the conversation is replaced, so late replies from an old one are dropped. */
  let epoch = 0;

  return create<SchoolState>((set, get) => {
    const loadRoleData = async (role: RoleKey) => {
      const [inbox, work] = await Promise.all([client.listInbox(role), client.listWork(role)]);
      if (get().role === role) set({ inbox, work });
    };
    const startConversation = (title: string, reply: AgentReply, userText?: string) => {
      epoch++;
      const messages: Message[] = [];
      if (userText) messages.push({ id: 1, role: 'user', text: userText });
      messages.push(aiMessage(messages.length + 1, reply));
      set({ view: 'conversation', conversation: { title, messages, canvas: reply.canvas ?? null, nextId: messages.length + 1 } });
    };
    const patchConversation = (fn: (c: Conversation) => Conversation) => {
      const c = get().conversation;
      if (c) set({ conversation: fn(c) });
    };
    const send = async (text: string, focusStudent?: string) => {
      const c = get().conversation;
      if (!c || get().thinking) return;
      const myEpoch = epoch;
      const userMsg: Message = { id: c.nextId, role: 'user', text };
      set({ thinking: true, conversation: { ...c, messages: [...c.messages, userMsg], nextId: c.nextId + 1 } });
      const reply = await client.respond({ text, role: get().role, focusStudent });
      if (myEpoch !== epoch) return;
      set({ thinking: false });
      patchConversation((cur) => ({
        ...cur,
        messages: [...cur.messages, aiMessage(cur.nextId, reply)],
        canvas: reply.canvas === undefined ? cur.canvas : reply.canvas,
        nextId: cur.nextId + 1,
      }));
    };

    return {
      roles: ROLES,
      inbox: [], work: [], automations: [], commands: [],
      customize: { agents: [], skills: [], plugins: [], connectors: [] },
      view: 'home', role: 'principal', homeDraft: '', contextChips: [], conversation: null, thinking: false,
      commandOpen: false, commandQuery: '', customizeTab: 'agents', customizeSelectedId: null,
      customizeOverrides: {}, automationOverrides: {}, automationSelectedId: null, toast: null,

      async init() {
        const [roleList, automations, customize, commands] = await Promise.all([
          client.listRoles(), client.listAutomations(), client.listCustomize(), client.listCommands(),
        ]);
        const roles = Object.fromEntries(roleList.map((r) => [r.key, r])) as Record<RoleKey, RoleProfile>;
        set({ roles, automations, customize, commands });
        await loadRoleData(get().role);
      },
      setView: (view) => set({ view }),
      newTask: () => { epoch++; set({ view: 'home', conversation: null, thinking: false }); },
      cycleRole() {
        const next = ROLE_ORDER[(ROLE_ORDER.indexOf(get().role) + 1) % ROLE_ORDER.length]!;
        epoch++;
        set({ role: next, view: 'home', conversation: null, thinking: false, inbox: [] });
        void loadRoleData(next);
      },
      setHomeDraft: (homeDraft) => set({ homeDraft }),
      addContext: (label) => set((s) => ({ contextChips: [...s.contextChips, label] })),
      removeContext: (i) => set((s) => ({ contextChips: s.contextChips.filter((_, idx) => idx !== i) })),

      async submitHome() {
        const text = get().homeDraft.trim();
        if (!text || get().thinking) return;
        const myEpoch = ++epoch;
        const userMsg: Message = { id: 1, role: 'user', text };
        set({ view: 'conversation', homeDraft: '', contextChips: [], thinking: true,
          conversation: { title: text, messages: [userMsg], canvas: null, nextId: 2 } });
        const reply = await client.respond({ text, role: get().role });
        if (myEpoch !== epoch) return;
        set({ thinking: false });
        patchConversation((cur) => ({ ...cur, messages: [...cur.messages, aiMessage(2, reply)], canvas: reply.canvas ?? null, nextId: 3 }));
      },
      sendReply: (text, opts) => (text.trim() ? send(text.trim(), opts?.focusStudent) : Promise.resolve()),
      closeCanvas: () => patchConversation((c) => ({ ...c, canvas: null })),

      toggleAttendance(studentId) {
        patchConversation((c) => {
          const cv = c.canvas;
          if (!cv || cv.type !== 'attendance' || cv.saved) return c;
          const absentIds = cv.absentIds.includes(studentId) ? cv.absentIds.filter((x) => x !== studentId) : [...cv.absentIds, studentId];
          return { ...c, canvas: { ...cv, absentIds } };
        });
      },
      setAttendanceSaved(saved) {
        patchConversation((c) => (c.canvas?.type === 'attendance' ? { ...c, canvas: { ...c.canvas, saved } } : c));
        if (saved) get().showToast('Attendance saved');
      },
      resolveApproval(messageId) {
        patchConversation((c) => ({
          ...c,
          messages: c.messages.map((m) => (m.id === messageId && m.approval ? { ...m, approval: { ...m.approval, status: 'resolved' } } : m)),
        }));
      },
      approvalSecondary(messageId) {
        const c = get().conversation;
        const approval = c?.messages.find((m) => m.id === messageId)?.approval;
        if (approval?.secondaryCanvas) patchConversation((cur) => ({ ...cur, canvas: approval.secondaryCanvas ?? null }));
        else get().showToast('Opening editor…');
      },

      async openInboxItem(item) { const s = await client.openInboxItem(item); startConversation(s.title, s.reply); },
      async openWorkItem(item) { const s = await client.openWorkItem(item); startConversation(s.title, s.reply); },
      async openStudent(name) { const s = await client.openStudent(name); startConversation(s.title, s.reply); },
      async runCommand(entry) {
        set({ commandOpen: false, commandQuery: '' });
        if (entry.type === 'Student') await get().openStudent(entry.label);
        else if (entry.type === 'Automation') set({ view: 'automations' });
        else if (entry.type === 'Skill') set({ view: 'customize', customizeTab: 'skills', customizeSelectedId: null });
        else set({ homeDraft: entry.label, view: 'home' });
      },
      setCommandOpen: (commandOpen) => set(commandOpen ? { commandOpen } : { commandOpen, commandQuery: '' }),
      setCommandQuery: (commandQuery) => set({ commandQuery }),

      setCustomizeTab: (customizeTab) => set({ customizeTab, customizeSelectedId: null }),
      selectCustomize: (customizeSelectedId) => set({ customizeSelectedId }),
      toggleCustomize(item) {
        if (item.locked) return get().showToast('This agent is always on');
        set((s) => ({ customizeOverrides: { ...s.customizeOverrides, [item.id]: !isCustomizeEnabled(item, s.customizeOverrides) } }));
      },
      selectAutomation: (automationSelectedId) => set({ automationSelectedId }),
      toggleAutomation(a) {
        set((s) => ({ automationOverrides: { ...s.automationOverrides, [a.id]: effectiveAutomationStatus(a, s.automationOverrides) === 'active' ? 'paused' : 'active' } }));
      },
      showToast(text) {
        set({ toast: text });
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => set({ toast: null }), 2600);
      },
    };
  });
}

export type SchoolStore = ReturnType<typeof createSchoolStore>;
