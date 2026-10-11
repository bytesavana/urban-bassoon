import { useEffect } from 'react';
import { useSchool } from '@school/core';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { CommandPalette } from './components/CommandPalette';
import { Toast } from './components/Toast';
import { useIsNarrow } from './hooks';
import { HomeView } from './views/HomeView';
import { ConversationView } from './views/ConversationView';
import { InboxView, WorkView } from './views/ListViews';
import { AutomationsView } from './views/AutomationsView';
import { CustomizeView } from './views/CustomizeView';

export function App() {
  const view = useSchool((s) => s.view);
  const init = useSchool((s) => s.init);
  const setCommandOpen = useSchool((s) => s.setCommandOpen);
  const narrow = useIsNarrow();

  useEffect(() => { void init(); }, [init]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(!useSchool.getState().commandOpen);
      } else if (e.key === 'Escape' && useSchool.getState().commandOpen) setCommandOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCommandOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg text-ink">
      <Sidebar narrow={narrow} />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {view === 'home' && <HomeView />}
          {view === 'conversation' && <ConversationView narrow={narrow} />}
          {view === 'inbox' && <InboxView />}
          {view === 'work' && <WorkView />}
          {view === 'automations' && <AutomationsView />}
          {view === 'customize' && <CustomizeView />}
        </div>
      </div>
      <CommandPalette />
      <Toast />
    </div>
  );
}
