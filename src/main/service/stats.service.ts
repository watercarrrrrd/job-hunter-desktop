import type { ApiResult, StatsOverview } from '@shared/types';
import { getDb } from '../db';
import { getOverview } from '../db/repositories/stats.repo';
import { runSafely } from './result';

export function getStatsOverview(): ApiResult<StatsOverview> {
  return runSafely(() => getOverview(getDb()));
}
