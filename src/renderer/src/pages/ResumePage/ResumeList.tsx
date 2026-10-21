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
    <aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-3 py-2 text-xs text-gray-500">
        共 {resumes.length} 份简历
      </div>
      <div className="flex-1 overflow-auto p-2">
        {loading && resumes.length === 0 ? (
          <div className="flex items-center justify-center gap-2 px-2 py-6 text-sm text-gray-400">
            <span className="spinner text-gray-300" aria-hidden="true" />
            加载中…
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-8 text-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              className="mb-2 h-8 w-8 text-gray-300"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
              />
            </svg>
            <p className="text-xs text-gray-500">暂无简历</p>
            <p className="mt-0.5 text-xs text-gray-400">点击「新建简历」开始</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {resumes.map((r) => {
              const active = r.id === selectedId;
              return (
                <li
                  key={r.id}
                  className={`flex items-center rounded-lg transition-colors ${
                    active ? 'bg-blue-50' : 'hover:bg-gray-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(r.id)}
                    className="min-w-0 flex-1 px-2 py-2 text-left"
                  >
                    <span
                      className={`block truncate text-sm ${
                        active ? 'font-medium text-blue-700' : 'text-gray-800'
                      }`}
                    >
                      {r.name}
                    </span>
                    <span className="block truncate text-xs text-gray-400">
                      {RESUME_TEMPLATE_LABELS[r.templateId]}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    className="shrink-0 rounded-md px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label={`删除简历 ${r.name}`}
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
