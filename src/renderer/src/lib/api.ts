// 渲染进程统一通过此层访问 window.api，禁止直接使用 window.require / process / Node API。
// 类型契约由 preload 的 `Api` 类型提供，此处仅做单一入口转发。
export const api = window.api;
