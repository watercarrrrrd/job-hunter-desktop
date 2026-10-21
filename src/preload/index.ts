import { contextBridge, ipcRenderer } from 'electron';
import { IPC, type PingResult } from '@shared/ipc-channels';
import type {
  ApiResult,
  Application,
  ApplicationStatus,
  BackupExportResult,
  BackupImportResult,
  BackupRecord,
  CreateApplicationInput,
  CreateChecklistInput,
  CreateInterviewInput,
  CreateResumeInput,
  Interview,
  InterviewChecklist,
  InterviewResult,
  Resume,
  StatsDashboard,
  StatsOverview,
  UpdateApplicationInput,
  UpdateChecklistInput,
  UpdateInterviewInput,
  UpdateResumeInput,
} from '@shared/types';

const api = {
  ping: (): Promise<PingResult> => ipcRenderer.invoke(IPC.Ping),

  resume: {
    list: (): Promise<ApiResult<Resume[]>> => ipcRenderer.invoke(IPC.Resume.List),
    get: (id: number): Promise<ApiResult<Resume | null>> =>
      ipcRenderer.invoke(IPC.Resume.Get, id),
    create: (input: CreateResumeInput): Promise<ApiResult<Resume>> =>
      ipcRenderer.invoke(IPC.Resume.Create, input),
    update: (input: UpdateResumeInput): Promise<ApiResult<Resume>> =>
      ipcRenderer.invoke(IPC.Resume.Update, input),
    remove: (id: number): Promise<ApiResult<boolean>> =>
      ipcRenderer.invoke(IPC.Resume.Delete, id),
  },

  application: {
    list: (): Promise<ApiResult<Application[]>> => ipcRenderer.invoke(IPC.Application.List),
    get: (id: number): Promise<ApiResult<Application | null>> =>
      ipcRenderer.invoke(IPC.Application.Get, id),
    create: (input: CreateApplicationInput): Promise<ApiResult<Application>> =>
      ipcRenderer.invoke(IPC.Application.Create, input),
    update: (input: UpdateApplicationInput): Promise<ApiResult<Application>> =>
      ipcRenderer.invoke(IPC.Application.Update, input),
    updateStatus: (id: number, status: ApplicationStatus): Promise<ApiResult<Application>> =>
      ipcRenderer.invoke(IPC.Application.UpdateStatus, id, status),
    remove: (id: number): Promise<ApiResult<boolean>> =>
      ipcRenderer.invoke(IPC.Application.Delete, id),
  },

  interview: {
    list: (): Promise<ApiResult<Interview[]>> => ipcRenderer.invoke(IPC.Interview.List),
    get: (id: number): Promise<ApiResult<Interview | null>> =>
      ipcRenderer.invoke(IPC.Interview.Get, id),
    create: (input: CreateInterviewInput): Promise<ApiResult<Interview>> =>
      ipcRenderer.invoke(IPC.Interview.Create, input),
    update: (input: UpdateInterviewInput): Promise<ApiResult<Interview>> =>
      ipcRenderer.invoke(IPC.Interview.Update, input),
    updateResult: (
      id: number,
      result: InterviewResult,
      review?: string | null,
    ): Promise<ApiResult<Interview>> =>
      ipcRenderer.invoke(IPC.Interview.UpdateResult, id, result, review),
    remove: (id: number): Promise<ApiResult<boolean>> =>
      ipcRenderer.invoke(IPC.Interview.Delete, id),
    checklist: {
      list: (interviewId: number): Promise<ApiResult<InterviewChecklist[]>> =>
        ipcRenderer.invoke(IPC.Interview.Checklist.List, interviewId),
      create: (input: CreateChecklistInput): Promise<ApiResult<InterviewChecklist>> =>
        ipcRenderer.invoke(IPC.Interview.Checklist.Create, input),
      update: (input: UpdateChecklistInput): Promise<ApiResult<InterviewChecklist>> =>
        ipcRenderer.invoke(IPC.Interview.Checklist.Update, input),
      remove: (id: number): Promise<ApiResult<boolean>> =>
        ipcRenderer.invoke(IPC.Interview.Checklist.Delete, id),
    },
  },

  stats: {
    overview: (): Promise<ApiResult<StatsOverview>> => ipcRenderer.invoke(IPC.Stats.Overview),
    dashboard: (): Promise<ApiResult<StatsDashboard>> =>
      ipcRenderer.invoke(IPC.Stats.Dashboard),
  },

  backup: {
    list: (): Promise<ApiResult<BackupRecord[]>> => ipcRenderer.invoke(IPC.Backup.List),
    exportBackup: (): Promise<ApiResult<BackupExportResult>> =>
      ipcRenderer.invoke(IPC.Backup.Export),
    importBackup: (): Promise<ApiResult<BackupImportResult>> =>
      ipcRenderer.invoke(IPC.Backup.Import),
  },

  file: {
    savePdf: (fileName: string, base64: string): Promise<ApiResult<string | null>> =>
      ipcRenderer.invoke(IPC.File.SavePdf, fileName, base64),
  },
};

contextBridge.exposeInMainWorld('api', api);

export type Api = typeof api;
