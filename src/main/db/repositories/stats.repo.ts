import Database from 'better-sqlite3';
import type { StatsOverview } from '@shared/types';

/**
 * 统计聚合查询：聚合计算下沉到 SQL，渲染进程只接收聚合结果。
 */
export function getOverview(db: Database.Database): StatsOverview {
  const total = (db.prepare('SELECT COUNT(*) AS c FROM applications').get() as { c: number }).c;
  const pending = (
    db
      .prepare("SELECT COUNT(*) AS c FROM applications WHERE status IN ('applied', 'written_test', 'interviewing')")
      .get() as { c: number }
  ).c;
  const interviews = (db.prepare('SELECT COUNT(*) AS c FROM interviews').get() as { c: number }).c;
  const offers = (
    db.prepare("SELECT COUNT(*) AS c FROM applications WHERE status = 'offered'").get() as {
      c: number;
    }
  ).c;

  return {
    totalApplications: total,
    pendingApplications: pending,
    totalInterviews: interviews,
    offers,
  };
}
