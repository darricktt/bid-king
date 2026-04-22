/**
 * 状态机辅助：phase 转移校验 + duration 查询。
 *
 * canTransition 在 types/room.ts 里定义（避免循环依赖）；
 * 本文件只放"纯查询 + 常量组合"类的工具。
 */

import { Phase, type PhaseType } from '../types/room';

/** 每阶段时长（毫秒）。P1 固定，P2 由服务端按配置下发。 */
export const PHASE_DURATION_MS: Record<PhaseType, number> = {
  [Phase.WAITING]: 0,
  [Phase.PREVIEW]: 15_000,
  [Phase.BIDDING]: 12_000,
  [Phase.REVEALING]: 6_000,
  [Phase.SETTLING]: 4_000,
  [Phase.END]: 0,
};

/** 有限阶段（非 0 时长）的顺序，供 UI 显示阶段轴用。 */
export const PHASE_SEQUENCE: readonly PhaseType[] = [
  Phase.PREVIEW,
  Phase.BIDDING,
  Phase.REVEALING,
  Phase.SETTLING,
] as const;

/** 阶段显示文本（UI 横幅用，P1 中文硬编码）。 */
export const PHASE_LABEL: Record<PhaseType, string> = {
  [Phase.WAITING]: '等待开始',
  [Phase.PREVIEW]: '展示',
  [Phase.BIDDING]: '暗标出价',
  [Phase.REVEALING]: '揭晓',
  [Phase.SETTLING]: '结算',
  [Phase.END]: '对局结束',
};

/** 阶段配色（UI 横幅、倒计时环用）。 */
export const PHASE_COLOR: Record<PhaseType, string> = {
  [Phase.WAITING]: '#7a7a7a',
  [Phase.PREVIEW]: '#4a90e2',
  [Phase.BIDDING]: '#e2a04a',
  [Phase.REVEALING]: '#a64ce2',
  [Phase.SETTLING]: '#4ce27a',
  [Phase.END]: '#707070',
};
