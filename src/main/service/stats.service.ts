import type { ApiResult, StatsDashboard, StatsOverview } from '@shared/types';
import { getDb } from '../db';
import * as statsRepo from '../db/repositories/stats.repo';
import { runSafely } from './result';

export function getStatsOverview(): ApiResult<StatsOverview> {
  return runSafely(() => statsRepo.getOverview(getDb()));
}

/** 组合全部聚合结果，供看板一次拉取 */
export function getDashboard(): ApiResult<StatsDashboard> {
  return runSafely(() => {
    const db = getDb();
    return {
      overview: statsRepo.getOverview(db),
      statusDistribution: statsRepo.getStatusDistribution(db),
      channelDistribution: statsRepo.getChannelDistribution(db),
      weeklyTrend: statsRepo.getWeeklyTrend(db),
      funnel: statsRepo.getFunnel(db),
    };
  });
}
