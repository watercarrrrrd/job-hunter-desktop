import { useCallback, useEffect, useState } from 'react';
import type { CreateResumeInput, Resume, UpdateResumeInput } from '@shared/types';
import { api } from '../lib/api';

interface UseResumesResult {
  resumes: Resume[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: CreateResumeInput) => Promise<Resume | null>;
  update: (input: UpdateResumeInput) => Promise<Resume | null>;
  remove: (id: number) => Promise<boolean>;
}

/**
 * 简历数据 hook：统一解包 ApiResult，维护列表与加载/错误状态。
 * 组件只消费状态与动作，不直接触碰 window.api。
 */
export function useResumes(): UseResumesResult {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const result = await api.resume.list();
    if (result.ok) {
      setResumes(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateResumeInput): Promise<Resume | null> => {
      const result = await api.resume.create(input);
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
    async (input: UpdateResumeInput): Promise<Resume | null> => {
      const result = await api.resume.update(input);
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
      const result = await api.resume.remove(id);
      if (!result.ok) {
        setError(result.error);
        return false;
      }
      await refresh();
      return result.data;
    },
    [refresh],
  );

  return { resumes, loading, error, refresh, create, update, remove };
}
