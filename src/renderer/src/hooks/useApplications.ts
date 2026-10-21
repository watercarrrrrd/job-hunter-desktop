import { useCallback, useEffect, useState } from 'react';
import type {
  Application,
  ApplicationStatus,
  CreateApplicationInput,
  UpdateApplicationInput,
} from '@shared/types';
import { api } from '../lib/api';

interface UseApplicationsResult {
  applications: Application[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: CreateApplicationInput) => Promise<Application | null>;
  update: (input: UpdateApplicationInput) => Promise<Application | null>;
  updateStatus: (id: number, status: ApplicationStatus) => Promise<Application | null>;
  remove: (id: number) => Promise<boolean>;
}

/** 投递数据 hook：统一解包 ApiResult，维护列表与加载/错误状态 */
export function useApplications(): UseApplicationsResult {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const result = await api.application.list();
    if (result.ok) {
      setApplications(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateApplicationInput): Promise<Application | null> => {
      const result = await api.application.create(input);
      if (!result.ok) {
        setError(result.error);
        return null;
      }
      await refresh();
      return result.data;
    },
    [refresh],
  );

  const update = useCallback(
    async (input: UpdateApplicationInput): Promise<Application | null> => {
      const result = await api.application.update(input);
      if (!result.ok) {
        setError(result.error);
        return null;
      }
      await refresh();
      return result.data;
    },
    [refresh],
  );

  const updateStatus = useCallback(
    async (id: number, status: ApplicationStatus): Promise<Application | null> => {
      const result = await api.application.updateStatus(id, status);
      if (!result.ok) {
        setError(result.error);
        return null;
      }
      await refresh();
      return result.data;
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: number): Promise<boolean> => {
      const result = await api.application.remove(id);
      if (!result.ok) {
        setError(result.error);
        return false;
      }
      await refresh();
      return result.data;
    },
    [refresh],
  );

  return { applications, loading, error, refresh, create, update, updateStatus, remove };
}
