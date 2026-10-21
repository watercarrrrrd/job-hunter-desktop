interface MetricCardProps {
  label: string;
  value: number;
  hint?: string;
  accent?: 'default' | 'info' | 'warning' | 'success';
}

const ACCENT_CLASSES: Record<NonNullable<MetricCardProps['accent']>, string> = {
  default: 'text-gray-900',
  info: 'text-blue-600',
  warning: 'text-amber-600',
  success: 'text-green-600',
};

/** 核心指标卡：纯展示组件 */
export default function MetricCard({
  label,
  value,
  hint,
  accent = 'default',
}: MetricCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${ACCENT_CLASSES[accent]}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
