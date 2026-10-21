import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { PingResult } from '@shared/ipc-channels';

export default function DashboardPage() {
  const [ping, setPing] = useState<PingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .ping()
      .then(setPing)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">统计看板</h1>
      <p className="mt-2 text-sm text-gray-500">模块骨架占位，待后续阶段实现。</p>
      {ping && (
        <p className="mt-4 text-sm text-gray-600">
          主进程连通：App {ping.appVersion} · Electron {ping.electronVersion} · {ping.time}
        </p>
      )}
      {error && <p className="mt-4 text-sm text-red-600">IPC 调用失败：{error}</p>}
    </div>
  );
}
