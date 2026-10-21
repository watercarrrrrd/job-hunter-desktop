import { dialog } from 'electron';
import { readFileSync, statSync, writeFileSync } from 'node:fs';

/**
 * 文件读写与系统对话框封装（仅主进程调用）。
 * 备份/PDF 等落盘能力统一在此处理，service 层不直接接触 Electron 与 Node API。
 */

/** 弹出「另存为」对话框，返回用户选择的绝对路径；取消返回 null */
export async function chooseSavePath(defaultName: string): Promise<string | null> {
  const result = await dialog.showSaveDialog({
    defaultPath: defaultName,
    filters: [{ name: 'JSON 备份', extensions: ['json'] }],
  });
  return result.canceled || !result.filePath ? null : result.filePath;
}

/** 弹出「另存为 PDF」对话框，返回用户选择的绝对路径；取消返回 null */
export async function choosePdfSavePath(defaultName: string): Promise<string | null> {
  const result = await dialog.showSaveDialog({
    defaultPath: defaultName,
    filters: [{ name: 'PDF 文件', extensions: ['pdf'] }],
  });
  return result.canceled || !result.filePath ? null : result.filePath;
}

/** 弹出「打开文件」对话框，返回用户选择的绝对路径；取消返回 null */
export async function chooseOpenPath(): Promise<string | null> {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'JSON 备份', extensions: ['json'] }],
  });
  return result.canceled || result.filePaths.length === 0 ? null : result.filePaths[0];
}

export function writeTextFile(path: string, content: string): void {
  writeFileSync(path, content, 'utf-8');
}

export function writeBinaryFile(path: string, data: Buffer): void {
  writeFileSync(path, data);
}

export function readTextFile(path: string): string {
  return readFileSync(path, 'utf-8');
}

export function getFileSize(path: string): number {
  return statSync(path).size;
}
