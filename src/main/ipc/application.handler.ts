import { ipcMain } from 'electron';
import { IPC } from '@shared/ipc-channels';
import type {
  ApplicationStatus,
  CreateApplicationInput,
  UpdateApplicationInput,
} from '@shared/types';
import * as applicationService from '../service/application.service';

export function registerApplicationHandlers(): void {
  ipcMain.handle(IPC.Application.List, () => applicationService.listApplications());
  ipcMain.handle(IPC.Application.Get, (_event, id: number) => applicationService.getApplication(id));
  ipcMain.handle(IPC.Application.Create, (_event, input: CreateApplicationInput) =>
    applicationService.createApplication(input),
  );
  ipcMain.handle(IPC.Application.Update, (_event, input: UpdateApplicationInput) =>
    applicationService.updateApplication(input),
  );
  ipcMain.handle(IPC.Application.UpdateStatus, (_event, id: number, status: ApplicationStatus) =>
    applicationService.updateApplicationStatus(id, status),
  );
  ipcMain.handle(IPC.Application.Delete, (_event, id: number) =>
    applicationService.deleteApplication(id),
  );
}
