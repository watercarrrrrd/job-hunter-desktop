import { ipcMain } from 'electron';
import { IPC } from '@shared/ipc-channels';
import type { ApiResult } from '@shared/types';
import * as fileService from '../file/file.service';
import { fail, ok } from '../service/result';

/** 文件落盘相关 handler：仅负责参数接收与结果返回，实际 I/O 委托 file.service */
export function registerFileHandlers(): void {
  ipcMain.handle(
    IPC.File.SavePdf,
    async (_event, fileName: string, base64: string): Promise<ApiResult<string | null>> => {
      try {
        const path = await fileService.choosePdfSavePath(fileName);
        if (!path) return ok(null);
        fileService.writeBinaryFile(path, Buffer.from(base64, 'base64'));
        return ok(path);
      } catch (err) {
        return fail(err instanceof Error ? err.message : String(err));
      }
    },
  );
}
