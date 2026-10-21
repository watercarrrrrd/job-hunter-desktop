import type { Interview } from '@shared/types';

/** 按面试时间升序排列，未填写时间的恒排最后（纯函数，供单元测试） */
export function sortInterviews(list: Interview[]): Interview[] {
  return [...list].sort((a, b) => {
    const aTime = a.scheduledAt;
    const bTime = b.scheduledAt;
    if (aTime === bTime) return a.id - b.id;
    if (aTime === null) return 1;
    if (bTime === null) return -1;
    return aTime < bTime ? -1 : 1;
  });
}

/** 是否属于"即将到来"的面试（时间已填写且不早于当前时刻） */
export function isUpcoming(scheduledAt: string | null): boolean {
  if (!scheduledAt) return false;
  const t = new Date(scheduledAt).getTime();
  if (Number.isNaN(t)) return false;
  return t >= Date.now();
}

/**
 * 由日期（YYYY-MM-DD）与时间（HH:mm）拼成 ISO8601 本地时间字符串。
 * 任一缺失时返回 null。
 */
export function combineDateTime(date: string, time: string): string | null {
  if (!date) return null;
  if (!time) {
    // 只有日期时，补 00:00 占位，保证可排序
    return new Date(`${date}T00:00:00`).toISOString();
  }
  const d = new Date(`${date}T${time}:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** 由 ISO8601 拆回 { date, time }，供编辑表单回填 */
export function splitDateTime(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: '', time: '' };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: '', time: '' };
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return { date: `${y}-${m}-${day}`, time: `${h}:${min}` };
}
