import { ipcMain } from 'electron';
import { IPC } from '@shared/ipc-channels';
import * as backupService from '../service/backup.service';

export function registerBackupHandlers(): void {
  ipcMain.handle(IPC.Backup.List, () => backupService.listBackups());
  ipcMain.handle(IPC.Backup.Export, () => backupService.exportBackup());
  ipcMain.handle(IPC.Backup.Preview, () => backupService.previewBackup());
  ipcMain.handle(IPC.Backup.Import, () => backupService.confirmImport());
}
