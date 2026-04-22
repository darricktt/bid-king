/**
 * 客户端启动引导 Component。
 *
 * 挂载位置：Main.scene → Canvas → Root 节点。
 *
 * 职责：
 * - P0：打印 shared 版本，验证跨包 import 通路。
 * - P1 第 0 步（当前）：纯代码构建一个 Hello UI，验证代码优先 UI 路径。
 * - P1 后续：初始化 LocalGameEngine、UIManager、Screen / Widget。
 * - P2：初始化 NetworkManager、连接 Colyseus。
 *
 * 设计约定：Root 节点是整个游戏唯一的挂载入口，所有子 UI / 管理器
 * 都由本 Component 在 onLoad 中以代码方式创建；Main.scene 的节点树
 * 永远只有 Canvas > Root（加上 Camera），不会动态增加静态节点。
 */

import { _decorator, Color, Component, Graphics, Label, Node, UITransform, Vec3, view } from 'cc';
import { SHARED_VERSION } from '@bid-king/shared';

import { logger } from './logger.ts';

const { ccclass } = _decorator;

@ccclass('Bootstrap')
export class Bootstrap extends Component {
  protected onLoad(): void {
    logger.info('shared version:', SHARED_VERSION);
    logger.info('bootstrap ok');

    this.buildHelloUI();
  }

  /**
   * Hello UI - 纯代码构建。
   *
   * 目的：验证"代码优先 UI 模式"链路正常。
   * 后续 P1 会把这里替换成 UIManager.start(this.node)。
   */
  private buildHelloUI(): void {
    const vs = view.getVisibleSize();
    logger.info(`visible size: ${vs.width} x ${vs.height}`);

    // 1) 背景矩形：深灰色，撑满 Canvas
    const bg = this.createRect(
      new Color(20, 24, 32, 255),
      vs.width,
      vs.height,
      new Vec3(0, 0, 0),
      'Background',
    );
    this.node.addChild(bg);

    // 2) 装饰条（蓝色渐变底条）
    const accent = this.createRect(
      new Color(66, 133, 244, 255),
      vs.width,
      8,
      new Vec3(0, -20, 0),
      'Accent',
    );
    this.node.addChild(accent);

    // 3) 中央标题
    const title = this.createLabel(
      '竞拍之王 BidKing',
      64,
      Color.WHITE,
      new Vec3(0, 80, 0),
      'Title',
    );
    this.node.addChild(title);

    // 4) 副标题
    const subtitle = this.createLabel(
      `P1 · Hello · shared v${SHARED_VERSION}`,
      28,
      new Color(180, 200, 255, 255),
      new Vec3(0, 20, 0),
      'Subtitle',
    );
    this.node.addChild(subtitle);

    // 5) 底部提示
    const hint = this.createLabel(
      '代码优先 UI 模式：此界面完全由 TypeScript 构建，未使用任何预制体',
      20,
      new Color(140, 150, 170, 255),
      new Vec3(0, -80, 0),
      'Hint',
    );
    this.node.addChild(hint);

    logger.info('hello ui built');
  }

  // ------------ 临时辅助方法，P1 正式阶段会被 UIBuilder 替代 ------------

  private createLabel(text: string, fontSize: number, color: Color, pos: Vec3, name: string): Node {
    const node = new Node(name);
    node.addComponent(UITransform).setContentSize(1000, fontSize + 12);
    node.setPosition(pos);
    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 4;
    label.color = color;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    return node;
  }

  /**
   * 用 Graphics 组件画纯色矩形。
   *
   * 选择 Graphics 而非 Sprite 的原因：Sprite 需要 SpriteFrame 资源，
   * P1 阶段尚无美术资源，Graphics 可直接在运行时绘制填充色块，
   * 满足"Hello UI 必须能看到颜色块"的验收要求。
   *
   * P3 导入美术资源后，ui.rect() 会切换回 Sprite + 9 宫格方案。
   */
  private createRect(color: Color, w: number, h: number, pos: Vec3, name: string): Node {
    const node = new Node(name);
    node.addComponent(UITransform).setContentSize(w, h);
    node.setPosition(pos);
    const g = node.addComponent(Graphics);
    g.fillColor = color;
    // Graphics 坐标系以节点中心为原点，矩形从 (-w/2, -h/2) 开始
    g.rect(-w / 2, -h / 2, w, h);
    g.fill();
    return node;
  }

  protected start(): void {
    // 预留：P1 起在此初始化 LocalGameEngine 与 UIManager。
  }

  protected onDestroy(): void {
    // 预留：清理订阅、关闭网络连接等。
  }
}
