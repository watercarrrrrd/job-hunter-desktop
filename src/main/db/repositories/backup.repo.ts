import Database from 'better-sqlite3';
import type { BackupRecord } from '@shared/types';

/** 备份文件格式版本，导入时据此做兼容校验 */
export const BACKUP_SCHEMA_VERSION = 1;

interface ResumeRow {
  id: number;
  name: string;
  template_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ApplicationRow {
  id: number;
  company: string;
  position: string;
  applied_date: string | null;
  channel: string | null;
  resume_id: number | null;
  status: string;
  jd_link: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

interface InterviewRow {
  id: number;
  application_id: number;
  round: string | null;
  type: string | null;
  scheduled_at: string | null;
  location: string | null;
  interviewer: string | null;
  note: string | null;
  result: string;
  review: string | null;
  created_at: string;
  updated_at: string;
}

interface InterviewChecklistRow {
  id: number;
  interview_id: number;
  content: string;
  done: number;
  sort_order: number;
}

interface SettingRow {
  key: string;
  value: string;
}

/** 备份文件顶层结构（导出时写入磁盘，导入时解析校验） */
export interface BackupData {
  schemaVersion: number;
  backupAt: string;
  tables: {
    resumes: ResumeRow[];
    applications: ApplicationRow[];
    interviews: InterviewRow[];
    interviewChecklists: InterviewChecklistRow[];
    settings: SettingRow[];
  };
}

interface BackupHistoryRow {
  id: number;
  backup_path: string;
  backup_at: string;
  type: 'manual' | 'auto';
  data_count: number;
  size: number;
}

function toBackupRecord(row: BackupHistoryRow): BackupRecord {
  return {
    id: row.id,
    backupPath: row.backup_path,
    backupAt: row.backup_at,
    type: row.type,
    dataCount: row.data_count,
    size: row.size,
  };
}

export function listBackupRecords(db: Database.Database): BackupRecord[] {
  const rows = db
    .prepare('SELECT * FROM backup_history ORDER BY backup_at DESC')
    .all() as BackupHistoryRow[];
  return rows.map(toBackupRecord);
}

export function insertBackupRecord(
  db: Database.Database,
  input: {
    path: string;
    backupAt: string;
    type: 'manual' | 'auto';
    dataCount: number;
    size: number;
  },
): BackupRecord {
  const info = db
    .prepare(
      `INSERT INTO backup_history (backup_path, backup_at, type, data_count, size)
       VALUES (@path, @backupAt, @type, @dataCount, @size)`,
    )
    .run({
      path: input.path,
      backupAt: input.backupAt,
      type: input.type,
      dataCount: input.dataCount,
      size: input.size,
    });
  const row = db
    .prepare('SELECT * FROM backup_history WHERE id = ?')
    .get(Number(info.lastInsertRowid)) as BackupHistoryRow;
  return toBackupRecord(row);
}

/** 快照读取全部业务数据（含自增 id，保证恢复后关联关系不变） */
export function exportAll(db: Database.Database): BackupData {
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    backupAt: new Date().toISOString(),
    tables: {
      resumes: db.prepare('SELECT * FROM resumes ORDER BY id').all() as ResumeRow[],
      applications: db.prepare('SELECT * FROM applications ORDER BY id').all() as ApplicationRow[],
      interviews: db.prepare('SELECT * FROM interviews ORDER BY id').all() as InterviewRow[],
      interviewChecklists: db
        .prepare('SELECT * FROM interview_checklists ORDER BY id')
        .all() as InterviewChecklistRow[],
      settings: db.prepare('SELECT * FROM settings ORDER BY key').all() as SettingRow[],
    },
  };
}

/** 覆盖式恢复：先清空业务表，再按原始 id 回插，全程单个事务保证原子性 */
export function restoreAll(db: Database.Database, data: BackupData): void {
  const insertResume = db.prepare(
    `INSERT INTO resumes (id, name, template_id, content, created_at, updated_at)
     VALUES (@id, @name, @template_id, @content, @created_at, @updated_at)`,
  );
  const insertApplication = db.prepare(
    `INSERT INTO applications
       (id, company, position, applied_date, channel, resume_id, status, jd_link, note, created_at, updated_at)
     VALUES
       (@id, @company, @position, @applied_date, @channel, @resume_id, @status, @jd_link, @note, @created_at, @updated_at)`,
  );
  const insertInterview = db.prepare(
    `INSERT INTO interviews
       (id, application_id, round, type, scheduled_at, location, interviewer, note, result, review, created_at, updated_at)
     VALUES
       (@id, @application_id, @round, @type, @scheduled_at, @location, @interviewer, @note, @result, @review, @created_at, @updated_at)`,
  );
  const insertChecklist = db.prepare(
    `INSERT INTO interview_checklists (id, interview_id, content, done, sort_order)
     VALUES (@id, @interview_id, @content, @done, @sort_order)`,
  );
  const insertSetting = db.prepare(
    'INSERT INTO settings (key, value) VALUES (@key, @value)',
  );

  const tx = db.transaction(() => {
    db.prepare('DELETE FROM interview_checklists').run();
    db.prepare('DELETE FROM interviews').run();
    db.prepare('DELETE FROM applications').run();
    db.prepare('DELETE FROM resumes').run();
    db.prepare('DELETE FROM settings').run();

    for (const row of data.tables.resumes) insertResume.run(row);
    for (const row of data.tables.applications) insertApplication.run(row);
    for (const row of data.tables.interviews) insertInterview.run(row);
    for (const row of data.tables.interviewChecklists) insertChecklist.run(row);
    for (const row of data.tables.settings) insertSetting.run(row);
  });

  tx();
}
