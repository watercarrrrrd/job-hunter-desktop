import { app, ipcMain } from 'electron';
import { IPC, type PingResult } from '@shared/ipc-channels';
import { registerResumeHandlers } from './resume.handler';
import { registerApplicationHandlers } from './application.handler';
import { registerInterviewHandlers } from './interview.handler';
import { registerStatsHandlers } from './stats.handler';
import { registerBackupHandlers } from './backup.handler';
import { registerFileHandlers } from './file.handler';

/**
 * 统一注册 IPC handler。
 * 约定：handler 只做参数接收与结果返回，业务逻辑下沉到 service 层。
 */
export function registerIpcHandlers(): void {
  ipcMain.handle(IPC.Ping, (): PingResult => {
    return {
      pong: true,
      appVersion: app.getVersion(),
      electronVersion: process.versions.electron,
      time: new Date().toISOString(),
    };
  });

  registerResumeHandlers();
  registerApplicationHandlers();
  registerInterviewHandlers();
  registerStatsHandlers();
  registerBackupHandlers();
  registerFileHandlers();
}
