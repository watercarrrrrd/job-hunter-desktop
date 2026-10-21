import { useState } from 'react';
import type { BackupPreview } from '@shared/types';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { useBackups } from '../../hooks/useBackups';
import { formatDateTime, formatSize } from '../../lib/format';

export default function BackupPage() {
  const { records, loading, error, exportBackup, previewImport, confirmImport } = useBackups();
  const toast = useToast();
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const busy = exporting || importing;

  async function handleExport(): Promise<void> {
    setExporting(true);
    const result = await exportBackup();
    setExporting(false);
    if (result) {
      toast.success('备份已导出');
    } else {
      toast.error('导出失败，请重试');
    }
  }

  async function handleImport(): Promise<void> {
    const p = await previewImport();
    if (p) {
      setPreview(p);
    } else {
      toast.error('无法读取备份文件');
    }
  }

  async function handleConfirmImport(): Promise<void> {
    setImporting(true);
    const result = await confirmImport();
    setImporting(false);
    setPreview(null);
    if (result) {
      toast.success('已恢复备份数据');
    } else {
      toast.error('恢复失败，请重试');
    }
  }

  return (
    <div className="flex h-full flex-col">
      <h1 className="text-xl font-semibold text-gray-900">数据备份</h1>

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-gray-700">导出备份</h2>
          <p className="mt-1 text-xs text-gray-500">
            将简历、投递、面试、准备清单与设置导出为单个 JSON 文件。
          </p>
          <Button className="mt-3" onClick={() => void handleExport()} disabled={busy} loading={exporting}>
            导出备份
          </Button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-gray-700">导入恢复</h2>
          <p className="mt-1 text-xs text-gray-500">
            选择备份文件导入，确认前会先展示概要，恢复将覆盖当前数据。
          </p>
          <Button
            className="mt-3"
            variant="secondary"
            onClick={() => void handleImport()}
            disabled={busy}
            loading={importing}
          >
            选择文件导入
          </Button>
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 font-medium">备份时间</th>
              <th className="px-3 py-2 font-medium">类型</th>
              <th className="px-3 py-2 font-medium">数据量</th>
              <th className="px-3 py-2 font-medium">文件大小</th>
              <th className="px-3 py-2 font-medium">路径</th>
            </tr>
          </thead>
          <tbody>
            {loading && records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-gray-400">
                  <span className="spinner text-gray-300" aria-hidden="true" />
                  <span className="ml-2">加载中…</span>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4">
                  <EmptyState title="暂无备份记录" description="手动导出一次，即可在这里看到历史备份。" />
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-700">{formatDateTime(r.backupAt)}</td>
                  <td className="px-3 py-2 text-gray-700">
                    {r.type === 'manual' ? '手动' : '自动'}
                  </td>
                  <td className="px-3 py-2 text-gray-700">{r.dataCount}</td>
                  <td className="px-3 py-2 text-gray-700">{formatSize(r.size)}</td>
                  <td
                    className="max-w-[24rem] truncate px-3 py-2 text-gray-500"
                    title={r.backupPath}
                  >
                    {r.backupPath}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={preview !== null}
        title="确认导入备份"
        onClose={() => setPreview(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPreview(null)} disabled={importing}>
              取消
            </Button>
            <Button variant="danger" onClick={() => void handleConfirmImport()} loading={importing}>
              {importing ? '恢复中…' : '确认覆盖'}
            </Button>
          </>
        }
      >
        {preview && (
          <div className="space-y-3 text-sm">
            <p className="text-gray-700">
              即将用以下备份覆盖当前全部数据，该操作不可撤销，请确认。
            </p>
            <dl className="space-y-1 rounded-lg bg-gray-50 p-3 text-gray-600">
              <div className="flex justify-between">
                <dt>备份时间</dt>
                <dd>{formatDateTime(preview.backupAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>简历</dt>
                <dd>{preview.resumeCount} 份</dd>
              </div>
              <div className="flex justify-between">
                <dt>投递</dt>
                <dd>{preview.applicationCount} 条</dd>
              </div>
              <div className="flex justify-between">
                <dt>面试</dt>
                <dd>{preview.interviewCount} 场</dd>
              </div>
              <div className="flex justify-between">
                <dt>准备事项</dt>
                <dd>{preview.checklistCount} 项</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
