import Database from 'better-sqlite3';
import type {
  ApplicationStatus,
  ChannelDistributionItem,
  FunnelData,
  StatsOverview,
  StatusDistributionItem,
  WeeklyTrendItem,
} from '@shared/types';

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

/** 投递状态分布（按当前状态分组计数） */
export function getStatusDistribution(db: Database.Database): StatusDistributionItem[] {
  const rows = db
    .prepare('SELECT status, COUNT(*) AS count FROM applications GROUP BY status')
    .all() as { status: string; count: number }[];
  return rows.map((r) => ({ status: r.status as ApplicationStatus, count: r.count }));
}

/** 投递渠道分布（空渠道归为"未填写"，按数量降序） */
export function getChannelDistribution(db: Database.Database): ChannelDistributionItem[] {
  return db
    .prepare(
      "SELECT COALESCE(channel, '未填写') AS channel, COUNT(*) AS count FROM applications GROUP BY channel ORDER BY count DESC",
    )
    .all() as ChannelDistributionItem[];
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 返回该日期所在周的周一（周一为一周起点） */
function mondayOf(d: Date): Date {
  const day = (d.getDay() + 6) % 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  return monday;
}

/** 近 8 周投递趋势（按周一为分桶起点，空周补 0） */
export function getWeeklyTrend(db: Database.Database): WeeklyTrendItem[] {
  const thisMonday = mondayOf(new Date());
  const buckets: string[] = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(thisMonday);
    d.setDate(thisMonday.getDate() - i * 7);
    buckets.push(toDateStr(d));
  }

  const rows = db
    .prepare(
      `SELECT strftime('%Y-%m-%d', applied_date, 'weekday 0', '-6 days') AS week_start,
              COUNT(*) AS count
       FROM applications
       WHERE applied_date IS NOT NULL AND applied_date >= @start
       GROUP BY week_start`,
    )
    .all({ start: buckets[0] }) as { week_start: string; count: number }[];

  const countMap = new Map(buckets.map((b) => [b, 0]));
  for (const row of rows) {
    if (countMap.has(row.week_start)) countMap.set(row.week_start, row.count);
  }
  return buckets.map((weekStart) => ({ weekStart, count: countMap.get(weekStart) ?? 0 }));
}

/**
 * 转化漏斗（投递 → 笔试 → 面试 → Offer）。
 * 数据模型仅存"当前状态"，故采用"至少达到该阶段"的累计口径（单调不减），MVP 近似。
 */
export function getFunnel(db: Database.Database): FunnelData {
  const count = (sql: string): number => (db.prepare(sql).get() as { c: number }).c;
  return {
    applied: count('SELECT COUNT(*) AS c FROM applications'),
    writtenTest: count(
      "SELECT COUNT(*) AS c FROM applications WHERE status IN ('written_test','interviewing','offered')",
    ),
    interview: count(
      "SELECT COUNT(*) AS c FROM applications WHERE status IN ('interviewing','offered')",
    ),
    offer: count("SELECT COUNT(*) AS c FROM applications WHERE status = 'offered'"),
  };
}
