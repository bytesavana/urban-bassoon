import { useSchool } from '@school/core';

export function Toast() {
  const toast = useSchool((s) => s.toast);
  if (!toast) return null;
  return (
    <div role="status" className="fixed bottom-[22px] left-1/2 z-[200] -translate-x-1/2 rounded-[10px] bg-ink px-[18px] py-2.5 text-[13px] font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,.25)]">
      {toast}
    </div>
  );
}
