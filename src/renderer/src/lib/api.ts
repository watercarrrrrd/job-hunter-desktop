import type { PingResult } from '@shared/ipc-channels';

// 渲染进程统一通过此层访问 window.api，禁止直接使用 window.require / process / Node API。
export const api = {
  ping: (): Promise<PingResult> => window.api.ping(),
};
