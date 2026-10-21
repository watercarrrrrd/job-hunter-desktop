import { useMemo, useState } from 'react';
import type { CreateInterviewInput, Interview, InterviewResult } from '@shared/types';
import Button from '../../components/Button';
import Confirm from '../../components/Confirm';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../components/Toast';
import { useApplications } from '../../hooks/useApplications';
import { useInterviews } from '../../hooks/useInterviews';
import { isUpcoming, sortInterviews } from '../../lib/interviews';
import InterviewCard from './InterviewCard';
import InterviewFormModal from './InterviewFormModal';

export default function InterviewsPage() {
  const {
    interviews,
    loading,
    error,
    checklistByInterview,
    create,
    update,
    updateResult,
    remove,
    loadChecklist,
    addChecklist,
    toggleChecklist,
    removeChecklist,
  } = useInterviews();
  // 复用投递数据 hook，用于关联投递下拉与卡片标题解析
  const { applications } = useApplications();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Interview | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [savingReviewId, setSavingReviewId] = useState<number | null>(null);

  const sorted = useMemo(() => sortInterviews(interviews), [interviews]);
  const upcoming = sorted.filter((i) => isUpcoming(i.scheduledAt));
  const others = sorted.filter((i) => !isUpcoming(i.scheduledAt));

  const applicationOf = (id: number) => applications.find((a) => a.id === id) ?? null;

  function openCreate(): void {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(interview: Interview): void {
    setEditing(interview);
    setModalOpen(true);
  }

  async function handleSubmit(input: CreateInterviewInput, id: number | null): Promise<void> {
    setSaving(true);
    const result =
      id === null
        ? await create(input)
        : await update({
            id,
            round: input.round,
            type: input.type,
            scheduledAt: input.scheduledAt,
            location: input.location,
            interviewer: input.interviewer,
            note: input.note,
          });
    setSaving(false);

    if (result) {
      toast.success(id === null ? '面试已创建' : '面试已更新');
      setModalOpen(false);
    } else {
      toast.error('保存失败，请重试');
    }
  }

  function toggleExpand(id: number): void {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      void loadChecklist(id);
    }
  }

  async function handleSaveReview(
    id: number,
    result: InterviewResult,
    review: string,
  ): Promise<void> {
    setSavingReviewId(id);
    const updated = await updateResult(id, result, review || null);
    setSavingReviewId(null);
    if (updated) {
      toast.success('复盘已保存');
    } else {
      toast.error('复盘保存失败，请重试');
    }
  }

  async function handleAddChecklist(id: number, content: string): Promise<boolean> {
    const ok = await addChecklist(id, content);
    if (ok) {
      toast.success('准备事项已添加');
    } else {
      toast.error('添加失败，请重试');
    }
    return ok;
  }

  async function handleRemoveChecklist(id: number): Promise<void> {
    const ok = await removeChecklist(id);
    if (!ok) {
      toast.error('删除失败，请重试');
    }
  }

  async function confirmDelete(): Promise<void> {
    if (deleteId === null) return;
    setDeleting(true);
    const ok = await remove(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (ok) {
      toast.success('面试已删除');
    } else {
      toast.error('删除失败，请重试');
    }
  }

  const renderCard = (interview: Interview) => (
    <InterviewCard
      key={interview.id}
      interview={interview}
      application={applicationOf(interview.applicationId)}
      checklist={checklistByInterview[interview.id] ?? []}
      expanded={expandedId === interview.id}
      savingReview={savingReviewId === interview.id}
      onToggleExpand={() => toggleExpand(interview.id)}
      onEdit={() => openEdit(interview)}
      onDelete={() => setDeleteId(interview.id)}
      onAddChecklist={(content) => handleAddChecklist(interview.id, content)}
      onToggleChecklist={toggleChecklist}
      onRemoveChecklist={(id) => void handleRemoveChecklist(id)}
      onSaveReview={(result, review) => void handleSaveReview(interview.id, result, review)}
    />
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">面试管理</h1>
        <Button onClick={openCreate}>新建面试</Button>
      </div>

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-4 flex-1 space-y-6 overflow-auto pb-4">
        {loading && interviews.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
            <span className="spinner text-gray-300" aria-hidden="true" />
            加载中…
          </div>
        ) : interviews.length === 0 ? (
          <EmptyState title="暂无面试记录" description="新建面试并关联投递，面试前用清单做好充分准备。" />
        ) : (
          <>
            {upcoming.length > 0 && (
              <section>
                <h2 className="mb-2 text-sm font-medium text-gray-500">即将到来</h2>
                <div className="space-y-3">{upcoming.map(renderCard)}</div>
              </section>
            )}

            {others.length > 0 && (
              <section>
                <h2 className="mb-2 text-sm font-medium text-gray-500">已过去 / 未安排</h2>
                <div className="space-y-3">{others.map(renderCard)}</div>
              </section>
            )}
          </>
        )}
      </div>

      <InterviewFormModal
        open={modalOpen}
        editing={editing}
        applications={applications}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <Confirm
        open={deleteId !== null}
        title="删除面试"
        message="确定删除该面试记录？关联的准备清单也会一并删除。"
        confirmText="删除"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
