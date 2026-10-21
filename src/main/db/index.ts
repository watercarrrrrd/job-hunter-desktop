import Database from 'better-sqlite3';
import { app } from 'electron';
import { join } from 'node:path';
import { runMigrations } from './migrations';

let db: Database.Database | null = null;

/**
 * 初始化数据库连接，存储于用户数据目录（userData）。
 * 仅允许在主进程调用，禁止导入到渲染进程。
 */
export function initDatabase(): Database.Database {
  const dbPath = join(app.getPath('userData'), 'jobhunter.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  runMigrations(db);
  return db;
}

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('数据库尚未初始化，请先调用 initDatabase()');
  }
  return db;
}
