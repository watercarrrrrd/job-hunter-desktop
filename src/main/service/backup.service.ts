import type {
  ApiResult,
  BackupExportResult,
  BackupImportResult,
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
import { fail, runSafely, runSafelyAsync } from './result';

/** 生成不含非法文件名字符的时间戳，用作默认备份文件名 */
function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

export function listBackups(): ApiResult<BackupRecord[]> {
  return runSafely(() => listBackupRecords(getDb()));
}

export async function exportBackup(): Promise<ApiResult<BackupExportResult>> {
  const path = await fileService.chooseSavePath(`jobhunter-backup-${timestamp()}.json`);
  if (!path) return fail('已取消导出');

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

export async function importBackup(): Promise<ApiResult<BackupImportResult>> {
  const path = await fileService.chooseOpenPath();
  if (!path) return fail('已取消导入');

  return runSafelyAsync(async () => {
    const raw = fileService.readTextFile(path);
    const data = JSON.parse(raw) as BackupData;

    if (!data || data.schemaVersion !== BACKUP_SCHEMA_VERSION) {
      throw new Error('备份文件版本不兼容或已损坏');
    }
    if (!data.tables || !Array.isArray(data.tables.applications)) {
      throw new Error('备份文件结构不完整');
    }

    restoreAll(getDb(), data);
    const dataCount = data.tables.applications.length + data.tables.interviews.length;
    return { dataCount, importedAt: new Date().toISOString() };
  });
}
