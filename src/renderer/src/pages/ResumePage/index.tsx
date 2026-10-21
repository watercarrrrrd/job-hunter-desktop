import { useRef, useState } from 'react';
import { RESUME_TEMPLATE_LABELS, RESUME_TEMPLATES } from '@shared/constants';
import type { Resume, ResumeContent, ResumeTemplateId } from '@shared/types';
import Button from '../../components/Button';
import Confirm from '../../components/Confirm';
import EmptyState from '../../components/EmptyState';
import Select from '../../components/Select';
import { useToast } from '../../components/Toast';
import { useResumes } from '../../hooks/useResumes';
import { DEFAULT_TEMPLATE, emptyResumeContent } from '../../lib/resume';
import { exportResumeToPdf } from '../../pdf/resumePdf';
import ResumeEditor from './ResumeEditor';
import ResumeList from './ResumeList';
import ResumePreview from './ResumePreview';

type Mode = 'edit' | 'preview';

interface Draft {
  id: number | null;
  name: string;
  templateId: ResumeTemplateId;
  content: ResumeContent;
}

const TEMPLATE_OPTIONS = RESUME_TEMPLATES.map((t) => ({
  value: t,
  label: RESUME_TEMPLATE_LABELS[t],
}));

export default function ResumePage() {
  const { resumes, loading, error, create, update, remove } = useResumes();
  const toast = useToast();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>('preview');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // 深拷贝列表项为编辑草稿，避免编辑态直接改动列表对象
  function toDraft(r: Resume): Draft {
    return {
      id: r.id,
      name: r.name,
      templateId: r.templateId,
      content: JSON.parse(JSON.stringify(r.content)) as ResumeContent,
    };
  }

  function handleSelect(id: number): void {
    const r = resumes.find((x) => x.id === id);
    if (!r) return;
    setSelectedId(id);
    setDraft(toDraft(r));
    setMode('preview');
  }

  function handleNew(): void {
    setSelectedId(null);
    setDraft({ id: null, name: '', templateId: DEFAULT_TEMPLATE, content: emptyResumeContent() });
    setMode('edit');
  }

  async function handleSave(): Promise<void> {
    if (!draft || !draft.name.trim() || saving) return;
    setSaving(true);
    const name = draft.name.trim();

    if (draft.id === null) {
      const created = await create({ name, templateId: draft.templateId, content: draft.content });
      if (created) {
        setSelectedId(created.id);
        setDraft(toDraft(created));
        setMode('preview');
        toast.success('简历已创建');
      } else {
        toast.error('保存失败，请重试');
      }
    } else {
      const updated = await update({
        id: draft.id,
        name,
        templateId: draft.templateId,
        content: draft.content,
      });
      if (updated) {
        setSelectedId(updated.id);
        setDraft(toDraft(updated));
        setMode('preview');
        toast.success('简历已保存');
      } else {
        toast.error('保存失败，请重试');
      }
    }
    setSaving(false);
  }

  async function confirmDelete(): Promise<void> {
    if (deleteId === null) return;
    setDeleting(true);
    const ok = await remove(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (ok) {
      if (deleteId === selectedId) {
        setSelectedId(null);
        setDraft(null);
        setMode('preview');
      }
      toast.success('简历已删除');
    } else {
      toast.error('删除失败，请重试');
    }
  }

  async function handleExport(): Promise<void> {
    if (!draft || !previewRef.current || exporting) return;
    setExporting(true);
    const fileName = `${draft.name.trim() || '简历'}.pdf`;
    const path = await exportResumeToPdf(previewRef.current, fileName);
    setExporting(false);
    if (path) {
      toast.success('PDF 已导出');
    } else {
      toast.error('导出失败，请重试');
    }
  }

  const modeBtn = (value: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(value)}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        mode === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">简历管理</h1>
        <Button onClick={handleNew}>新建简历</Button>
      </div>

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-4 flex flex-1 gap-4 overflow-hidden">
        <ResumeList
          resumes={resumes}
          loading={loading}
          selectedId={selectedId}
          onSelect={handleSelect}
          onDelete={(id) => setDeleteId(id)}
        />

        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
          {draft ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
                <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                  {modeBtn('edit', '编辑')}
                  {modeBtn('preview', '预览')}
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    className="w-32"
                    value={draft.templateId}
                    onChange={(e) =>
                      setDraft({ ...draft, templateId: e.target.value as ResumeTemplateId })
                    }
                    options={TEMPLATE_OPTIONS}
                  />
                  <Button variant="secondary" onClick={() => void handleExport()} loading={exporting}>
                    导出 PDF
                  </Button>
                  <Button
                    variant="dangerGhost"
                    onClick={() => setDeleteId(draft.id)}
                    disabled={draft.id === null}
                  >
                    删除
                  </Button>
                  {mode === 'edit' && (
                    <Button onClick={() => void handleSave()} disabled={!draft.name.trim()} loading={saving}>
                      {saving ? '保存中…' : '保存'}
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                {mode === 'edit' ? (
                  <ResumeEditor
                    name={draft.name}
                    content={draft.content}
                    onNameChange={(name) => setDraft({ ...draft, name })}
                    onContentChange={(content) => setDraft({ ...draft, content })}
                  />
                ) : (
                  <ResumePreview
                    content={draft.content}
                    templateId={draft.templateId}
                    contentRef={previewRef}
                  />
                )}
              </div>
            </>
          ) : (
            <EmptyState title="未选择简历" description="从左侧选择一份简历，或点击「新建简历」开始。" />
          )}
        </div>
      </div>

      <Confirm
        open={deleteId !== null}
        title="删除简历"
        message="确定删除该简历？此操作不可恢复。"
        confirmText="删除"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
