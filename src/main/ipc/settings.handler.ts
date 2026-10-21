import { ipcMain } from 'electron';
import { IPC } from '@shared/ipc-channels';
import * as settingsService from '../service/settings.service';

export function registerSettingsHandlers(): void {
  ipcMain.handle(IPC.Settings.Info, () => settingsService.getSystemInfo());
}
