import { useState } from 'react';
import type { InterviewChecklist } from '@shared/types';
import Input from '../../components/Input';

interface ChecklistSectionProps {
  items: InterviewChecklist[];
  onAdd: (content: string) => void;
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

  const submit = () => {
    const content = draft.trim();
    if (!content) return;
    onAdd(content);
    setDraft('');
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
              submit();
            }
          }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={!draft.trim()}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          添加
        </button>
      </div>

      {items.length === 0 ? (
        <p className="mt-2 text-sm text-gray-400">暂无准备事项</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-gray-50"
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
                className="ml-2 text-xs text-red-500 hover:text-red-700"
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
