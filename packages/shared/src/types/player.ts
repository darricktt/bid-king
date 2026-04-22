/**
 * 玩家（Player）与出价（Bid）相关类型。
 *
 * 关键设计：
 * - PlayerState 里所有字段都是公开的（可被所有客户端看到）。
 * - BidSubmission 是敏感结构：submitted 公开，amount 私有。
 * - 服务端向客户端广播时必须剥离 amount。
 */

import type { ItemInstance } from './item';

/** 玩家类型：真人 / AI（3 档难度）。 */
export type PlayerKind = 'human' | 'ai-conservative' | 'ai-aggressive' | 'ai-trickster';

/** 座位编号（固定 4 席）。 */
export type SeatIndex = 0 | 1 | 2 | 3;

/**
 * 玩家状态。所有字段可被所有客户端看到。
 */
export interface PlayerState {
  /** 玩家 ID：P1 用 'p1'~'p4'，P2 换成真实 userId。 */
  id: string;
  /** 玩家类型。 */
  kind: PlayerKind;
  /** 昵称。 */
  nickname: string;
  /** 座位。 */
  seat: SeatIndex;
  /** 当前余额（本金）。 */
  balance: number;
  /** 本局已获得的藏品（用于结算与图鉴）。 */
  acquiredItems: ItemInstance[];
  /** 选中的技能 ID（P1 仅记录，P3 补齐效果）。 */
  skillId: string | null;
  /** 连接在线状态（P1 恒为 true，P2 起使用）。 */
  online: boolean;
}

/**
 * 出价提交状态（每回合每玩家一份）。
 *
 * 公开字段：submitted, submittedAt
 * 私有字段：amount（仅服务端 + 出价者本人持有）
 */
export interface BidSubmission {
  playerId: string;
  /** 是否已出价（公开，所有人可见）。 */
  submitted: boolean;
  /**
   * 具体金额（私有字段）。
   * - 服务端：所有玩家的金额都持有。
   * - 客户端：只有自己的能拿到；其他人的即使在 Schema 里也必须被 undefined。
   * - REVEALING 阶段广播 RevealResult 时才会把所有 amount 一次性公开。
   */
  amount?: number;
  /** 提交时间戳（ms）。并列时用于先到先得。 */
  submittedAt?: number;
}

/** 客户端视角的 BidSubmission（只保留公开字段）。 */
export interface BidSubmissionPublicView {
  playerId: string;
  submitted: boolean;
}

/** 把服务端完整 BidSubmission 脱敏成公开视图。 */
export function toBidSubmissionPublicView(b: BidSubmission): BidSubmissionPublicView {
  return { playerId: b.playerId, submitted: b.submitted };
}
