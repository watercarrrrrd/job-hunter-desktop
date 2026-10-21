import { useState } from 'react';
import type { InterviewChecklist } from '@shared/types';
import Button from '../../components/Button';
import Input from '../../components/Input';

interface ChecklistSectionProps {
  items: InterviewChecklist[];
  onAdd: (content: string) => Promise<boolean>;
  onToggle: (item: InterviewChecklist) => void;
  onDelete: (id: number) => void;
}

/** 面试准备清单：展示待办、支持新增/勾选/删除 */
export default function ChecklistSection({
  items,
  onAdd,
  onToggle,
  onDelete,
}: ChecklistSectionProps) {
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);

  const submit = async () => {
    const content = draft.trim();
    if (!content || adding) return;
    setAdding(true);
    const ok = await onAdd(content);
    setAdding(false);
    if (ok) setDraft('');
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          className="flex-1"
          placeholder="添加准备事项，回车确认"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void submit();
            }
          }}
        />
        <Button variant="secondary" onClick={() => void submit()} disabled={!draft.trim()} loading={adding}>
          添加
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="mt-2 text-sm text-gray-400">暂无准备事项，添加一条开始准备</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-gray-50"
            >
              <label className="flex flex-1 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => onToggle(item)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`text-sm ${item.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}
                >
                  {item.content}
                </span>
              </label>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="ml-2 rounded-md px-1.5 py-0.5 text-xs text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
