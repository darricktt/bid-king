/**
 * 线索模板（P1 假数据）。
 *
 * 线索在 PREVIEW 阶段陆续暴露给玩家，帮助估价。
 * hintType 决定 UI 展示方式（数量图标 / 材质图标 / 稀有度暗示 / 分类图标）。
 */

import type { ClueDef } from '../types/container';

export const CLUE_TEMPLATES: ClueDef[] = [
  // count：物品数量暗示
  { id: 'clue_count_few', text: '仓库堆叠不多，东西看起来不多', hintType: 'count' },
  { id: 'clue_count_many', text: '密密麻麻塞满了纸箱', hintType: 'count' },

  // material：材质
  { id: 'clue_paper_stack', text: '角落堆着泛黄的纸张', hintType: 'material' },
  { id: 'clue_metal_glint', text: '隐约有金属反光', hintType: 'material' },
  { id: 'clue_wood_smell', text: '闻得到淡淡木头香', hintType: 'material' },
  { id: 'clue_ceramic_sound', text: '踢到地上有清脆碰撞声', hintType: 'material' },
  { id: 'clue_fabric_bundle', text: '一包旧布料塞在角落', hintType: 'material' },
  { id: 'clue_glass_shards', text: '看得到玻璃反光', hintType: 'material' },

  // rarity-hint：稀有度暗示
  { id: 'clue_shiny_corner', text: '深处似乎有什么闪闪发亮的', hintType: 'rarity-hint' },
  { id: 'clue_locked_chest', text: '里面锁着一个小箱子', hintType: 'rarity-hint' },
  { id: 'clue_trash_only', text: '表面看起来只有垃圾', hintType: 'rarity-hint' },
  { id: 'clue_strange_marks', text: '有奇怪的标记', hintType: 'rarity-hint' },
  { id: 'clue_old_label', text: '箱子上贴着年代久远的标签', hintType: 'rarity-hint' },

  // category：分类暗示
  { id: 'clue_cat_electronics', text: '看到几根线缆', hintType: 'category' },
  { id: 'clue_cat_jewelry', text: '有个小绒盒露出一角', hintType: 'category' },
  { id: 'clue_cat_media', text: '一摞光盘或磁带', hintType: 'category' },
  { id: 'clue_cat_tools', text: '一大袋工具', hintType: 'category' },
  { id: 'clue_cat_clothes', text: '大量旧衣物', hintType: 'category' },
];

/** 按 ID 建索引，ContainerGenerator 用 id 引用即可。 */
export const CLUE_BY_ID: Record<string, ClueDef> = Object.fromEntries(
  CLUE_TEMPLATES.map((c) => [c.id, c] as const),
);
