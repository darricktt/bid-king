/**
 * @bid-king/shared - 客户端与服务端共享的协议、常量、类型定义。
 *
 * 规范（见 docs/开发规范.md 第 10 节）：
 * - 所有对外 API 必须从此文件统一导出。
 * - 严禁跨包深路径 import（如 '@bid-king/shared/src/xxx' ❌）。
 * - 协议变更必须走 PR，并在标题打 [BREAKING] 标签。
 */

export const SHARED_VERSION = '0.1.0';

/** 健康检查响应体，服务端 /health 使用。 */
export interface HealthCheckPayload {
  ok: boolean;
  ts: number;
  sharedVersion: string;
}

// ------------ 类型 ------------
export * from './types/item';
export * from './types/container';
export * from './types/player';
export * from './types/skill';
export * from './types/room';

// ------------ 状态机 ------------
export * from './state-machine/phases';

// ------------ 常量 ------------
export * from './constants/errorCodes';
export * from './constants/gameConstants';
export * from './constants/skillIds';

// ------------ 消息 / 意图 / 事件 ------------
export * from './messages/intents';
export * from './messages/events';

// ------------ 配置数据 ------------
export * from './data/items';
export * from './data/clueTemplates';
export * from './data/containerTemplates';
export * from './data/skills';
