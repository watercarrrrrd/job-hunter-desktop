import Database from 'better-sqlite3';
import type { Application, ApplicationStatus } from '@shared/types';

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

function toApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    appliedDate: row.applied_date,
    channel: row.channel,
    resumeId: row.resume_id,
    status: row.status as ApplicationStatus,
    jdLink: row.jd_link,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface CreateApplicationInput {
  company: string;
  position: string;
  appliedDate?: string | null;
  channel?: string | null;
  resumeId?: number | null;
  status?: ApplicationStatus;
  jdLink?: string | null;
  note?: string | null;
}

export function listApplications(db: Database.Database): Application[] {
  const rows = db
    .prepare('SELECT * FROM applications ORDER BY applied_date DESC, id DESC')
    .all() as ApplicationRow[];
  return rows.map(toApplication);
}

export function getApplication(db: Database.Database, id: number): Application | null {
  const row = db.prepare('SELECT * FROM applications WHERE id = ?').get(id) as
    | ApplicationRow
    | undefined;
  return row ? toApplication(row) : null;
}

export function createApplication(db: Database.Database, input: CreateApplicationInput): Application {
  const now = new Date().toISOString();
  const stmt = db.prepare(
    `INSERT INTO applications
       (company, position, applied_date, channel, resume_id, status, jd_link, note, created_at, updated_at)
     VALUES
       (@company, @position, @appliedDate, @channel, @resumeId, @status, @jdLink, @note, @now, @now)`,
  );
  const info = stmt.run({
    company: input.company,
    position: input.position,
    appliedDate: input.appliedDate ?? null,
    channel: input.channel ?? null,
    resumeId: input.resumeId ?? null,
    status: input.status ?? 'applied',
    jdLink: input.jdLink ?? null,
    note: input.note ?? null,
    now,
  });
  return getApplication(db, Number(info.lastInsertRowid)) as Application;
}
