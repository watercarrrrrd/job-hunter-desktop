import { contextBridge, ipcRenderer } from 'electron';
import { IPC, type PingResult } from '@shared/ipc-channels';

const api = {
  ping: (): Promise<PingResult> => ipcRenderer.invoke(IPC.Ping),
};

contextBridge.exposeInMainWorld('api', api);

export type Api = typeof api;
