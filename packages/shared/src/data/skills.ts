/**
 * 技能配置（P1 先列出三个，P3 补齐效果实现）。
 */

import { SkillId } from '../constants/skillIds';
import type { SkillDef } from '../types/skill';

export const SKILL_DEFS: SkillDef[] = [
  {
    id: SkillId.INSIGHT_ITEM_COUNT,
    name: '洞察',
    category: 'insight',
    description: '展示阶段查看一个仓库的精确物品数量',
    maxUses: 1,
    cooldownMs: 0,
  },
  {
    id: SkillId.SNIFF_LEGENDARY,
    name: '嗅探',
    category: 'sniff',
    description: '展示阶段感知仓库中是否含有传说物品',
    maxUses: 1,
    cooldownMs: 0,
  },
  {
    id: SkillId.DISRUPT_RUSH,
    name: '催促',
    category: 'disrupt',
    description: '出价阶段让所有对手倒计时缩短 5 秒',
    maxUses: 1,
    cooldownMs: 0,
  },
];

export const SKILL_DEF_BY_ID: Record<string, SkillDef> = Object.fromEntries(
  SKILL_DEFS.map((s) => [s.id, s] as const),
);
