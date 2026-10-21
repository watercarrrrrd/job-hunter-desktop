import { ipcMain } from 'electron';
import { IPC } from '@shared/ipc-channels';
import type {
  CreateChecklistInput,
  CreateInterviewInput,
  InterviewResult,
  UpdateChecklistInput,
  UpdateInterviewInput,
} from '@shared/types';
import * as interviewService from '../service/interview.service';

export function registerInterviewHandlers(): void {
  ipcMain.handle(IPC.Interview.List, () => interviewService.listInterviews());
  ipcMain.handle(IPC.Interview.Get, (_event, id: number) => interviewService.getInterview(id));
  ipcMain.handle(IPC.Interview.Create, (_event, input: CreateInterviewInput) =>
    interviewService.createInterview(input),
  );
  ipcMain.handle(IPC.Interview.Update, (_event, input: UpdateInterviewInput) =>
    interviewService.updateInterview(input),
  );
  ipcMain.handle(
    IPC.Interview.UpdateResult,
    (_event, id: number, result: InterviewResult, review?: string | null) =>
      interviewService.updateInterviewResult(id, result, review),
  );
  ipcMain.handle(IPC.Interview.Delete, (_event, id: number) =>
    interviewService.deleteInterview(id),
  );

  ipcMain.handle(IPC.Interview.Checklist.List, (_event, interviewId: number) =>
    interviewService.listChecklist(interviewId),
  );
  ipcMain.handle(IPC.Interview.Checklist.Create, (_event, input: CreateChecklistInput) =>
    interviewService.createChecklist(input),
  );
  ipcMain.handle(IPC.Interview.Checklist.Update, (_event, input: UpdateChecklistInput) =>
    interviewService.updateChecklist(input),
  );
  ipcMain.handle(IPC.Interview.Checklist.Delete, (_event, id: number) =>
    interviewService.deleteChecklist(id),
  );
}
