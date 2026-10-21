import type { ReactNode } from 'react';

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-4 mb-2 border-b border-gray-200 pb-1 text-base font-semibold text-gray-900">
      {children}
    </h2>
  );
}

/** 展示起止时间区间；两者皆空时返回空字符串，避免出现孤立的「-」 */
export function range(start: string, end: string): string {
  if (!start && !end) return '';
  return [start, end].filter(Boolean).join(' - ');
}
