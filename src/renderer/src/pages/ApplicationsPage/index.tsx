import { useMemo, useState } from 'react';
import type { Application, ApplicationStatus, CreateApplicationInput } from '@shared/types';
import Confirm from '../../components/Confirm';
import { useApplications } from '../../hooks/useApplications';
import { useResumes } from '../../hooks/useResumes';
import { filterApplications, type ApplicationFilter } from '../../lib/applications';
import ApplicationFormModal from './ApplicationFormModal';
import ApplicationsTable from './ApplicationsTable';
import FilterBar from './FilterBar';

export default function ApplicationsPage() {
  const { applications, loading, error, create, update, updateStatus, remove } =
    useApplications();
  // 复用简历数据 hook 获取关联简历下拉选项
  const { resumes } = useResumes();

  const [filter, setFilter] = useState<ApplicationFilter>({
    search: '',
    status: '',
    channel: '',
    sort: 'date-desc',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const visible = useMemo(() => filterApplications(applications, filter), [applications, filter]);

  function openCreate(): void {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(app: Application): void {
    setEditing(app);
    setModalOpen(true);
  }

  async function handleSubmit(input: CreateApplicationInput, id: number | null): Promise<void> {
    setSaving(true);
    if (id === null) {
      await create(input);
    } else {
      await update({ id, ...input });
    }
    setSaving(false);
    setModalOpen(false);
  }

  async function handleStatusChange(id: number, status: ApplicationStatus): Promise<void> {
    await updateStatus(id, status);
  }

  async function confirmDelete(): Promise<void> {
    if (deleteId === null) return;
    await remove(deleteId);
    setDeleteId(null);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">投递追踪</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
        >
          新建投递
        </button>
      </div>

      {error && (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-4">
        <FilterBar filter={filter} onChange={setFilter} />
      </div>

      <div className="mt-4 flex-1 overflow-auto rounded-md border border-gray-200 bg-white">
        <ApplicationsTable
          applications={visible}
          resumes={resumes}
          loading={loading}
          onEdit={openEdit}
          onDelete={(id) => setDeleteId(id)}
          onStatusChange={handleStatusChange}
        />
      </div>

      <ApplicationFormModal
        open={modalOpen}
        editing={editing}
        resumes={resumes}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <Confirm
        open={deleteId !== null}
        title="删除投递"
        message="确定删除该投递记录？关联的面试记录也会一并删除。"
        confirmText="删除"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
