/**
 * 仓库模板配置（P1 假数据，6 个模板）。
 *
 * 设计原则：
 * - 每个模板给出明确的期望总价值区间，LocalGameEngine 按此排序做匹配难度。
 * - lootTable 决定掉落结构；clues 复用 clueTemplates 里的通用线索。
 * - 模板间风险梯度（从稳健到高方差）：
 *     garage_basic      → 稳健小利
 *     apartment_messy   → 中小利 + 少量小惊喜
 *     collector_shelf   → 大概率好东西
 *     jewelry_safe      → 高风险高回报（含金银）
 *     estate_sale       → 中高价值，靠 epic 出货
 *     mystery_vault     → 最高方差，legendary 出现概率最高
 */

import { CLUE_BY_ID } from './clueTemplates';
import type { ContainerTemplate } from '../types/container';

/** 按 ID 列表快速组装模板的线索字段。 */
const clues = (...ids: string[]) => ids.map((id) => CLUE_BY_ID[id]).filter(Boolean);

export const CONTAINER_TEMPLATES: ContainerTemplate[] = [
  {
    id: 'garage_basic',
    name: '普通车库',
    expectedValue: 300,
    lootTable: [
      { rarity: 'common', countRange: [4, 7] },
      { rarity: 'rare', countRange: [0, 1] },
    ],
    clues: clues(
      'clue_count_few',
      'clue_paper_stack',
      'clue_metal_glint',
      'clue_wood_smell',
      'clue_trash_only',
      'clue_cat_tools',
    ),
  },
  {
    id: 'apartment_messy',
    name: '凌乱公寓',
    expectedValue: 500,
    lootTable: [
      { rarity: 'common', countRange: [5, 8] },
      { rarity: 'rare', countRange: [1, 2] },
    ],
    clues: clues(
      'clue_count_many',
      'clue_fabric_bundle',
      'clue_shiny_corner',
      'clue_cat_clothes',
      'clue_cat_electronics',
      'clue_glass_shards',
    ),
  },
  {
    id: 'collector_shelf',
    name: '收藏家书架',
    expectedValue: 900,
    lootTable: [
      { rarity: 'common', countRange: [3, 5] },
      { rarity: 'rare', countRange: [2, 3] },
      { rarity: 'epic', countRange: [0, 1] },
    ],
    clues: clues(
      'clue_paper_stack',
      'clue_old_label',
      'clue_cat_media',
      'clue_strange_marks',
      'clue_shiny_corner',
    ),
  },
  {
    id: 'jewelry_safe',
    name: '珠宝保险柜',
    expectedValue: 1400,
    lootTable: [
      { rarity: 'common', countRange: [1, 3] },
      { rarity: 'rare', countRange: [1, 2] },
      { rarity: 'epic', countRange: [1, 2] },
    ],
    clues: clues(
      'clue_count_few',
      'clue_metal_glint',
      'clue_cat_jewelry',
      'clue_locked_chest',
      'clue_shiny_corner',
    ),
  },
  {
    id: 'estate_sale',
    name: '遗产拍卖',
    expectedValue: 1100,
    lootTable: [
      { rarity: 'common', countRange: [4, 6] },
      { rarity: 'rare', countRange: [1, 3] },
      { rarity: 'epic', countRange: [0, 2] },
    ],
    clues: clues(
      'clue_ceramic_sound',
      'clue_old_label',
      'clue_wood_smell',
      'clue_locked_chest',
      'clue_cat_clothes',
    ),
  },
  {
    id: 'mystery_vault',
    name: '神秘金库',
    expectedValue: 2000,
    lootTable: [
      { rarity: 'rare', countRange: [1, 2] },
      { rarity: 'epic', countRange: [1, 2] },
      { rarity: 'legendary', countRange: [0, 1] },
    ],
    clues: clues(
      'clue_locked_chest',
      'clue_shiny_corner',
      'clue_strange_marks',
      'clue_old_label',
      'clue_metal_glint',
    ),
  },
];

/** 按 id 建索引，LocalGameEngine 运行时使用。 */
export const CONTAINER_TEMPLATE_BY_ID: Record<string, ContainerTemplate> = Object.fromEntries(
  CONTAINER_TEMPLATES.map((t) => [t.id, t] as const),
);
