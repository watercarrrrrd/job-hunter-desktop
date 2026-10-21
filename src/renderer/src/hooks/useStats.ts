import { useCallback, useEffect, useState } from 'react';
import type { StatsDashboard } from '@shared/types';
import { api } from '../lib/api';

interface UseStatsResult {
  data: StatsDashboard | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** 统计看板数据 hook：一次拉取全部聚合结果，解包 ApiResult */
export function useStats(): UseStatsResult {
  const [data, setData] = useState<StatsDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const result = await api.stats.dashboard();
    if (result.ok) {
      setData(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
