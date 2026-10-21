import type {
  ApiResult,
  BackupExportResult,
  BackupImportResult,
  BackupPreview,
  BackupRecord,
} from '@shared/types';
import { getDb } from '../db';
import {
  BACKUP_SCHEMA_VERSION,
  exportAll,
  insertBackupRecord,
  listBackupRecords,
  restoreAll,
  type BackupData,
} from '../db/repositories/backup.repo';
import * as fileService from '../file/file.service';
import { ok, runSafely, runSafelyAsync } from './result';

/** 生成不含非法文件名字符的时间戳，用作默认备份文件名 */
function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/** 校验备份文件版本与结构，不合法时抛出异常 */
function validateBackup(data: BackupData): void {
  if (!data || data.schemaVersion !== BACKUP_SCHEMA_VERSION) {
    throw new Error('备份文件版本不兼容或已损坏');
  }
  if (!data.tables || !Array.isArray(data.tables.applications)) {
    throw new Error('备份文件结构不完整');
  }
}

/** 已选择、已校验、待确认导入的备份数据（导入两段式中间态） */
let pendingImport: BackupData | null = null;

export function listBackups(): ApiResult<BackupRecord[]> {
  return runSafely(() => listBackupRecords(getDb()));
}

export async function exportBackup(): Promise<ApiResult<BackupExportResult | null>> {
  const path = await fileService.chooseSavePath(`jobhunter-backup-${timestamp()}.json`);
  if (!path) return ok(null);

  return runSafelyAsync(async () => {
    const data = exportAll(getDb());
    fileService.writeTextFile(path, JSON.stringify(data, null, 2));

    const size = fileService.getFileSize(path);
    const dataCount = data.tables.applications.length + data.tables.interviews.length;
    insertBackupRecord(getDb(), {
      path,
      backupAt: data.backupAt,
      type: 'manual',
      dataCount,
      size,
    });

    return { path, backupAt: data.backupAt, dataCount, size };
  });
}

/** 选择备份文件并解析校验，返回概要供前端二次确认；取消返回 ok(null) */
export async function previewBackup(): Promise<ApiResult<BackupPreview | null>> {
  const path = await fileService.chooseOpenPath();
  if (!path) return ok(null);

  return runSafelyAsync(async () => {
    const raw = fileService.readTextFile(path);
    const data = JSON.parse(raw) as BackupData;
    validateBackup(data);
    pendingImport = data;

    return {
      path,
      backupAt: data.backupAt,
      resumeCount: data.tables.resumes.length,
      applicationCount: data.tables.applications.length,
      interviewCount: data.tables.interviews.length,
      checklistCount: data.tables.interviewChecklists.length,
    };
  });
}

/** 确认后覆盖恢复已预览的备份数据 */
export function confirmImport(): ApiResult<BackupImportResult> {
  return runSafely(() => {
    if (!pendingImport) throw new Error('没有待导入的备份，请先选择备份文件');
    const data = pendingImport;
    pendingImport = null;

    restoreAll(getDb(), data);
    const dataCount = data.tables.applications.length + data.tables.interviews.length;
    return { dataCount, importedAt: new Date().toISOString() };
  });
}
