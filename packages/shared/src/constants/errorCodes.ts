/**
 * 全局错误码。
 *
 * 分段约定：
 *   1xxx 鉴权
 *   2xxx 出价
 *   3xxx 技能
 *   4xxx 匹配 / 房间
 *   5xxx 结算 / 经济
 *   9xxx 系统
 *
 * 规则：
 * - 一旦发布，已分配的错误码不可改变含义。
 * - 客户端根据错误码做 UI 提示，不依赖 message 字符串。
 */

export const ErrorCode = {
  OK: 0,

  // ------------ 1xxx 鉴权 ------------
  AUTH_REQUIRED: 1001,
  AUTH_INVALID: 1002,

  // ------------ 2xxx 出价 ------------
  BID_OUT_OF_RANGE: 2001,
  BID_TOO_LATE: 2002,
  BID_INSUFFICIENT_BALANCE: 2003,
  BID_DUPLICATED: 2004,
  BID_INVALID_PHASE: 2005,

  // ------------ 3xxx 技能 ------------
  SKILL_ON_COOLDOWN: 3001,
  SKILL_EXHAUSTED: 3002,
  SKILL_UNKNOWN: 3003,
  SKILL_INVALID_TARGET: 3004,
  SKILL_INVALID_PHASE: 3005,

  // ------------ 4xxx 匹配 / 房间 ------------
  ROOM_NOT_FOUND: 4001,
  ROOM_FULL: 4002,
  ROOM_IN_GAME: 4003,
  ROOM_INVALID_ACTION: 4004,

  // ------------ 5xxx 结算 / 经济 ------------
  ECON_INVALID_SETTLEMENT: 5001,

  // ------------ 9xxx 系统 ------------
  INTERNAL_ERROR: 9001,
  RATE_LIMITED: 9002,
  VALIDATION_FAILED: 9003,
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/** 错误码的默认消息（用于日志与开发调试，不用于 UI 展示）。 */
export const ERROR_MESSAGE: Record<ErrorCodeType, string> = {
  [ErrorCode.OK]: 'ok',

  [ErrorCode.AUTH_REQUIRED]: '需要登录',
  [ErrorCode.AUTH_INVALID]: '登录凭证无效',

  [ErrorCode.BID_OUT_OF_RANGE]: '出价超出允许范围',
  [ErrorCode.BID_TOO_LATE]: '出价已过截止时间',
  [ErrorCode.BID_INSUFFICIENT_BALANCE]: '余额不足',
  [ErrorCode.BID_DUPLICATED]: '已提交出价，不可重复',
  [ErrorCode.BID_INVALID_PHASE]: '当前阶段不允许出价',

  [ErrorCode.SKILL_ON_COOLDOWN]: '技能冷却中',
  [ErrorCode.SKILL_EXHAUSTED]: '技能使用次数已耗尽',
  [ErrorCode.SKILL_UNKNOWN]: '未知技能 ID',
  [ErrorCode.SKILL_INVALID_TARGET]: '技能目标无效',
  [ErrorCode.SKILL_INVALID_PHASE]: '当前阶段不允许使用此技能',

  [ErrorCode.ROOM_NOT_FOUND]: '房间不存在',
  [ErrorCode.ROOM_FULL]: '房间已满',
  [ErrorCode.ROOM_IN_GAME]: '房间已开始，无法加入',
  [ErrorCode.ROOM_INVALID_ACTION]: '当前状态不允许此操作',

  [ErrorCode.ECON_INVALID_SETTLEMENT]: '结算数据异常',

  [ErrorCode.INTERNAL_ERROR]: '服务器内部错误',
  [ErrorCode.RATE_LIMITED]: '操作过于频繁',
  [ErrorCode.VALIDATION_FAILED]: '参数校验失败',
};
