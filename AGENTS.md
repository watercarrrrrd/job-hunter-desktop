# AGENTS.md

## 项目概述

JobHunter 是一款面向应届大学生的本地桌面端求职管理工具，整合简历生成、投递追踪、面试管理、求职统计、数据备份五大核心功能，全程本地存储、离线运行。

- 桌面框架：Electron（主进程 / 预加载 / 渲染进程三进程架构）
- 前端：React 18 + TypeScript + Vite
- 样式：Tailwind CSS
- 本地数据库：better-sqlite3（仅运行于主进程）
- PDF 生成：jspdf + html2canvas（运行于渲染进程）
- 图表：ECharts（运行于渲染进程）
- 打包：electron-builder

### 架构分层

- `src/shared/`：主/渲染进程共享的类型、常量、IPC 通道契约（纯类型，无运行时代码）
- `src/main/`：主进程，包含 `db/`（数据访问）、`service/`（业务逻辑）、`ipc/`（IPC 处理器）、`backup/`（备份）、`file/`（文件读写）
- `src/preload/`：预加载脚本，通过 `contextBridge` 暴露 `window.api` 白名单 API
- `src/renderer/`：渲染进程 React 应用，含 `pages/`、`components/`、`hooks/`、`lib/`

调用链路固定为：UI（renderer）→ `window.api`（preload）→ IPC（main）→ service → repository → SQLite。

## 本地启动与打包命令

```bash
# 安装依赖（postinstall 自动执行 electron-builder install-app-deps 重编译原生模块）
npm install

# 开发模式（热更新）
npm run dev

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 构建（编译 main/preload/renderer 三进程）
npm run build

# 打包安装包（Windows NSIS / macOS dmg）
npm run package
```

说明：
- better-sqlite3 为原生模块，首次安装或 Node/Electron 版本变化后需重新执行 `npm run postinstall`。
- 渲染进程禁止引入任何 Node 原生能力，所有系统能力必须通过 preload 暴露的 `window.api` 访问。

## 硬性开发约定

### 技术栈
- 严格使用既定技术栈，未经允许不得引入其他第三方库。
- 构建整合仅允许使用 `electron-vite` 作为开发期工具。

### 代码分层
- 渲染进程禁止直接访问数据库、文件系统或 Node API；所有系统能力通过 `window.api` 调用。
- SQL 只允许出现在 `src/main/db/` 的 repository 中。
- 业务逻辑、校验、跨表事务只允许出现在 `src/main/service/`。
- IPC 处理器（`src/main/ipc/`）只做参数接收与结果返回，不写业务逻辑。

### 类型规范
- 开启 `strict: true`，禁止使用 `any`（确需使用时须注释说明原因）。
- 领域实体、枚举、IPC 请求/响应类型统一定义在 `src/shared/`，跨进程复用，禁止在 main/renderer 各自重复定义。
- 状态、渠道、轮次等枚举用字符串字面量联合类型（union type）表达，禁止魔法字符串散落各处。

### 组件化要求
- 只使用函数式组件 + Hooks，禁止 class 组件。
- 单个组件职责单一，UI 展示与数据逻辑分离；数据获取与副作用抽离到 `hooks/`。
- 可复用控件（Modal、Confirm、表单控件等）放入 `components/`，页面通过组合而非复制实现。

## 代码风格要求

- 命名：组件 PascalCase，普通函数/变量 camelCase，常量 UPPER_SNAKE_CASE。
- 组件文件名与导出组件名一致（如 `ApplicationsPage.tsx` 导出 `ApplicationsPage`）。
- props 使用 `interface` 显式定义类型，接口名 PascalCase。
- 使用 ESLint + Prettier 统一格式，提交前运行 `npm run lint`。
- 导入顺序：外部库 → 内部 `src/shared/` → 相对路径，分组间空行。
- 注释使用中文，解释"为什么"，不重复"做了什么"。
- 禁止提交 `console.log` 调试代码，日志统一走既有封装。

## 基础测试要求

- 使用 Vitest 作为测试框架（仅开发期依赖，不进入生产包）。
- 数据层（repository）与业务层（service）必须覆盖单元测试：使用内存 SQLite（`:memory:`）构建测试库，验证 CRUD、事务与边界条件。
- 纯函数（日期/文案格式化、统计聚合、备份校验）必须有测试。
- 组件测试可选，MVP 阶段优先保证数据层与业务层测试通过。
- 每次改动数据模型或业务逻辑，需同步补充或更新对应测试。
