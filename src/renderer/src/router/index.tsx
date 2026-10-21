import type { ComponentType } from 'react';
import ResumePage from '../pages/ResumePage';
import ApplicationsPage from '../pages/ApplicationsPage';
import InterviewsPage from '../pages/InterviewsPage';
import DashboardPage from '../pages/DashboardPage';
import BackupPage from '../pages/BackupPage';
import SettingsPage from '../pages/SettingsPage';

export type PageKey =
  | 'resume'
  | 'applications'
  | 'interviews'
  | 'dashboard'
  | 'backup'
  | 'settings';

export interface NavItem {
  key: PageKey;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'resume', label: '简历管理' },
  { key: 'applications', label: '投递追踪' },
  { key: 'interviews', label: '面试管理' },
  { key: 'dashboard', label: '统计看板' },
  { key: 'backup', label: '数据备份' },
  { key: 'settings', label: '系统设置' },
];

export const PAGES: Record<PageKey, ComponentType> = {
  resume: ResumePage,
  applications: ApplicationsPage,
  interviews: InterviewsPage,
  dashboard: DashboardPage,
  backup: BackupPage,
  settings: SettingsPage,
};
