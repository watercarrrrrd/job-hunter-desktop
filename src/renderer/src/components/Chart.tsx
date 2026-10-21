import { useEffect, useRef } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import echarts from '../lib/echarts';

interface ChartProps {
  option: EChartsCoreOption;
  className?: string;
}

/** 通用图表容器：封装 ECharts 实例的初始化、更新、自适应与销毁 */
export default function Chart({ option, className }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option);
  }, [option]);

  return <div ref={containerRef} className={className} style={{ width: '100%' }} />;
}
