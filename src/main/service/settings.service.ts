import { app } from 'electron';
import type { ApiResult, SystemInfo } from '@shared/types';
import { getDbPath } from '../db';
import { runSafely } from './result';

const PRODUCT_DESCRIPTION = '面向应届大学生的本地桌面端求职管理工具';

/** 组装系统信息（应用版本、Electron 版本、数据库路径等），供设置页展示 */
export function getSystemInfo(): ApiResult<SystemInfo> {
  return runSafely(() => ({
    appName: app.getName(),
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    dbPath: getDbPath(),
    description: PRODUCT_DESCRIPTION,
  }));
}
