/**
 * 房间（Room）状态机与整体状态。
 *
 * 关键设计：
 * - Phase 是整局的权威状态机；所有行为都要求合法 phase。
 * - RoomState 是"服务端权威视图"（P1 由 LocalGameEngine 持有）。
 * - 客户端收到的应是 RoomStatePublicView，脱敏 currentContainer.items 与
 *   currentBids[*].amount。
 * - 所有时间戳用 Number（ms），由服务端下发 deadline，客户端本地倒计时。
 */

import type { BidSubmission, BidSubmissionPublicView, PlayerState } from './player';
import type { ContainerInstance, ContainerPublicView } from './container';
import type { ItemInstance } from './item';

/** ------------- Phase 定义 ------------- */

export const Phase = {
  /** 等待玩家就绪。P1 自动跳过，P2 用于匹配后等候。 */
  WAITING: 'WAITING',
  /** 展示阶段：轮播集装箱 + 放线索。 */
  PREVIEW: 'PREVIEW',
  /** 暗标出价。 */
  BIDDING: 'BIDDING',
  /** 揭晓出价 + 开箱演出。 */
  REVEALING: 'REVEALING',
  /** 结算：扣余额、藏品入库、展示盈亏。 */
  SETTLING: 'SETTLING',
  /** 下一个仓库（回到 PREVIEW）或整局结束。 */
  END: 'END',
} as const;

export type PhaseType = (typeof Phase)[keyof typeof Phase];

/** 合法的状态转移。 */
export const PHASE_TRANSITIONS: Record<PhaseType, readonly PhaseType[]> = {
  WAITING: ['PREVIEW'],
  PREVIEW: ['BIDDING'],
  BIDDING: ['REVEALING'],
  REVEALING: ['SETTLING'],
  SETTLING: ['PREVIEW', 'END'],
  END: [],
} as const;

/** 判断 phase 转移是否合法。 */
export function canTransition(from: PhaseType, to: PhaseType): boolean {
  return PHASE_TRANSITIONS[from].includes(to);
}

/** ------------- RoomState ------------- */

/** 结算结果（REVEALING 阶段生成，SETTLING 阶段展示）。 */
export interface RevealResult {
  containerId: string;
  /** 胜者玩家 ID；全员放弃时为 null。 */
  winnerId: string | null;
  /** 成交价；无人成交时为 0。 */
  winningBid: number;
  /** 所有玩家的出价（REVEAL 阶段全量公开）。 */
  allBids: Record<string, number>;
  /** 胜者获得的藏品（REVEAL 阶段才揭晓）。 */
  items: ItemInstance[];
  /** 藏品折现总价。 */
  totalValue: number;
  /** 盈亏 = totalValue - winningBid。 */
  profit: number;
}

/**
 * 房间状态（服务端权威视图 / P1 LocalGameEngine 内部视图）。
 *
 * ⚠️ 此类型不应直接广播到客户端，广播时必须用 RoomStatePublicView。
 */
export interface RoomState {
  roomId: string;
  phase: PhaseType;
  /** 当前阶段截止时间戳（ms）；客户端自己倒计时。 */
  phaseDeadline: number;
  /** 当前第几回合（从 1 开始）。 */
  round: number;
  /** 本局总回合数 / 仓库数。 */
  totalRounds: number;
  /** 玩家字典（id → state）。 */
  players: Record<string, PlayerState>;
  /** 当前在拍的仓库（服务端完整视图）。 */
  currentContainer: ContainerInstance | null;
  /** 当前回合的出价（服务端完整视图）。 */
  currentBids: Record<string, BidSubmission>;
  /** 上一回合揭晓结果。 */
  lastReveal: RevealResult | null;
}

/**
 * 客户端可见的房间状态（敏感字段已脱敏）。
 *
 * 区别：
 * - currentContainer → ContainerPublicView（无 items）
 * - currentBids → Record<id, BidSubmissionPublicView>（无 amount）
 */
export interface RoomStatePublicView {
  roomId: string;
  phase: PhaseType;
  phaseDeadline: number;
  round: number;
  totalRounds: number;
  players: Record<string, PlayerState>;
  currentContainer: ContainerPublicView | null;
  currentBids: Record<string, BidSubmissionPublicView>;
  lastReveal: RevealResult | null;
}
