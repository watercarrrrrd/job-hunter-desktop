// IPC 通道名与请求/响应类型契约（集中管理，禁止在业务代码中硬编码字符串）

export const IPC = {
  Ping: 'app:ping',
  Resume: {
    List: 'resume:list',
    Get: 'resume:get',
    Create: 'resume:create',
    Update: 'resume:update',
    Delete: 'resume:delete',
  },
  Application: {
    List: 'application:list',
    Get: 'application:get',
    Create: 'application:create',
    Update: 'application:update',
    UpdateStatus: 'application:update-status',
    Delete: 'application:delete',
  },
  Interview: {
    List: 'interview:list',
    Get: 'interview:get',
    Create: 'interview:create',
    Update: 'interview:update',
    UpdateResult: 'interview:update-result',
    Delete: 'interview:delete',
    Checklist: {
      List: 'interview:checklist-list',
      Create: 'interview:checklist-create',
      Update: 'interview:checklist-update',
      Delete: 'interview:checklist-delete',
    },
  },
  Stats: {
    Overview: 'stats:overview',
    Dashboard: 'stats:dashboard',
  },
  Backup: {
    Export: 'backup:export',
    Import: 'backup:import',
    List: 'backup:list',
  },
  File: {
    SavePdf: 'file:save-pdf',
  },
} as const;

export interface PingResult {
  pong: true;
  appVersion: string;
  electronVersion: string;
  time: string;
}
