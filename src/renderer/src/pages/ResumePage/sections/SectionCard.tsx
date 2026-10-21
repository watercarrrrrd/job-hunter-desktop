import { useState, type ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  onRemove?: () => void;
  defaultOpen?: boolean;
  children: ReactNode;
}

/** 通用分区卡片：标题行（可折叠）+ 可选删除按钮 + 内容区 */
export default function SectionCard({
  title,
  onRemove,
  defaultOpen = true,
  children,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-sm font-medium text-gray-800"
        >
          {title}
        </button>
        <div className="flex items-center gap-2">
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-red-500 hover:text-red-700"
            >
              删除
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            {open ? '收起' : '展开'}
          </button>
        </div>
      </div>
      {open && <div className="border-t border-gray-100 px-3 py-3">{children}</div>}
    </div>
  );
}
