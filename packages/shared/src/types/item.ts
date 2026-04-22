/**
 * 藏品（Item）相关类型。
 *
 * 关键设计：
 * - ItemDef 是"定义"（配置表中的模板）。
 * - ItemInstance 是"实例"（局内生成的一件具体物品，带 actualValue）。
 * - actualValue 是服务端权威信息，客户端只在 REVEALING 阶段才拿到。
 */

/** 藏品稀有度。越稀有掉落越低、价值越高、开箱演出越夸张。 */
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

/** 藏品定义（静态配置，所有实例共享）。 */
export interface ItemDef {
  /** 配置表主键，全项目唯一。 */
  id: string;
  /** 显示名称。 */
  name: string;
  /** 稀有度。 */
  rarity: ItemRarity;
  /**
   * 折现价值区间 [min, max]。
   * 每次生成实例时在此区间内随机一个 actualValue。
   */
  valueRange: [number, number];
  /**
   * 占位颜色（P1 无美术，用纯色方块代表）。
   * 格式：CSS 颜色字符串，如 '#ffaa00'。
   * P3 导入美术资源后，此字段改由 iconId 指向 SpriteFrame。
   */
  iconPlaceholder: string;
  /** 分类标签，供图鉴过滤和技能联动使用。 */
  tags: string[];
}

/**
 * 一件实际生成的藏品实例。
 *
 * 敏感字段说明：
 * - actualValue 在服务端权威计算后就已固定，仅在 REVEALING 阶段广播给客户端。
 * - P1 阶段 LocalGameEngine 也应严格遵守此约束（通过私有变量隔离）。
 */
export interface ItemInstance {
  /** 局内唯一 ID（generate 时生成）。 */
  instanceId: string;
  /** 对应的 ItemDef.id。 */
  defId: string;
  /** 结算价值（服务端权威，客户端在 REVEALING 前不可见）。 */
  actualValue: number;
}

/** 稀有度掉率权重（配置表参考用，可被配置表覆盖）。 */
export const RARITY_WEIGHT: Record<ItemRarity, number> = {
  common: 70,
  rare: 20,
  epic: 8,
  legendary: 2,
};

/** 稀有度展示颜色（UI 通用）。 */
export const RARITY_COLOR: Record<ItemRarity, string> = {
  common: '#b0b0b0',
  rare: '#4a90e2',
  epic: '#a64ce2',
  legendary: '#e24c4c',
};
