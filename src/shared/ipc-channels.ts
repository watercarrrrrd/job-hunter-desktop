// IPC 通道名与请求/响应类型契约（集中管理，禁止在业务代码中硬编码字符串）

export const IPC = {
  Ping: 'app:ping',
} as const;

export interface PingResult {
  pong: true;
  appVersion: string;
  electronVersion: string;
  time: string;
}
