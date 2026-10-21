import type { Application, ApplicationStatus } from '@shared/types';

export interface ApplicationFilter {
  search: string;
  status: ApplicationStatus | '';
  channel: string;
  sort: 'date-desc' | 'date-asc';
}

/** 按关键词/状态/渠道过滤并按投递日期排序（纯函数，供单元测试） */
export function filterApplications(
  list: Application[],
  filter: ApplicationFilter,
): Application[] {
  const keyword = filter.search.trim().toLowerCase();

  const filtered = list.filter((app) => {
    if (keyword) {
      const haystack = `${app.company} ${app.position}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    if (filter.status && app.status !== filter.status) return false;
    if (filter.channel && app.channel !== filter.channel) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    const aDate = a.appliedDate ?? '';
    const bDate = b.appliedDate ?? '';
    // 未填日期恒排最后，不受升/降序影响
    if (aDate === bDate) return 0;
    if (aDate === '') return 1;
    if (bDate === '') return -1;

    const cmp = aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
    return filter.sort === 'date-asc' ? cmp : -cmp;
  });
}
