import Database from 'better-sqlite3';
import type {
  CreateChecklistInput,
  CreateInterviewInput,
  Interview,
  InterviewChecklist,
  InterviewResult,
  UpdateChecklistInput,
  UpdateInterviewInput,
} from '@shared/types';

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

export function updateInterview(
  db: Database.Database,
  input: UpdateInterviewInput,
): Interview | null {
  const existing = getInterview(db, input.id);
  if (!existing) return null;

  const merged = {
    round: input.round !== undefined ? input.round : existing.round,
    type: input.type !== undefined ? input.type : existing.type,
    scheduledAt: input.scheduledAt !== undefined ? input.scheduledAt : existing.scheduledAt,
    location: input.location !== undefined ? input.location : existing.location,
    interviewer: input.interviewer !== undefined ? input.interviewer : existing.interviewer,
    note: input.note !== undefined ? input.note : existing.note,
    review: input.review !== undefined ? input.review : existing.review,
  };
  const now = new Date().toISOString();

  db.prepare(
    `UPDATE interviews
     SET round = @round, type = @type, scheduled_at = @scheduledAt, location = @location,
         interviewer = @interviewer, note = @note, review = @review, updated_at = @now
     WHERE id = @id`,
  ).run({
    id: input.id,
    ...merged,
    now,
  });

  return getInterview(db, input.id);
}

export function updateInterviewResult(
  db: Database.Database,
  id: number,
  result: InterviewResult,
  review?: string | null,
): Interview | null {
  const existing = getInterview(db, id);
  if (!existing) return null;

  const now = new Date().toISOString();
  db.prepare(
    'UPDATE interviews SET result = @result, review = @review, updated_at = @now WHERE id = @id',
  ).run({
    id,
    result,
    review: review !== undefined ? review : existing.review,
    now,
  });

  return getInterview(db, id);
}

export function deleteInterview(db: Database.Database, id: number): boolean {
  const info = db.prepare('DELETE FROM interviews WHERE id = ?').run(id);
  return info.changes > 0;
}

interface ChecklistRow {
  id: number;
  interview_id: number;
  content: string;
  done: number;
  sort_order: number;
}

function toChecklist(row: ChecklistRow): InterviewChecklist {
  return {
    id: row.id,
    interviewId: row.interview_id,
    content: row.content,
    done: row.done === 1,
    sortOrder: row.sort_order,
  };
}

export function listChecklist(
  db: Database.Database,
  interviewId: number,
): InterviewChecklist[] {
  const rows = db
    .prepare(
      'SELECT * FROM interview_checklists WHERE interview_id = ? ORDER BY sort_order ASC, id ASC',
    )
    .all(interviewId) as ChecklistRow[];
  return rows.map(toChecklist);
}

export function createChecklist(
  db: Database.Database,
  input: CreateChecklistInput,
): InterviewChecklist {
  const maxRow = db
    .prepare(
      'SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM interview_checklists WHERE interview_id = ?',
    )
    .get(input.interviewId) as { max_order: number };
  const sortOrder = maxRow.max_order + 1;

  const info = db
    .prepare(
      'INSERT INTO interview_checklists (interview_id, content, done, sort_order) VALUES (@interviewId, @content, 0, @sortOrder)',
    )
    .run({ interviewId: input.interviewId, content: input.content, sortOrder });
  return getChecklist(db, Number(info.lastInsertRowid)) as InterviewChecklist;
}

export function getChecklist(db: Database.Database, id: number): InterviewChecklist | null {
  const row = db
    .prepare('SELECT * FROM interview_checklists WHERE id = ?')
    .get(id) as ChecklistRow | undefined;
  return row ? toChecklist(row) : null;
}

export function updateChecklist(
  db: Database.Database,
  input: UpdateChecklistInput,
): InterviewChecklist | null {
  const existing = getChecklist(db, input.id);
  if (!existing) return null;

  const merged = {
    content: input.content ?? existing.content,
    done: input.done !== undefined ? (input.done ? 1 : 0) : existing.done ? 1 : 0,
    sortOrder: input.sortOrder ?? existing.sortOrder,
  };

  db.prepare(
    'UPDATE interview_checklists SET content = @content, done = @done, sort_order = @sortOrder WHERE id = @id',
  ).run({ id: input.id, ...merged });

  return getChecklist(db, input.id);
}

export function deleteChecklist(db: Database.Database, id: number): boolean {
  const info = db.prepare('DELETE FROM interview_checklists WHERE id = ?').run(id);
  return info.changes > 0;
}
