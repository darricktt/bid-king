/**
 * @bid-king/shared - 客户端与服务端共享的协议、常量、类型定义。
 *
 * P0 阶段仅做最小占位，验证跨包 import 通路。
 * P1 阶段开始填充 Item / Container / Player / RoomState / Phase 等核心类型。
 */

export const SHARED_VERSION = '0.1.0';

/**
 * 健康检查响应体，服务端 /health 使用。
 */
export interface HealthCheckPayload {
  ok: boolean;
  ts: number;
  sharedVersion: string;
}
