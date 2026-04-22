/**
 * 客户端启动引导 Component。
 *
 * 挂载位置：Main.scene → Canvas → Root 节点。
 *
 * 职责：
 * - P0：打印 shared 版本，验证跨包 import 通路。
 * - P1：初始化 LocalGameEngine、构建 UI。
 * - P2：初始化 NetworkManager、连接 Colyseus。
 *
 * 设计约定：Root 节点是整个游戏唯一的挂载入口，
 * 所有子 UI / 管理器都由本 Component 在 onLoad 中以代码方式创建。
 */

import { _decorator, Component } from 'cc';
import { SHARED_VERSION } from '@bid-king/shared';

import { logger } from './logger';

const { ccclass } = _decorator;

@ccclass('Bootstrap')
export class Bootstrap extends Component {
  protected onLoad(): void {
    logger.info('shared version:', SHARED_VERSION);
    logger.info('bootstrap ok');
  }

  protected start(): void {
    // 预留：P1 起在此初始化 LocalGameEngine 与 UIManager。
  }

  protected onDestroy(): void {
    // 预留：清理订阅、关闭网络连接等。
  }
}
