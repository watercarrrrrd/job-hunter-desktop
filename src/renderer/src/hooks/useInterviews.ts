import { useCallback, useEffect, useState } from 'react';
import type {
  CreateChecklistInput,
  CreateInterviewInput,
  Interview,
  InterviewChecklist,
  InterviewResult,
  UpdateInterviewInput,
} from '@shared/types';
import { api } from '../lib/api';

interface UseInterviewsResult {
  interviews: Interview[];
  loading: boolean;
  error: string | null;
  checklistByInterview: Record<number, InterviewChecklist[]>;
  refresh: () => Promise<void>;
  create: (input: CreateInterviewInput) => Promise<Interview | null>;
  update: (input: UpdateInterviewInput) => Promise<Interview | null>;
  updateResult: (
    id: number,
    result: InterviewResult,
    review?: string | null,
  ) => Promise<Interview | null>;
  remove: (id: number) => Promise<boolean>;
  loadChecklist: (interviewId: number) => Promise<void>;
  addChecklist: (interviewId: number, content: string) => Promise<boolean>;
  toggleChecklist: (item: InterviewChecklist) => Promise<boolean>;
  removeChecklist: (id: number) => Promise<boolean>;
}

/** 面试数据 hook：统一解包 ApiResult，维护面试列表与按面试聚合的准备清单 */
export function useInterviews(): UseInterviewsResult {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checklistByInterview, setChecklistByInterview] = useState<
    Record<number, InterviewChecklist[]>
  >({});

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const result = await api.interview.list();
    if (result.ok) {
      setInterviews(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateInterviewInput): Promise<Interview | null> => {
      const result = await api.interview.create(input);
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
    async (input: UpdateInterviewInput): Promise<Interview | null> => {
      const result = await api.interview.update(input);
      if (!result.ok) {
        setError(result.error);
        return null;
      }
      await refresh();
      return result.data;
    },
    [refresh],
  );

  const updateResult = useCallback(
    async (
      id: number,
      result: InterviewResult,
      review?: string | null,
    ): Promise<Interview | null> => {
      const res = await api.interview.updateResult(id, result, review);
      if (!res.ok) {
        setError(res.error);
        return null;
      }
      await refresh();
      return res.data;
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: number): Promise<boolean> => {
      const result = await api.interview.remove(id);
      if (!result.ok) {
        setError(result.error);
        return false;
      }
      await refresh();
      return result.data;
    },
    [refresh],
  );

  const loadChecklist = useCallback(async (interviewId: number): Promise<void> => {
    const result = await api.interview.checklist.list(interviewId);
    if (result.ok) {
      setChecklistByInterview((prev) => ({ ...prev, [interviewId]: result.data }));
    } else {
      setError(result.error);
    }
  }, []);

  const addChecklist = useCallback(
    async (interviewId: number, content: string): Promise<boolean> => {
      const input: CreateChecklistInput = { interviewId, content };
      const result = await api.interview.checklist.create(input);
      if (!result.ok) {
        setError(result.error);
        return false;
      }
      await loadChecklist(interviewId);
      return true;
    },
    [loadChecklist],
  );

  const toggleChecklist = useCallback(
    async (item: InterviewChecklist): Promise<boolean> => {
      const result = await api.interview.checklist.update({
        id: item.id,
        done: !item.done,
      });
      if (!result.ok) {
        setError(result.error);
        return false;
      }
      await loadChecklist(item.interviewId);
      return true;
    },
    [loadChecklist],
  );

  const removeChecklist = useCallback(
    async (id: number): Promise<boolean> => {
      const result = await api.interview.checklist.remove(id);
      if (!result.ok) {
        setError(result.error);
        return false;
      }
      // 从聚合中就地移除，避免额外一次整组刷新
      setChecklistByInterview((prev) => {
        const next: Record<number, InterviewChecklist[]> = {};
        for (const [key, items] of Object.entries(prev)) {
          next[Number(key)] = items.filter((i) => i.id !== id);
        }
        return next;
      });
      return true;
    },
    [],
  );

  return {
    interviews,
    loading,
    error,
    checklistByInterview,
    refresh,
    create,
    update,
    updateResult,
    remove,
    loadChecklist,
    addChecklist,
    toggleChecklist,
    removeChecklist,
  };
}
