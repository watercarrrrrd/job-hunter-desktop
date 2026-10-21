import Database from 'better-sqlite3';
import schemaSql from './schema.sql?raw';

/** 当前最新 schema 版本号 */
const LATEST_VERSION = 1;

/**
 * 基于 PRAGMA user_version 的迁移执行器。
 * 表结构变更时：更新 schema.sql、递增 LATEST_VERSION，并在下方追加对应版本的迁移脚本。
 */
export function runMigrations(db: Database.Database): void {
  const current = db.pragma('user_version', { simple: true }) as number;

  if (current >= LATEST_VERSION) {
    return;
  }

  const migrate = db.transaction(() => {
    if (current < 1) {
      db.exec(schemaSql);
    }
    // 未来版本在此追加，例如：if (current < 2) { db.exec('ALTER TABLE ...'); }
    db.pragma(`user_version = ${LATEST_VERSION}`);
  });

  migrate();
}
