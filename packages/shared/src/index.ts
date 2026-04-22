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
export * from './types/item.ts';
export * from './types/container.ts';
export * from './types/player.ts';
export * from './types/skill.ts';
export * from './types/room.ts';

// ------------ 状态机 ------------
export * from './state-machine/phases.ts';

// ------------ 常量 ------------
export * from './constants/errorCodes.ts';
export * from './constants/gameConstants.ts';
export * from './constants/skillIds.ts';

// ------------ 消息 / 意图 / 事件 ------------
export * from './messages/intents.ts';
export * from './messages/events.ts';

// ------------ 配置数据 ------------
export * from './data/items.ts';
export * from './data/clueTemplates.ts';
export * from './data/containerTemplates.ts';
export * from './data/skills.ts';
