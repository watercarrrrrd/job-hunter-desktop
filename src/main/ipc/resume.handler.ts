import { ipcMain } from 'electron';
import { IPC } from '@shared/ipc-channels';
import type { CreateResumeInput, UpdateResumeInput } from '@shared/types';
import * as resumeService from '../service/resume.service';

export function registerResumeHandlers(): void {
  ipcMain.handle(IPC.Resume.List, () => resumeService.listResumes());
  ipcMain.handle(IPC.Resume.Get, (_event, id: number) => resumeService.getResume(id));
  ipcMain.handle(IPC.Resume.Create, (_event, input: CreateResumeInput) =>
    resumeService.createResume(input),
  );
  ipcMain.handle(IPC.Resume.Update, (_event, input: UpdateResumeInput) =>
    resumeService.updateResume(input),
  );
  ipcMain.handle(IPC.Resume.Delete, (_event, id: number) => resumeService.deleteResume(id));
}
