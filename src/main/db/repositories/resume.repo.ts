import Database from 'better-sqlite3';
import type {
  CreateResumeInput,
  Resume,
  ResumeContent,
  ResumeTemplateId,
  UpdateResumeInput,
} from '@shared/types';

interface ResumeRow {
  id: number;
  name: string;
  template_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

function toResume(row: ResumeRow): Resume {
  return {
    id: row.id,
    name: row.name,
    templateId: row.template_id as ResumeTemplateId,
    content: JSON.parse(row.content) as ResumeContent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listResumes(db: Database.Database): Resume[] {
  const rows = db.prepare('SELECT * FROM resumes ORDER BY updated_at DESC').all() as ResumeRow[];
  return rows.map(toResume);
}

export function getResume(db: Database.Database, id: number): Resume | null {
  const row = db.prepare('SELECT * FROM resumes WHERE id = ?').get(id) as ResumeRow | undefined;
  return row ? toResume(row) : null;
}

export function createResume(db: Database.Database, input: CreateResumeInput): Resume {
  const now = new Date().toISOString();
  const stmt = db.prepare(
    `INSERT INTO resumes (name, template_id, content, created_at, updated_at)
     VALUES (@name, @templateId, @content, @now, @now)`,
  );
  const info = stmt.run({
    name: input.name,
    templateId: input.templateId,
    content: JSON.stringify(input.content),
    now,
  });
  return getResume(db, Number(info.lastInsertRowid)) as Resume;
}

export function updateResume(db: Database.Database, input: UpdateResumeInput): Resume | null {
  const existing = getResume(db, input.id);
  if (!existing) return null;

  const name = input.name ?? existing.name;
  const templateId = input.templateId ?? existing.templateId;
  const content = input.content ?? existing.content;
  const now = new Date().toISOString();

  db.prepare(
    `UPDATE resumes
     SET name = @name, template_id = @templateId, content = @content, updated_at = @now
     WHERE id = @id`,
  ).run({
    id: input.id,
    name,
    templateId,
    content: JSON.stringify(content),
    now,
  });

  return getResume(db, input.id);
}

export function deleteResume(db: Database.Database, id: number): boolean {
  const info = db.prepare('DELETE FROM resumes WHERE id = ?').run(id);
  return info.changes > 0;
}
