import { useRef, useState } from 'react';
import { RESUME_TEMPLATE_LABELS, RESUME_TEMPLATES } from '@shared/constants';
import type { Resume, ResumeContent, ResumeTemplateId } from '@shared/types';
import Confirm from '../../components/Confirm';
import Select from '../../components/Select';
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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>('preview');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
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
      }
    }
    setSaving(false);
  }

  async function confirmDelete(): Promise<void> {
    if (deleteId === null) return;
    const ok = await remove(deleteId);
    if (ok && deleteId === selectedId) {
      setSelectedId(null);
      setDraft(null);
      setMode('preview');
    }
    setDeleteId(null);
  }

  async function handleExport(): Promise<void> {
    if (!draft || !previewRef.current) return;
    const fileName = `${draft.name.trim() || '简历'}.pdf`;
    await exportResumeToPdf(previewRef.current, fileName);
  }

  const modeBtn = (value: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(value)}
      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
        mode === value ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">简历管理</h1>
        <button
          type="button"
          onClick={handleNew}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
        >
          新建简历
        </button>
      </div>

      {error && (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-4 flex flex-1 gap-4 overflow-hidden">
        <ResumeList
          resumes={resumes}
          loading={loading}
          selectedId={selectedId}
          onSelect={handleSelect}
          onDelete={(id) => setDeleteId(id)}
        />

        <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-gray-200 bg-white">
          {draft ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
                <div className="flex items-center gap-1 rounded-md bg-gray-100 p-1">
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
                  <button
                    type="button"
                    onClick={handleExport}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    导出 PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(draft.id)}
                    disabled={draft.id === null}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    删除
                  </button>
                  {mode === 'edit' && (
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving || !draft.name.trim()}
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                      {saving ? '保存中…' : '保存'}
                    </button>
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
            <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
              选择左侧简历，或点击「新建简历」开始
            </div>
          )}
        </div>
      </div>

      <Confirm
        open={deleteId !== null}
        title="删除简历"
        message="确定删除该简历？此操作不可恢复。"
        confirmText="删除"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
