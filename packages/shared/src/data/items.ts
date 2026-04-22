/**
 * 藏品配置表（P1 假数据，P3 起接真实美术与数值）。
 *
 * 数值设计原则（P1 版）：
 * - common  : 1 ~ 30（背景噪声，让仓库里凑数用）
 * - rare    : 60 ~ 300（可见收益主力）
 * - epic    : 400 ~ 1200（出现即翻本）
 * - legendary: 2000 ~ 6000（梦想型，嗅探技能的目标）
 *
 * 初始本金 INITIAL_BALANCE = 2000；期望仓库总值约 300-1500；
 * 玩家应感受到"多数局微利 / 偶尔大爆 / 偶尔踩坑"的情绪节奏。
 */

import type { ItemDef } from '../types/item.ts';

export const ITEM_DEFS: ItemDef[] = [
  // ------------ common（15 条）------------
  {
    id: 'old_newspaper',
    name: '旧报纸',
    rarity: 'common',
    valueRange: [1, 5],
    iconPlaceholder: '#888888',
    tags: ['paper'],
  },
  {
    id: 'rusty_key',
    name: '生锈钥匙',
    rarity: 'common',
    valueRange: [2, 8],
    iconPlaceholder: '#8a6a3b',
    tags: ['metal'],
  },
  {
    id: 'broken_mug',
    name: '破陶瓷杯',
    rarity: 'common',
    valueRange: [1, 6],
    iconPlaceholder: '#a08878',
    tags: ['ceramic'],
  },
  {
    id: 'vhs_tape',
    name: 'VHS 录像带',
    rarity: 'common',
    valueRange: [3, 12],
    iconPlaceholder: '#303030',
    tags: ['media'],
  },
  {
    id: 'plastic_toy',
    name: '塑料玩偶',
    rarity: 'common',
    valueRange: [2, 15],
    iconPlaceholder: '#e28a4a',
    tags: ['toy'],
  },
  {
    id: 'worn_book',
    name: '旧书',
    rarity: 'common',
    valueRange: [5, 20],
    iconPlaceholder: '#8b5a2b',
    tags: ['paper'],
  },
  {
    id: 'old_magazine',
    name: '过期杂志',
    rarity: 'common',
    valueRange: [1, 10],
    iconPlaceholder: '#a0a0a0',
    tags: ['paper'],
  },
  {
    id: 'cheap_necklace',
    name: '廉价项链',
    rarity: 'common',
    valueRange: [4, 18],
    iconPlaceholder: '#c0c0c0',
    tags: ['jewelry'],
  },
  {
    id: 'broken_radio',
    name: '坏收音机',
    rarity: 'common',
    valueRange: [6, 25],
    iconPlaceholder: '#5a5a5a',
    tags: ['electronics'],
  },
  {
    id: 'used_clothes',
    name: '二手衣物',
    rarity: 'common',
    valueRange: [3, 18],
    iconPlaceholder: '#6a8abc',
    tags: ['fabric'],
  },
  {
    id: 'wooden_frame',
    name: '木相框',
    rarity: 'common',
    valueRange: [5, 22],
    iconPlaceholder: '#8b5a2b',
    tags: ['wood'],
  },
  {
    id: 'old_tools',
    name: '老式工具',
    rarity: 'common',
    valueRange: [8, 30],
    iconPlaceholder: '#808080',
    tags: ['metal', 'tool'],
  },
  {
    id: 'glass_bottle',
    name: '玻璃瓶',
    rarity: 'common',
    valueRange: [2, 12],
    iconPlaceholder: '#88ccdd',
    tags: ['glass'],
  },
  {
    id: 'old_clock',
    name: '走时不准的钟',
    rarity: 'common',
    valueRange: [10, 30],
    iconPlaceholder: '#b0a080',
    tags: ['metal'],
  },
  {
    id: 'small_speaker',
    name: '小喇叭',
    rarity: 'common',
    valueRange: [6, 22],
    iconPlaceholder: '#404040',
    tags: ['electronics'],
  },

  // ------------ rare（10 条）------------
  {
    id: 'vintage_watch',
    name: '古董怀表',
    rarity: 'rare',
    valueRange: [120, 400],
    iconPlaceholder: '#d4af37',
    tags: ['metal', 'jewelry'],
  },
  {
    id: 'silver_ring',
    name: '银质戒指',
    rarity: 'rare',
    valueRange: [80, 260],
    iconPlaceholder: '#c0c0c0',
    tags: ['metal', 'jewelry'],
  },
  {
    id: 'camera_old',
    name: '胶片相机',
    rarity: 'rare',
    valueRange: [100, 320],
    iconPlaceholder: '#333333',
    tags: ['electronics'],
  },
  {
    id: 'autograph_book',
    name: '签名本',
    rarity: 'rare',
    valueRange: [60, 220],
    iconPlaceholder: '#8b5a2b',
    tags: ['paper', 'collectible'],
  },
  {
    id: 'old_vinyl',
    name: '绝版黑胶唱片',
    rarity: 'rare',
    valueRange: [90, 300],
    iconPlaceholder: '#1a1a1a',
    tags: ['media', 'collectible'],
  },
  {
    id: 'silver_coin_set',
    name: '银币套装',
    rarity: 'rare',
    valueRange: [150, 380],
    iconPlaceholder: '#b8b8b8',
    tags: ['metal', 'collectible'],
  },
  {
    id: 'porcelain_vase',
    name: '民国瓷瓶',
    rarity: 'rare',
    valueRange: [120, 300],
    iconPlaceholder: '#e4dcc8',
    tags: ['ceramic'],
  },
  {
    id: 'ivory_carving',
    name: '象牙雕件（仿）',
    rarity: 'rare',
    valueRange: [70, 240],
    iconPlaceholder: '#efe7d8',
    tags: ['collectible'],
  },
  {
    id: 'classic_comic',
    name: '创刊号漫画',
    rarity: 'rare',
    valueRange: [100, 280],
    iconPlaceholder: '#e24c4c',
    tags: ['paper', 'collectible'],
  },
  {
    id: 'antique_lamp',
    name: '老式台灯',
    rarity: 'rare',
    valueRange: [80, 250],
    iconPlaceholder: '#b88a3b',
    tags: ['metal'],
  },

  // ------------ epic（6 条）------------
  {
    id: 'jade_pendant',
    name: '翡翠挂坠',
    rarity: 'epic',
    valueRange: [500, 1200],
    iconPlaceholder: '#00c853',
    tags: ['stone', 'jewelry'],
  },
  {
    id: 'rolex_watch',
    name: '名牌腕表',
    rarity: 'epic',
    valueRange: [600, 1100],
    iconPlaceholder: '#d4af37',
    tags: ['metal', 'jewelry'],
  },
  {
    id: 'signed_painting',
    name: '名家题字画',
    rarity: 'epic',
    valueRange: [400, 1000],
    iconPlaceholder: '#8a5a2b',
    tags: ['paper', 'art'],
  },
  {
    id: 'gold_coin',
    name: '纯金金币',
    rarity: 'epic',
    valueRange: [700, 1200],
    iconPlaceholder: '#ffd700',
    tags: ['metal', 'collectible'],
  },
  {
    id: 'rare_book_1st',
    name: '首版珍本书',
    rarity: 'epic',
    valueRange: [500, 1100],
    iconPlaceholder: '#4b2e83',
    tags: ['paper', 'collectible'],
  },
  {
    id: 'diamond_ring',
    name: '小克拉钻戒',
    rarity: 'epic',
    valueRange: [800, 1200],
    iconPlaceholder: '#e0e0ff',
    tags: ['stone', 'jewelry'],
  },

  // ------------ legendary（4 条）------------
  {
    id: 'red_mystery_box',
    name: '神秘红箱',
    rarity: 'legendary',
    valueRange: [3000, 6000],
    iconPlaceholder: '#d50000',
    tags: ['mystery'],
  },
  {
    id: 'royal_seal',
    name: '皇家印章',
    rarity: 'legendary',
    valueRange: [2500, 5000],
    iconPlaceholder: '#b8860b',
    tags: ['metal', 'history'],
  },
  {
    id: 'masterpiece_painting',
    name: '大师真迹',
    rarity: 'legendary',
    valueRange: [3500, 6500],
    iconPlaceholder: '#6a3d9a',
    tags: ['art'],
  },
  {
    id: 'ming_vase',
    name: '明代青花',
    rarity: 'legendary',
    valueRange: [2800, 5500],
    iconPlaceholder: '#1e4d7a',
    tags: ['ceramic', 'history'],
  },
];

/** 按 id 建立索引（LocalGameEngine 运行时使用）。 */
export const ITEM_DEF_BY_ID: Record<string, ItemDef> = Object.fromEntries(
  ITEM_DEFS.map((i) => [i.id, i] as const),
);

/** 按稀有度分组（ContainerGenerator 使用）。 */
export const ITEM_DEFS_BY_RARITY: Record<string, ItemDef[]> = {
  common: ITEM_DEFS.filter((i) => i.rarity === 'common'),
  rare: ITEM_DEFS.filter((i) => i.rarity === 'rare'),
  epic: ITEM_DEFS.filter((i) => i.rarity === 'epic'),
  legendary: ITEM_DEFS.filter((i) => i.rarity === 'legendary'),
};
