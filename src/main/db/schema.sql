-- JobHunter 数据库结构（版本 1）
-- 所有表结构变更需同步在 migrations.ts 中追加迁移，禁止只改本文件。

-- 简历表：简历内容以 JSON 列存储（文档型数据）
CREATE TABLE IF NOT EXISTS resumes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  template_id TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 投递记录表
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  applied_date TEXT,
  channel TEXT,
  resume_id INTEGER,
  status TEXT NOT NULL DEFAULT 'applied',
  jd_link TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_app_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_app_date ON applications(applied_date);
CREATE INDEX IF NOT EXISTS idx_app_resume ON applications(resume_id);

-- 面试记录表
CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL,
  round TEXT,
  type TEXT,
  scheduled_at TEXT,
  location TEXT,
  interviewer TEXT,
  note TEXT,
  result TEXT NOT NULL DEFAULT 'pending',
  review TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_int_app ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_int_time ON interviews(scheduled_at);

-- 面试准备清单项
CREATE TABLE IF NOT EXISTS interview_checklists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  interview_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);

-- 系统设置（键值对）
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 备份记录
CREATE TABLE IF NOT EXISTS backup_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  backup_path TEXT NOT NULL,
  backup_at TEXT NOT NULL DEFAULT (datetime('now')),
  type TEXT NOT NULL DEFAULT 'manual',
  data_count INTEGER NOT NULL DEFAULT 0,
  size INTEGER NOT NULL DEFAULT 0
);
