/**
 * 客户端启动引导。
 *
 * 当前（P0）：打印 shared 版本，验证跨包 import 通路。
 * 后续（P1）：初始化 LocalGameEngine、加载主场景。
 * 后续（P2）：初始化 NetworkManager、连接 Colyseus。
 */

import { SHARED_VERSION } from '@bid-king/shared';

import { logger } from './logger';

export function bootstrap(): void {
  logger.info('shared version:', SHARED_VERSION);
  logger.info('bootstrap ok');
}

// 在 Cocos Creator 里，此文件可作为 Component 挂载到入口节点的 onLoad 调用 bootstrap()。
// 为避免 P0 阶段必须开 Cocos Creator，这里仅导出函数，由工程配置或入口 Component 调用。
