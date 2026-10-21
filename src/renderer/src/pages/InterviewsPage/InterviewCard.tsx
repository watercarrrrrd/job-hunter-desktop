import {
  INTERVIEW_RESULT_LABELS,
  INTERVIEW_RESULT_TONES,
} from '@shared/constants';
import type {
  Application,
  Interview,
  InterviewChecklist,
  InterviewResult,
} from '@shared/types';
import Button from '../../components/Button';
import StatusTag from '../../components/StatusTag';
import { formatDateTime, formatTime } from '../../lib/format';
import { isUpcoming } from '../../lib/interviews';
import ChecklistSection from './ChecklistSection';
import ReviewSection from './ReviewSection';

interface InterviewCardProps {
  interview: Interview;
  application: Application | null;
  checklist: InterviewChecklist[];
  expanded: boolean;
  savingReview: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddChecklist: (content: string) => Promise<boolean>;
  onToggleChecklist: (item: InterviewChecklist) => void;
  onRemoveChecklist: (id: number) => void;
  onSaveReview: (result: InterviewResult, review: string) => void;
}

export default function InterviewCard({
  interview,
  application,
  checklist,
  expanded,
  savingReview,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddChecklist,
  onToggleChecklist,
  onRemoveChecklist,
  onSaveReview,
}: InterviewCardProps) {
  const upcoming = isUpcoming(interview.scheduledAt);
  const title = application
    ? `${application.company} - ${application.position}`
    : '已删除的投递记录';

  return (
    <div
      className={`rounded-lg border bg-white ${
        upcoming ? 'border-blue-200 border-l-4 border-l-blue-500' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">{title}</p>
            <p className="mt-0.5 text-xs text-gray-500">
              {interview.round ? `${interview.round} · ` : ''}
              {interview.type ?? '未填写形式'}
              {interview.interviewer ? ` · 面试官：${interview.interviewer}` : ''}
            </p>
          </div>
          <StatusTag tone={INTERVIEW_RESULT_TONES[interview.result]}>
            {INTERVIEW_RESULT_LABELS[interview.result]}
          </StatusTag>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            {interview.scheduledAt ? (
              <>
                <p
                  className={`text-sm font-semibold ${
                    upcoming ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {formatTime(interview.scheduledAt)}
                </p>
                <p className="text-xs text-gray-500">{formatDateTime(interview.scheduledAt)}</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">未安排时间</p>
            )}
          </div>
          <Button size="sm" variant="secondary" onClick={onToggleExpand}>
            {expanded ? '收起' : '展开'}
          </Button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-md px-2 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
          >
            编辑
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md px-2 py-1 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            删除
          </button>
        </div>
      </div>

      {interview.location && (
        <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-600">
          地点 / 链接：{interview.location}
        </div>
      )}

      {expanded && (
        <div className="space-y-4 border-t border-gray-100 px-4 py-4">
          <section>
            <h4 className="mb-2 text-sm font-medium text-gray-700">准备清单</h4>
            <ChecklistSection
              items={checklist}
              onAdd={onAddChecklist}
              onToggle={onToggleChecklist}
              onDelete={onRemoveChecklist}
            />
          </section>
          <section>
            <h4 className="mb-2 text-sm font-medium text-gray-700">面试复盘</h4>
            <ReviewSection interview={interview} saving={savingReview} onSave={onSaveReview} />
          </section>
        </div>
      )}
    </div>
  );
}
