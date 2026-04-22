/**
 * UI → GameEngine 的意图（Intent）。
 *
 * 关键设计：
 * - UI 组件不直接调 engine 的业务方法，只通过 engine.dispatch(intent) 发送。
 * - P2 阶段 intent 的 type 字符串将直接作为 Colyseus 消息名（零改动迁移）。
 * - 服务端/engine 必须做严格的 intent 校验，不信任任何客户端数据。
 *
 * 命名规范：
 *   '<domain>/<action>'，小写加斜杠。
 *   例：'bid/submit', 'skill/use', 'room/ready'
 */

/** 提交出价。 */
export interface BidSubmitIntent {
  type: 'bid/submit';
  playerId: string;
  amount: number;
}

/** 取消出价（仅 BIDDING 阶段允许，且未被结算）。 */
export interface BidCancelIntent {
  type: 'bid/cancel';
  playerId: string;
}

/** 使用技能。targetId 可选（如洞察需要指向某仓库）。 */
export interface SkillUseIntent {
  type: 'skill/use';
  playerId: string;
  skillId: string;
  targetId?: string;
}

/** 表明玩家就绪（P1 自动；P2 用于匹配成功后的准备）。 */
export interface RoomReadyIntent {
  type: 'room/ready';
  playerId: string;
}

/** 调试意图：仅 P1 DebugPanel 使用，发布构建去除。 */
export interface DebugAdvancePhaseIntent {
  type: 'debug/advance-phase';
}

/** 全部意图的并集。 */
export type PlayerIntent =
  | BidSubmitIntent
  | BidCancelIntent
  | SkillUseIntent
  | RoomReadyIntent
  | DebugAdvancePhaseIntent;

/** 意图类型字符串集合（便于运行时校验 / Colyseus 消息注册）。 */
export const IntentType = {
  BID_SUBMIT: 'bid/submit',
  BID_CANCEL: 'bid/cancel',
  SKILL_USE: 'skill/use',
  ROOM_READY: 'room/ready',
  DEBUG_ADVANCE_PHASE: 'debug/advance-phase',
} as const;

export type IntentTypeStr = (typeof IntentType)[keyof typeof IntentType];
