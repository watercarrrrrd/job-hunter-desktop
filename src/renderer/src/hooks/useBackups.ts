import { useCallback, useEffect, useState } from 'react';
import type {
  BackupExportResult,
  BackupImportResult,
  BackupPreview,
  BackupRecord,
} from '@shared/types';
import { api } from '../lib/api';

interface UseBackupsResult {
  records: BackupRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  exportBackup: () => Promise<BackupExportResult | null>;
  previewImport: () => Promise<BackupPreview | null>;
  confirmImport: () => Promise<BackupImportResult | null>;
}

/** 备份数据 hook：统一解包 ApiResult，维护备份历史与加载/错误状态 */
export function useBackups(): UseBackupsResult {
  const [records, setRecords] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const result = await api.backup.list();
    if (result.ok) {
      setRecords(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const exportBackup = useCallback(async (): Promise<BackupExportResult | null> => {
    const result = await api.backup.exportBackup();
    if (!result.ok) {
      setError(result.error);
      return null;
    }
    if (result.data) await refresh();
    return result.data;
  }, [refresh]);

  const previewImport = useCallback(async (): Promise<BackupPreview | null> => {
    const result = await api.backup.previewImport();
    if (!result.ok) {
      setError(result.error);
      return null;
    }
    return result.data;
  }, []);

  const confirmImport = useCallback(async (): Promise<BackupImportResult | null> => {
    const result = await api.backup.confirmImport();
    if (!result.ok) {
      setError(result.error);
      return null;
    }
    await refresh();
    return result.data;
  }, [refresh]);

  return { records, loading, error, refresh, exportBackup, previewImport, confirmImport };
}
