import { RESUME_TEMPLATE_LABELS } from '@shared/constants';
import type { Resume } from '@shared/types';

interface ResumeListProps {
  resumes: Resume[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ResumeList({
  resumes,
  loading,
  selectedId,
  onSelect,
  onDelete,
}: ResumeListProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-md border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-3 py-2 text-xs text-gray-500">
        共 {resumes.length} 份简历
      </div>
      <div className="flex-1 overflow-auto p-2">
        {loading && resumes.length === 0 ? (
          <p className="px-2 py-4 text-sm text-gray-400">加载中…</p>
        ) : resumes.length === 0 ? (
          <p className="px-2 py-4 text-sm text-gray-400">暂无简历，点击右上角「新建简历」</p>
        ) : (
          <ul className="space-y-1">
            {resumes.map((r) => {
              const active = r.id === selectedId;
              return (
                <li
                  key={r.id}
                  className={`flex items-center rounded-md ${active ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(r.id)}
                    className="min-w-0 flex-1 px-2 py-2 text-left"
                  >
                    <span className="block truncate text-sm text-gray-800">{r.name}</span>
                    <span className="block truncate text-xs text-gray-400">
                      {RESUME_TEMPLATE_LABELS[r.templateId]}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    className="shrink-0 px-2 text-xs text-gray-400 hover:text-red-500"
                  >
                    删除
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
