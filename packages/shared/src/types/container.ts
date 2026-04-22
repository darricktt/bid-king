/**
 * 仓库（Container）相关类型。
 *
 * 仓库是竞拍的基本单位。每局游戏会依次拍卖 N 个仓库。
 *
 * 关键设计：
 * - ContainerTemplate 是模板（期望总价值 + 掉落表 + 线索池）。
 * - ContainerInstance 是实例，生成时会抽取 lootTable + 随机线索。
 * - ContainerPublicView 是给客户端的"脱敏视图"，不包含 items。
 */

import type { ItemInstance, ItemRarity } from './item';

/** 一次掉落条目：在 [min, max] 数量区间内生成某稀有度的物品。 */
export interface LootEntry {
  rarity: ItemRarity;
  /** [min, max]，闭区间。 */
  countRange: [number, number];
}

/** 线索提示类型，决定 UI 展示样式与 AI 判断权重。 */
export type ClueHintType = 'count' | 'material' | 'rarity-hint' | 'category';

/** 线索定义。 */
export interface ClueDef {
  /** 线索 ID，便于国际化和 AI 分析。 */
  id: string;
  /** 展示文案（P1 中文，后续走 i18n）。 */
  text: string;
  /** 提示类型。 */
  hintType: ClueHintType;
}

/** 仓库模板（静态配置）。 */
export interface ContainerTemplate {
  id: string;
  name: string;
  /** 期望总价值，用于决定起拍价与匹配难度。 */
  expectedValue: number;
  /** 掉落规则（每个稀有度的数量区间）。 */
  lootTable: LootEntry[];
  /** 线索池（开局随机抽 N 条暴露给玩家）。 */
  clues: ClueDef[];
}

/**
 * 仓库实例（服务端权威数据）。
 * items 是敏感字段，不可广播到客户端。
 */
export interface ContainerInstance {
  instanceId: string;
  templateId: string;
  /** 仓库名（展示用，一般等于 template.name，可按局扰动）。 */
  name: string;
  /** 起拍价（= expectedValue × startingBidRatio，配置可调）。 */
  startingBid: number;
  /** 实际内含物（服务端权威，仅 REVEAL 阶段暴露）。 */
  items: ItemInstance[];
  /** 本局暴露给玩家的线索（PREVIEW 阶段陆续放出）。 */
  revealedClues: ClueDef[];
  /** 对玩家可见的公开信息。 */
  publicInfo: ContainerPublicInfo;
}

/** 公开信息：客户端可以直接看的部分。 */
export interface ContainerPublicInfo {
  /** 物品总数。 */
  totalItemCount: number;
}

/**
 * 仓库的客户端视图（剔除敏感 items 字段）。
 * 服务端向客户端广播时必须使用此类型。
 */
export interface ContainerPublicView {
  instanceId: string;
  templateId: string;
  name: string;
  startingBid: number;
  revealedClues: ClueDef[];
  publicInfo: ContainerPublicInfo;
}

/** 把服务端 ContainerInstance 转成客户端可见的 ContainerPublicView。 */
export function toContainerPublicView(inst: ContainerInstance): ContainerPublicView {
  return {
    instanceId: inst.instanceId,
    templateId: inst.templateId,
    name: inst.name,
    startingBid: inst.startingBid,
    revealedClues: inst.revealedClues,
    publicInfo: inst.publicInfo,
  };
}
