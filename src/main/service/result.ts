import type { ApiResult } from '@shared/types';

/** 构造成功结果 */
export function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

/** 构造失败结果 */
export function fail<T = never>(error: string): ApiResult<T> {
  return { ok: false, error };
}

/** 捕获同步异常，统一转为失败结果（用于 DB/业务逻辑的兜底） */
export function runSafely<T>(fn: () => T): ApiResult<T> {
  try {
    return ok(fn());
  } catch (err) {
    return fail(err instanceof Error ? err.message : String(err));
  }
}

/** 捕获异步异常，统一转为失败结果 */
export async function runSafelyAsync<T>(fn: () => Promise<T>): Promise<ApiResult<T>> {
  try {
    return ok(await fn());
  } catch (err) {
    return fail(err instanceof Error ? err.message : String(err));
  }
}
