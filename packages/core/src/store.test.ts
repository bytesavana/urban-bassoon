import { describe, expect, it } from 'vitest';
import { MockAgentClient } from './mock/mockAgentClient';
import { createSchoolStore } from './store';

const make = () => createSchoolStore(new MockAgentClient(0));

describe('school store', () => {
  it('routes "take attendance" to an attendance canvas and lets you toggle + save', async () => {
    const s = make();
    await s.getState().init();
    s.getState().setHomeDraft('Take attendance');
    await s.getState().submitHome();
    const c = s.getState().conversation!;
    expect(c.canvas?.type).toBe('attendance');
    s.getState().toggleAttendance('s1');
    expect(s.getState().conversation!.canvas).toMatchObject({ absentIds: ['s2', 's12', 's1'] });
    s.getState().setAttendanceSaved(true);
    s.getState().toggleAttendance('s3'); // ignored once saved
    expect(s.getState().conversation!.canvas).toMatchObject({ saved: true, absentIds: ['s2', 's12', 's1'] });
  });

  it('fee reminder approval can review recipients then resolve', async () => {
    const s = make();
    await s.getState().init();
    s.getState().setHomeDraft('Prepare fee reminders');
    await s.getState().submitHome();
    const msg = s.getState().conversation!.messages[1]!;
    expect(msg.approval?.status).toBe('pending');
    s.getState().approvalSecondary(msg.id);
    expect(s.getState().conversation!.canvas?.type).toBe('finance');
    s.getState().resolveApproval(msg.id);
    expect(s.getState().conversation!.messages[1]!.approval?.status).toBe('resolved');
  });

  it('cycles roles and loads that role’s inbox', async () => {
    const s = make();
    await s.getState().init();
    expect(s.getState().inbox).toHaveLength(5);
    s.getState().cycleRole();
    await new Promise((r) => setTimeout(r, 5));
    expect(s.getState().role).toBe('teacher');
    expect(s.getState().inbox).toHaveLength(3);
  });

  it('locked agents cannot be toggled; others can', async () => {
    const s = make();
    await s.getState().init();
    const [locked, other] = s.getState().customize.agents;
    s.getState().toggleCustomize(locked!);
    expect(s.getState().customizeOverrides).toEqual({});
    s.getState().toggleCustomize(other!);
    expect(s.getState().customizeOverrides[other!.id]).toBe(false);
  });
});
