/**
 * 技能（Skill）相关类型。
 *
 * P1 阶段：仅定义 ID 与元数据，不实现具体效果。
 * P3 阶段：补齐 onPreview / onBidding / onReveal 等钩子。
 *
 * 关键设计：
 * - 信息类技能（洞察/嗅探）产生的信息必须定向下发到持有者，
 *   不能放进公共 RoomState.Schema。
 * - 干扰类技能生效时必须服务端权威计算（如缩短对手时间）。
 */

/** 技能大类。 */
export type SkillCategory = 'insight' | 'sniff' | 'disrupt';

/** 技能定义（静态元数据）。 */
export interface SkillDef {
  /** 技能 ID。 */
  id: string;
  /** 显示名称。 */
  name: string;
  /** 分类。 */
  category: SkillCategory;
  /** 简短描述。 */
  description: string;
  /** 每局可用次数（-1 = 无限，仅 P1 测试时用）。 */
  maxUses: number;
  /** 冷却时间（毫秒，0 = 无冷却）。 */
  cooldownMs: number;
}
