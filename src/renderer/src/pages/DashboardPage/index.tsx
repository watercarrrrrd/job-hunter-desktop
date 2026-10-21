import type { ReactNode } from 'react';
import Chart from '../../components/Chart';
import { useStats } from '../../hooks/useStats';
import {
  buildChannelBarOption,
  buildFunnelOption,
  buildStatusPieOption,
  buildTrendBarOption,
} from '../../lib/statsCharts';
import MetricCard from './MetricCard';

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-medium text-gray-700">{title}</h2>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading, error } = useStats();

  const statusOption = buildStatusPieOption(data?.statusDistribution ?? []);
  const channelOption = buildChannelBarOption(data?.channelDistribution ?? []);
  const trendOption = buildTrendBarOption(data?.weeklyTrend ?? []);
  const funnelOption = buildFunnelOption(
    data?.funnel ?? { applied: 0, writtenTest: 0, interview: 0, offer: 0 },
  );

  return (
    <div className="flex h-full flex-col">
      <h1 className="text-xl font-semibold">统计看板</h1>

      {error && (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {loading && !data ? (
        <p className="mt-4 text-sm text-gray-400">加载中…</p>
      ) : data ? (
        <div className="mt-4 flex flex-1 flex-col overflow-auto pb-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricCard label="投递总数" value={data.overview.totalApplications} />
            <MetricCard
              label="待处理"
              value={data.overview.pendingApplications}
              accent="warning"
            />
            <MetricCard label="面试总数" value={data.overview.totalInterviews} accent="info" />
            <MetricCard label="Offer" value={data.overview.offers} accent="success" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <ChartCard title="投递状态分布">
              <Chart className="h-64" option={statusOption} />
            </ChartCard>
            <ChartCard title="投递渠道分布">
              <Chart className="h-64" option={channelOption} />
            </ChartCard>
            <div className="lg:col-span-2">
              <ChartCard title="近 8 周投递趋势">
                <Chart className="h-64" option={trendOption} />
              </ChartCard>
            </div>
            <div className="lg:col-span-2">
              <ChartCard title="求职转化漏斗">
                <Chart className="h-72" option={funnelOption} />
              </ChartCard>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
