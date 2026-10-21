import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_TONES,
  APPLICATION_STATUSES,
} from '@shared/constants';
import type { Application, ApplicationStatus, Resume } from '@shared/types';
import EmptyState from '../../components/EmptyState';
import Select from '../../components/Select';
import StatusTag from '../../components/StatusTag';

interface ApplicationsTableProps {
  applications: Application[];
  resumes: Resume[];
  loading: boolean;
  onEdit: (app: Application) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: ApplicationStatus) => void;
}

const STATUS_OPTIONS = APPLICATION_STATUSES.map((s) => ({
  value: s,
  label: APPLICATION_STATUS_LABELS[s],
}));

export default function ApplicationsTable({
  applications,
  resumes,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationsTableProps) {
  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 p-8 text-sm text-gray-400">
        <span className="spinner text-gray-300" aria-hidden="true" />
        加载中…
      </div>
    );
  }
  if (applications.length === 0) {
    return (
      <EmptyState
        title="暂无投递记录"
        description="记录每一次投递，随时跟进求职进度。"
      />
    );
  }

  const resumeName = (id: number | null): string => {
    if (id === null) return '-';
    return resumes.find((r) => r.id === id)?.name ?? '-';
  };

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-gray-200 text-xs text-gray-500">
        <tr>
          <th className="px-3 py-2 font-medium">公司</th>
          <th className="px-3 py-2 font-medium">岗位</th>
          <th className="px-3 py-2 font-medium">投递日期</th>
          <th className="px-3 py-2 font-medium">渠道</th>
          <th className="px-3 py-2 font-medium">状态</th>
          <th className="px-3 py-2 font-medium">关联简历</th>
          <th className="px-3 py-2 font-medium">备注</th>
          <th className="px-3 py-2 font-medium">操作</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => (
          <tr key={app.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
            <td className="px-3 py-2 font-medium text-gray-900">{app.company}</td>
            <td className="px-3 py-2 text-gray-700">{app.position}</td>
            <td className="px-3 py-2 text-gray-700">{app.appliedDate ?? '-'}</td>
            <td className="px-3 py-2 text-gray-700">{app.channel ?? '-'}</td>
            <td className="px-3 py-2">
              <div className="flex items-center gap-2">
                <StatusTag tone={APPLICATION_STATUS_TONES[app.status]}>
                  {APPLICATION_STATUS_LABELS[app.status]}
                </StatusTag>
                <Select
                  className="w-24"
                  value={app.status}
                  onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus)}
                  options={STATUS_OPTIONS}
                />
              </div>
            </td>
            <td className="px-3 py-2 text-gray-700">{resumeName(app.resumeId)}</td>
            <td
              className="max-w-[16rem] truncate px-3 py-2 text-gray-500"
              title={app.note ?? undefined}
            >
              {app.note ?? '-'}
            </td>
            <td className="px-3 py-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(app)}
                  className="rounded-md px-2 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  编辑
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(app.id)}
                  className="rounded-md px-2 py-1 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  删除
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
