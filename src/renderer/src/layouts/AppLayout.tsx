import type { ReactNode } from 'react';
import { NAV_ITEMS, type PageKey } from '../router';

interface AppLayoutProps {
  activeKey: PageKey;
  onNavigate: (key: PageKey) => void;
  children: ReactNode;
}

export default function AppLayout({ activeKey, onNavigate, children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <aside className="flex w-52 shrink-0 flex-col border-r border-gray-200 bg-white">
        <div className="px-5 py-5 text-lg font-semibold text-blue-600">JobHunter</div>
        <nav className="flex-1 space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const active = item.key === activeKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                className={
                  active
                    ? 'block w-full rounded-md bg-blue-50 px-3 py-2 text-left text-sm font-medium text-blue-600'
                    : 'block w-full rounded-md px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100'
                }
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
