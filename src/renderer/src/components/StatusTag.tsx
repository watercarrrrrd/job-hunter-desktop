import type { ReactNode } from 'react';
import type { TagTone } from '@shared/constants';

const TONE_CLASSES: Record<TagTone, string> = {
  neutral: 'bg-gray-100 text-gray-600',
  info: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
};

interface StatusTagProps {
  tone: TagTone;
  children: ReactNode;
}

export default function StatusTag({ tone, children }: StatusTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
