import { ipcMain } from 'electron';
import { IPC } from '@shared/ipc-channels';
import * as statsService from '../service/stats.service';

export function registerStatsHandlers(): void {
  ipcMain.handle(IPC.Stats.Overview, () => statsService.getStatsOverview());
  ipcMain.handle(IPC.Stats.Dashboard, () => statsService.getDashboard());
}
