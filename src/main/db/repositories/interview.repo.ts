import Database from 'better-sqlite3';
import type { Interview, InterviewResult } from '@shared/types';

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

function toInterview(row: InterviewRow): Interview {
  return {
    id: row.id,
    applicationId: row.application_id,
    round: row.round,
    type: row.type,
    scheduledAt: row.scheduled_at,
    location: row.location,
    interviewer: row.interviewer,
    note: row.note,
    result: row.result as InterviewResult,
    review: row.review,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface CreateInterviewInput {
  applicationId: number;
  round?: string | null;
  type?: string | null;
  scheduledAt?: string | null;
  location?: string | null;
  interviewer?: string | null;
  note?: string | null;
  result?: InterviewResult;
  review?: string | null;
}

export function listInterviews(db: Database.Database): Interview[] {
  const rows = db
    .prepare('SELECT * FROM interviews ORDER BY scheduled_at ASC, id DESC')
    .all() as InterviewRow[];
  return rows.map(toInterview);
}

export function getInterview(db: Database.Database, id: number): Interview | null {
  const row = db.prepare('SELECT * FROM interviews WHERE id = ?').get(id) as
    | InterviewRow
    | undefined;
  return row ? toInterview(row) : null;
}

export function createInterview(db: Database.Database, input: CreateInterviewInput): Interview {
  const now = new Date().toISOString();
  const stmt = db.prepare(
    `INSERT INTO interviews
       (application_id, round, type, scheduled_at, location, interviewer, note, result, review, created_at, updated_at)
     VALUES
       (@applicationId, @round, @type, @scheduledAt, @location, @interviewer, @note, @result, @review, @now, @now)`,
  );
  const info = stmt.run({
    applicationId: input.applicationId,
    round: input.round ?? null,
    type: input.type ?? null,
    scheduledAt: input.scheduledAt ?? null,
    location: input.location ?? null,
    interviewer: input.interviewer ?? null,
    note: input.note ?? null,
    result: input.result ?? 'pending',
    review: input.review ?? null,
    now,
  });
  return getInterview(db, Number(info.lastInsertRowid)) as Interview;
}
