/**
 * Engine → UI 的内部事件（非网络消息）。
 *
 * 这些事件是 LocalGameEngine 在关键节点主动 emit 的"离散信号"，
 * 供 UI 层做动画 / 音效 / 切屏（用 subscribe(state) 监听状态变化
 * 不够用的场景）。
 *
 * P2 迁移时：
 * - 一部分事件变为服务端 broadcast（如 reveal:start）
 * - 一部分保持客户端内部事件（如 reveal:item-shown，用于本地演出细节）
 */

import type { ItemInstance } from '../types/item.ts';
import type { PhaseType, RevealResult } from '../types/room.ts';

/** 类型映射表：事件名 → payload 类型。 */
export interface GameEventMap {
  /** 阶段切换（from → to）。 */
  'phase:changed': { from: PhaseType; to: PhaseType };
  /** 某玩家提交出价（公开，不含金额）。 */
  'bid:submitted': { playerId: string };
  /** 揭晓动画开始，UI 按 result 编排演出时间线。 */
  'reveal:start': { result: RevealResult };
  /** 揭晓过程中第 index 件物品出现。 */
  'reveal:item-shown': { item: ItemInstance; index: number };
  /** 本轮结算完成。 */
  'round:ended': { round: number };
  /** 整局结束。 */
  'game:ended': { roomId: string };
}

export type GameEventName = keyof GameEventMap;
