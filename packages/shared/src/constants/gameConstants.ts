/**
 * 核心游戏常量（非数值敏感项，纯机制用）。
 *
 * 可调数值（余额、起拍价比例、轮次数等）放在 data/gameConfig.ts，
 * 方便后续转成配置表。
 */

/** 座位数（始终 4 人局）。 */
export const SEAT_COUNT = 4;

/** 每局固定的仓库数（轮次）。 */
export const ROUNDS_PER_MATCH = 4;

/** 初始本金。 */
export const INITIAL_BALANCE = 2000;

/** 起拍价 = 期望价值 × 此比例。 */
export const STARTING_BID_RATIO = 0.2;

/** 单次出价相对余额的上限比例（防止一次出光）。 */
export const MAX_BID_RATIO = 1.0;

/** 每回合 PREVIEW 阶段暴露的线索数上限。 */
export const MAX_REVEALED_CLUES = 3;

/** 同价时按 submittedAt 升序取胜（先提交者胜）。 */
export const TIE_BREAKER = 'earliest-submit' as const;
