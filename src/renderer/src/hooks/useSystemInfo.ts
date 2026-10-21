import { useCallback, useEffect, useState } from 'react';
import type { SystemInfo } from '@shared/types';
import { api } from '../lib/api';

interface UseSystemInfoResult {
  info: SystemInfo | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** 系统信息 hook：读取应用版本、数据库路径等只读信息 */
export function useSystemInfo(): UseSystemInfoResult {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const result = await api.settings.info();
    if (result.ok) {
      setInfo(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { info, loading, error, refresh };
}
