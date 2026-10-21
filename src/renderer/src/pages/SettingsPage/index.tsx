import { useSystemInfo } from '../../hooks/useSystemInfo';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm text-gray-900">{value}</span>
    </div>
  );
}

function ComingSoonRow({ label, control }: { label: string; control: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
          后续版本开放
        </span>
      </div>
      <span className="text-sm text-gray-300">{control}</span>
    </div>
  );
}

export default function SettingsPage() {
  const { info, loading, error } = useSystemInfo();

  return (
    <div>
      <h1 className="text-xl font-semibold">系统设置</h1>

      {error && (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {loading && !info ? (
        <p className="mt-4 text-sm text-gray-400">加载中…</p>
      ) : info ? (
        <div className="mt-4 space-y-4">
          <section className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-1 text-sm font-medium text-gray-700">应用信息</h2>
            <div className="divide-y divide-gray-100">
              <InfoRow label="应用名称" value={info.appName} />
              <InfoRow label="版本号" value={info.appVersion} />
              <InfoRow label="Electron 版本" value={info.electronVersion} />
              <InfoRow label="产品说明" value={info.description} />
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-1 text-sm font-medium text-gray-700">数据存储</h2>
            <p className="select-all break-all rounded-md bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700">
              {info.dbPath}
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-1 text-sm font-medium text-gray-700">高级功能</h2>
            <div className="divide-y divide-gray-100">
              <ComingSoonRow label="主题切换" control="深色 / 浅色" />
              <ComingSoonRow label="自动备份" control="定时 / 退出时备份" />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
