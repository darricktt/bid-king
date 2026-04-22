/**
 * 技能 ID 常量（P1 先定义三个典型技能，P3 补齐实现）。
 *
 * 约定：
 *   insight_*：洞察类（看物品数量/分类）
 *   sniff_*：嗅探类（感知稀有度）
 *   disrupt_*：干扰类（影响对手）
 */

export const SkillId = {
  /** 洞察：看到某仓库内物品总数（+ 已有 publicInfo 更细的分布）。 */
  INSIGHT_ITEM_COUNT: 'insight_item_count',
  /** 嗅探：感知本仓库是否含有 legendary 稀有度物品。 */
  SNIFF_LEGENDARY: 'sniff_legendary',
  /** 干扰：让所有对手的 BIDDING 阶段倒计时缩短 5 秒。 */
  DISRUPT_RUSH: 'disrupt_rush',
} as const;

export type SkillIdType = (typeof SkillId)[keyof typeof SkillId];
