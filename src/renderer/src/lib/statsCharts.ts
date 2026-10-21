import type { EChartsCoreOption } from 'echarts/core';
import { APPLICATION_STATUS_LABELS } from '@shared/constants';
import type {
  ApplicationStatus,
  ChannelDistributionItem,
  FunnelData,
  StatusDistributionItem,
  WeeklyTrendItem,
} from '@shared/types';

/** 品牌主色调板（蓝为主，绿/橙/红/灰为辅，与 StatusTag 语义一致） */
export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  neutral: '#9ca3af',
} as const;

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: CHART_COLORS.primary,
  written_test: CHART_COLORS.warning,
  interviewing: '#fbbf24',
  offered: CHART_COLORS.success,
  rejected: CHART_COLORS.danger,
  withdrawn: CHART_COLORS.neutral,
};

/** 由 YYYY-MM-DD 截取 MM-DD 作为紧凑横轴标签 */
function shortWeekLabel(weekStart: string): string {
  return weekStart.slice(5);
}

/** 投递状态分布饼图 */
export function buildStatusPieOption(data: StatusDistributionItem[]): EChartsCoreOption {
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['40%', '68%'],
        avoidLabelOverlap: true,
        label: { show: false },
        data: data.map((item) => ({
          name: APPLICATION_STATUS_LABELS[item.status],
          value: item.count,
          itemStyle: { color: STATUS_COLORS[item.status] },
        })),
      },
    ],
  };
}

/** 投递渠道分布柱状图 */
export function buildChannelBarOption(data: ChannelDistributionItem[]): EChartsCoreOption {
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 8, right: 8, top: 24, bottom: 0, containLabel: true },
    xAxis: { type: 'category', data: data.map((d) => d.channel) },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.count),
        itemStyle: { color: CHART_COLORS.primary },
        barMaxWidth: 40,
      },
    ],
  };
}

/** 近 8 周投递趋势柱状图 */
export function buildTrendBarOption(data: WeeklyTrendItem[]): EChartsCoreOption {
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 8, right: 8, top: 24, bottom: 0, containLabel: true },
    xAxis: { type: 'category', data: data.map((d) => shortWeekLabel(d.weekStart)) },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.count),
        itemStyle: { color: CHART_COLORS.primary },
        barMaxWidth: 40,
      },
    ],
  };
}

/** 求职转化漏斗（投递 → 笔试 → 面试 → Offer） */
export function buildFunnelOption(data: FunnelData): EChartsCoreOption {
  const stages = [
    { name: '投递', value: data.applied },
    { name: '笔试', value: data.writtenTest },
    { name: '面试', value: data.interview },
    { name: 'Offer', value: data.offer },
  ];
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'funnel',
        left: '10%',
        width: '80%',
        sort: 'descending',
        gap: 2,
        label: { show: true, position: 'inside' },
        itemStyle: { borderWidth: 1, borderColor: '#fff' },
        data: stages,
      },
    ],
  };
}
