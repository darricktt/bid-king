# P1 核心循环原型 - 技术方案

> 阶段：**P1 核心循环原型**  
> 周期：**Week 2-3（2 周）**  
> 依赖：**P0 完成**（Monorepo、shared 包、Cocos 项目、规范就绪）  
> 目标：**不联机、不登录、不持久化**，在本地单机把"一局到底"的主玩法跑通，验证体验节奏和爽点。  
> 里程碑：**M1 — 一个人可以用 3 个 AI 打完整一局**

---

## 一、方案概述

P1 是整个项目的"玩法试金石"。这一阶段不做任何后端、网络、持久化，但**必须把后续会联机的所有数据结构、状态机、事件模型提前按服务端权威形态设计**，在 P2 接入 Colyseus 时做**最小改动**即可迁移。

### 交付物一览

| 交付物             | 位置                                      | 形态                                          |
| ------------------ | ----------------------------------------- | --------------------------------------------- |
| 核心数据结构       | `packages/shared/src/`                    | Item / Container / Skill / Player / RoomState |
| 状态机定义         | `packages/shared/src/state-machine/`      | Phase 枚举 + 转移规则                         |
| 本地游戏引擎       | `packages/client/assets/scripts/game/`    | `LocalGameEngine`（模拟服务端权威）           |
| AI 行为            | `packages/client/assets/scripts/game/ai/` | 3 档难度 AI                                   |
| 配置表与数据       | `packages/shared/src/data/`               | 物品表、仓库模板、线索模板                    |
| 主循环 UI          | `packages/client/assets/`                 | 场景 + 预制体 + 脚本                          |
| 开箱演出           | `packages/client/assets/`                 | 读条 + 粒子 + Tween                           |
| 配置表工具（雏形） | `tools/config-gen/`                       | Excel/CSV → JSON（可选，能手写就先手写）      |

### 不做的事（明确界定）

- 不做任何网络通信（P2 做）。
- 不做账号、持久化、排行榜（P3 做）。
- 不做干员技能的 UI/特效（只做数据框架，P3 完整实现）。
- 不做经济系统制衡（P3 做）。
- 不做美术资源（用占位图/几何体，P3/P4 替换）。
- 不做音效资源（留占位，接口就位即可）。

### P1 核心设计原则

> **"写的时候当它是单机，设计的时候当它是联机。"**

所有与"谁有权力改状态"相关的逻辑，都必须走 `LocalGameEngine`（充当本地的"服务端"），UI 层只能订阅状态、发意图。P2 阶段把 `LocalGameEngine` 换成 Colyseus Room，UI 层零改动。

---

## 二、架构总览

### 2.1 分层与依赖

```
┌───────────────────────────────────────────────┐
│  UI 层（Cocos 组件）                          │
│  - BiddingPanel / ContainerView / RevealPanel │
│  - 只负责订阅状态、发 intent                  │
└─────────────────┬─────────────────────────────┘
                  │ subscribe / dispatch intent
                  ▼
┌───────────────────────────────────────────────┐
│  游戏引擎层（LocalGameEngine）                │
│  - 权威状态持有者                              │
│  - 状态机驱动                                  │
│  - 出价/技能/结算全部在此计算                  │
└─────────────────┬─────────────────────────────┘
                  │ uses
                  ▼
┌───────────────────────────────────────────────┐
│  shared 层（协议、常量、类型、数据）          │
│  - RoomState / Player / Container / Item      │
│  - Phase 状态机                                │
│  - 配置表（物品、仓库模板）                    │
└───────────────────────────────────────────────┘
```

**UI 层永远不直接读/写 state，也不直接调 engine 的内部方法**，只走两条通道：

- `engine.dispatch(intent)`：发意图（如"提交出价"）。
- `engine.subscribe(listener)`：订阅状态变化。

这个约束是 P2 零改动迁移的命脉。

### 2.2 目录结构

```
packages/
├── shared/src/
│   ├── constants/
│   │   ├── errorCodes.ts          # P0 已留，P1 填充
│   │   ├── gameConstants.ts       # 回合时长、起拍价、最大出价倍数
│   │   └── skillIds.ts            # 技能 ID 枚举（定义不实现）
│   ├── types/
│   │   ├── item.ts
│   │   ├── container.ts
│   │   ├── player.ts
│   │   ├── skill.ts
│   │   └── room.ts                # RoomState、Phase
│   ├── state-machine/
│   │   └── phases.ts              # 状态定义 + 合法转移
│   ├── data/
│   │   ├── items.ts               # 20-30 件假藏品
│   │   ├── containerTemplates.ts  # 5-8 个仓库模板
│   │   └── clueTemplates.ts       # 线索文案模板
│   ├── messages/
│   │   └── intents.ts             # UI → engine 的 intent 类型
│   └── index.ts
└── client/assets/scripts/
    ├── game/
    │   ├── LocalGameEngine.ts     # ★ 核心
    │   ├── engine/
    │   │   ├── ContainerGenerator.ts
    │   │   ├── BidResolver.ts
    │   │   ├── Settler.ts
    │   │   └── RandomProvider.ts
    │   ├── ai/
    │   │   ├── AIBrain.ts
    │   │   └── strategies/
    │   │       ├── Conservative.ts
    │   │       ├── Aggressive.ts
    │   │       └── Trickster.ts
    │   └── events/
    │       └── EventBus.ts        # 内部事件总线
    ├── ui/
    │   ├── scenes/Main.scene
    │   ├── prefabs/
    │   │   ├── PlayerSeat.prefab
    │   │   ├── ContainerCard.prefab
    │   │   ├── BiddingPanel.prefab
    │   │   └── RevealPanel.prefab
    │   └── components/
    │       ├── BiddingPanel.ts
    │       ├── RevealPanel.ts
    │       ├── CountdownLabel.ts
    │       └── PlayerSeatView.ts
    └── platform/
        ├── Bootstrap.ts           # P0 已留
        └── logger.ts              # P0 已留
```

---

## 三、核心数据结构（`packages/shared`）

### 3.1 Item（藏品）

```ts
// shared/src/types/item.ts
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ItemDef {
  /** 藏品定义 ID（配置表主键）*/
  id: string;
  name: string;
  /** 稀有度（决定掉率与价值区间）*/
  rarity: ItemRarity;
  /** 折现价值区间 [min, max]，结算时在此范围内随机 */
  valueRange: [number, number];
  /** 占位图（P1 用 geometry color，后续替换） */
  iconPlaceholder: string;
  /** 分类标签，供图鉴和技能过滤 */
  tags: string[];
}

/** 一局内实际生成的藏品实例 */
export interface ItemInstance {
  instanceId: string; // 局内唯一
  defId: string; // 指向 ItemDef.id
  /** 结算价值：开局时已经定好，仅服务端可见，reveal 时才给客户端 */
  actualValue: number;
}
```

**关键设计**：`actualValue` 开局就定好并"扣"在服务端（P1 阶段是 engine 私有变量），客户端在 reveal 阶段才拿到。这对 P2 防作弊是刚需。

### 3.2 Container（仓库）

```ts
// shared/src/types/container.ts
export interface ContainerTemplate {
  id: string;
  name: string;
  /** 期望总价值（用于匹配难度）*/
  expectedValue: number;
  /** 生成规则：每种稀有度的掉落权重与数量区间 */
  lootTable: LootEntry[];
  /** 可展示的线索池（展示阶段随机选 N 条）*/
  clues: ClueDef[];
}

export interface LootEntry {
  rarity: ItemRarity;
  countRange: [number, number];
}

export interface ClueDef {
  /** 线索 ID，便于 AI 分析和国际化 */
  id: string;
  text: string;
  /** 提示的信息类型（数量/材质/稀有度暗示）*/
  hintType: 'count' | 'material' | 'rarity-hint' | 'category';
}

/** 一局内实际生成的仓库实例 */
export interface ContainerInstance {
  instanceId: string;
  templateId: string;
  /** 起拍价 */
  startingBid: number;
  /** 实际内含物（服务端权威，客户端看不到）*/
  items: ItemInstance[];
  /** 本局暴露给玩家的线索（展示阶段陆续放出）*/
  revealedClues: ClueDef[];
  /** 对玩家可见的公开信息（如物品总数）*/
  publicInfo: {
    totalItemCount: number;
  };
}
```

### 3.3 Player（玩家）

```ts
// shared/src/types/player.ts
export type PlayerKind = 'human' | 'ai-conservative' | 'ai-aggressive' | 'ai-trickster';

export interface PlayerState {
  id: string; // P1 用 'p1'~'p4'，P2 换真实 userId
  kind: PlayerKind;
  nickname: string;
  seat: 0 | 1 | 2 | 3;
  /** 余额（本金）*/
  balance: number;
  /** 当前持有的藏品（本局获得）*/
  acquiredItems: ItemInstance[];
  /** 选中的技能（P1 只存 ID，P3 补齐效果）*/
  skillId: string | null;
  /** 连接状态（P1 always true，P2 用）*/
  online: boolean;
}

/** 当前回合的出价状态（每玩家一份，只有自己能看到 amount）*/
export interface BidSubmission {
  playerId: string;
  /** 是否已出价（公开字段，所有人可见）*/
  submitted: boolean;
  /** 具体金额（私有字段，仅服务端和出价者持有）*/
  amount?: number;
  submittedAt?: number; // 时间戳，用于并列时先到先得
}
```

### 3.4 房间状态机

```ts
// shared/src/state-machine/phases.ts
export const Phase = {
  /** 等待玩家就绪（P1 自动跳过）*/
  WAITING: 'WAITING',
  /** 展示阶段：轮播集装箱 + 放线索 */
  PREVIEW: 'PREVIEW',
  /** 暗标出价 */
  BIDDING: 'BIDDING',
  /** 揭晓出价 + 开箱 */
  REVEALING: 'REVEALING',
  /** 结算 */
  SETTLING: 'SETTLING',
  /** 局内下一个仓库（若有）或全局结束 */
  END: 'END',
} as const;
export type PhaseType = (typeof Phase)[keyof typeof Phase];

/** 合法转移 */
export const PHASE_TRANSITIONS: Record<PhaseType, PhaseType[]> = {
  WAITING: ['PREVIEW'],
  PREVIEW: ['BIDDING'],
  BIDDING: ['REVEALING'],
  REVEALING: ['SETTLING'],
  SETTLING: ['PREVIEW', 'END'],
  END: [],
};

/** 每阶段时长（毫秒），P1 走配置，后续可由服务端下发 deadline */
export const PHASE_DURATION_MS: Record<PhaseType, number> = {
  WAITING: 0,
  PREVIEW: 15000,
  BIDDING: 12000,
  REVEALING: 6000,
  SETTLING: 4000,
  END: 0,
};
```

### 3.5 房间整体状态

```ts
// shared/src/types/room.ts
export interface RoomState {
  roomId: string;
  phase: PhaseType;
  /** 当前阶段截止时间戳（ms），UI 自己倒计时 */
  phaseDeadline: number;
  round: number; // 第几个仓库
  totalRounds: number; // 本局总仓库数
  players: Record<string, PlayerState>;
  /** 当前在拍的仓库（对客户端只暴露 publicInfo 和 revealedClues）*/
  currentContainer: ContainerPublicView | null;
  /** 本回合出价状态（客户端只看得到 submitted 字段）*/
  currentBids: Record<string, BidSubmission>;
  /** 上一回合的结算结果（供 UI 播放揭晓动画）*/
  lastReveal: RevealResult | null;
}

/** 客户端能看到的仓库视图（敏感字段被剥离）*/
export interface ContainerPublicView {
  instanceId: string;
  templateId: string;
  name: string;
  startingBid: number;
  revealedClues: ClueDef[];
  publicInfo: { totalItemCount: number };
}

export interface RevealResult {
  containerId: string;
  winnerId: string;
  winningBid: number;
  /** 所有玩家的出价（REVEAL 阶段才全量公开）*/
  allBids: Record<string, number>;
  /** 中标者得到的物品实例 */
  items: ItemInstance[];
  /** 折现总价 */
  totalValue: number;
  profit: number; // = totalValue - winningBid
}
```

### 3.6 Intent（UI → Engine 的意图）

```ts
// shared/src/messages/intents.ts
export type PlayerIntent =
  | { type: 'bid/submit'; playerId: string; amount: number }
  | { type: 'bid/cancel'; playerId: string }
  | { type: 'skill/use'; playerId: string; skillId: string; targetId?: string }
  | { type: 'room/ready'; playerId: string };
```

**P2 迁移**：`PlayerIntent` 的 `type` 字符串就是 Colyseus 的消息名。

---

## 四、核心模块详细设计

### 4.1 LocalGameEngine（核心）

**职责**：充当"本地服务端"，持有权威状态，驱动状态机。

```ts
// client/assets/scripts/game/LocalGameEngine.ts
import { RoomState, PlayerIntent, PhaseType, Phase } from '@bid-king/shared';

type Listener = (state: RoomState) => void;

export interface IGameEngine {
  /** 启动新一局 */
  start(config: GameConfig): void;
  /** UI 发意图 */
  dispatch(intent: PlayerIntent): void;
  /** 订阅状态变更（immutable 快照）*/
  subscribe(listener: Listener): () => void;
  /** 获取当前状态快照（只读）*/
  getState(): Readonly<RoomState>;
  /** 手动推进（仅 P1 调试用，P2 删）*/
  tick(dt: number): void;
}
```

**内部实现要点**：

1. **状态单一入口**：所有修改走 `private mutate(fn: (s: RoomState) => void)`，修改后 deep clone 一份给订阅者（防止 UI 拿到 mutable 引用）。
2. **阶段驱动**：用 `setTimeout` 或 Cocos `schedule` 推进阶段，每次转移都校验 `PHASE_TRANSITIONS`。
3. **敏感字段隔离**：engine 内部维护 `private _secrets: ContainerSecrets`（完整物品列表），对外 `state.currentContainer` 只暴露 `ContainerPublicView`。
4. **意图处理表**：

```ts
private handlers: Record<PlayerIntent['type'], (intent: any) => void> = {
  'bid/submit': this.handleBidSubmit,
  'bid/cancel': this.handleBidCancel,
  'skill/use':  this.handleSkillUse,
  'room/ready': this.handleReady,
};
```

5. **输入校验**：严格校验金额范围、余额、阶段是否合法，不合法的 intent **silent drop + warn log**，不暴露给 UI（P2 会改成返回 error 消息）。

### 4.2 ContainerGenerator（仓库生成器）

```ts
// 根据模板 + 种子生成一个 ContainerInstance
export class ContainerGenerator {
  constructor(private rng: RandomProvider) {}

  generate(template: ContainerTemplate): ContainerInstance {
    const items: ItemInstance[] = [];
    for (const entry of template.lootTable) {
      const count = this.rng.intRange(entry.countRange);
      const pool = itemsByRarity(entry.rarity);
      for (let i = 0; i < count; i++) {
        const def = this.rng.pick(pool);
        items.push({
          instanceId: genId(),
          defId: def.id,
          actualValue: this.rng.floatRange(def.valueRange),
        });
      }
    }
    return {
      instanceId: genId(),
      templateId: template.id,
      startingBid: template.expectedValue * 0.2, // 起拍价 = 期望值 20%
      items,
      revealedClues: this.pickClues(template, 3),
      publicInfo: { totalItemCount: items.length },
    };
  }
}
```

**关键约束**：所有随机都经 `RandomProvider`（封装 seedable PRNG，如 `mulberry32`），**方便测试复现和 P2 服务端权威下发 seed**。

### 4.3 BidResolver（出价结算）

```ts
export class BidResolver {
  resolve(bids: BidSubmission[]): ResolveOutput {
    const valid = bids.filter((b) => b.submitted && b.amount !== undefined);
    if (valid.length === 0) return { winnerId: null, winningBid: 0 };

    // 最高价获胜；同价先提交者胜（submittedAt 升序）
    valid.sort((a, b) => b.amount! - a.amount! || a.submittedAt! - b.submittedAt!);
    const winner = valid[0];
    return { winnerId: winner.playerId, winningBid: winner.amount! };
  }
}
```

### 4.4 Settler（结算器）

```ts
export class Settler {
  settle(
    container: ContainerInstance,
    winnerId: string,
    winningBid: number,
    players: Record<string, PlayerState>
  ): RevealResult {
    const winner = players[winnerId];
    winner.balance -= winningBid;
    winner.acquiredItems.push(...container.items);
    const totalValue = container.items.reduce((s, i) => s + i.actualValue, 0);
    return {
      containerId: container.instanceId,
      winnerId,
      winningBid,
      allBids: /* 组装 */,
      items: container.items,
      totalValue,
      profit: totalValue - winningBid,
    };
  }
}
```

**P3 会接入经济制衡（保底、段位、负面标签），P1 保持最简单的盈亏计算。**

### 4.5 AI 系统

P1 必须有 3 档难度 AI，用于单机测试"抬价"和"畏战"等真实人类行为，验证玩法。

```ts
// client/assets/scripts/game/ai/AIBrain.ts
export interface AIStrategy {
  /** AI 进入 BIDDING 阶段后决定出价（可为 0 = 放弃） */
  decideBid(ctx: AIContext): number;
  /** AI 进入 PREVIEW 阶段决定是否使用技能（P3 实现，P1 返回 null）*/
  decideSkill(ctx: AIContext): string | null;
}

export interface AIContext {
  self: PlayerState;
  container: ContainerPublicView;
  opponents: PlayerState[];
  round: number;
  totalRounds: number;
}
```

**三档策略**：

- **Conservative（保守）**：估值 = `expectedValue × 0.7`，出价不超过估值 × 随机 [0.5, 0.8]。
- **Aggressive（激进）**：估值 = `expectedValue × 1.0`，出价不超过估值 × 随机 [0.85, 1.1]。
- **Trickster（诈唬）**：50% 按 Conservative 出，50% 按 Aggressive 出，偶尔扔"天价"测试对手。

**估值简化公式**（P1）：

```ts
const estimatedValue = template.expectedValue * personalityBias + noise();
const bid = clamp(container.startingBid, Math.min(self.balance, estimatedValue * aggressionFactor));
```

**AI 调度**：`LocalGameEngine` 进入 `BIDDING` 阶段时，为每个 AI 玩家 `setTimeout(随机 2-8s)` 触发 `decideBid`，模拟真人思考时间。

### 4.6 配置表（P1 用 TS 常量手写）

```ts
// shared/src/data/items.ts
import type { ItemDef } from '../types/item';

export const ITEM_DEFS: ItemDef[] = [
  {
    id: 'old_newspaper',
    name: '旧报纸',
    rarity: 'common',
    valueRange: [1, 5],
    iconPlaceholder: '#888',
    tags: ['paper'],
  },
  {
    id: 'vintage_watch',
    name: '古董怀表',
    rarity: 'rare',
    valueRange: [100, 400],
    iconPlaceholder: '#FFD700',
    tags: ['metal'],
  },
  {
    id: 'jade_pendant',
    name: '翡翠挂坠',
    rarity: 'epic',
    valueRange: [500, 1500],
    iconPlaceholder: '#00C853',
    tags: ['stone'],
  },
  {
    id: 'red_mystery_box',
    name: '神秘红箱',
    rarity: 'legendary',
    valueRange: [3000, 8000],
    iconPlaceholder: '#D50000',
    tags: ['mystery'],
  },
  // ... 20-30 条
];

// shared/src/data/containerTemplates.ts
export const CONTAINER_TEMPLATES: ContainerTemplate[] = [
  {
    id: 'garage_basic',
    name: '普通车库',
    expectedValue: 300,
    lootTable: [
      { rarity: 'common', countRange: [3, 6] },
      { rarity: 'rare', countRange: [0, 1] },
    ],
    clues: [
      { id: 'c_has_paper', text: '角落堆着泛黄的纸张', hintType: 'material' },
      { id: 'c_maybe_watch', text: '隐约有金属反光', hintType: 'rarity-hint' },
      // ...
    ],
  },
  // ... 5-8 个
];
```

> **为什么用 TS 常量而不是 JSON/Excel**：P1 数据量小（20+ 物品、5+ 仓库），手写最快；写成 `as const` 后享受 TS 字面量类型。P3 数据量上来后再做配置表工具。

---

## 五、UI 层设计

### 5.1 场景结构

```
Main.scene
├── Canvas
│   ├── BackgroundLayer
│   ├── TableLayer
│   │   ├── PlayerSeat[0..3]       ← 4 个玩家位
│   │   └── ContainerArea          ← 中央仓库展示区
│   ├── UILayer
│   │   ├── CountdownLabel         ← 阶段倒计时
│   │   ├── PhaseBanner            ← "展示/出价/揭晓/结算"
│   │   ├── BiddingPanel           ← 出价面板（BIDDING 阶段弹出）
│   │   ├── RevealPanel            ← 揭晓面板
│   │   └── SettlementPanel        ← 结算面板
│   └── DebugPanel                 ← 仅 P1：可手动切阶段、看服务端私有状态
```

### 5.2 核心组件契约

**所有 UI 组件遵循**：

```ts
// 统一的订阅入口
onLoad() {
  this.unsub = engine.subscribe((state) => this.onStateChanged(state));
}
onDestroy() {
  this.unsub?.();
}
```

| 组件                | 订阅字段                                          | 触发行为                                                       |
| ------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| `PlayerSeatView`    | `state.players[id]` + `currentBids[id].submitted` | 更新头像/余额，已出价则加对勾                                  |
| `ContainerCardView` | `state.currentContainer`                          | 切换仓库时做翻卡动画                                           |
| `CountdownLabel`    | `state.phaseDeadline`                             | 本地 setInterval 倒计时到 0                                    |
| `BiddingPanel`      | `state.phase === BIDDING`                         | 显示/隐藏；点确认 → `engine.dispatch({type:'bid/submit',...})` |
| `RevealPanel`       | `state.lastReveal` 新值                           | 播放揭晓 + 开箱动画序列                                        |
| `PhaseBanner`       | `state.phase`                                     | 切换阶段时做横幅滑入动画                                       |

### 5.3 开箱演出（P1 的核心爽点）

**节奏设计**（REVEALING 阶段 6s）：

| 时间段     | 事件                             | 视觉/音效                                        |
| ---------- | -------------------------------- | ------------------------------------------------ |
| 0.0 - 1.0s | 揭晓出价（卡牌翻转）             | 四张卡同步翻面，胜者高亮                         |
| 1.0 - 2.0s | 镜头拉近到仓库                   | 缩放 + 阴影抖动                                  |
| 2.0 - 2.5s | 门打开 / 迷雾涌出                | 粒子 + 雾气 shader                               |
| 2.5 - 5.5s | 物品逐一显现（按稀有度由低到高） | 每 0.3-0.6s 一件，稀有度越高延迟越长、粒子越夸张 |
| 5.5 - 6.0s | 结算数字跳动                     | 利润 +/-，绿/红                                  |

**技术实现**：

- **Tween 链**：用 `tween(node).by().to().sequence()` 组合。
- **粒子**：Cocos `ParticleSystem2D`，三档预设（普通/史诗/传说）。
- **音效占位**：接口层定义好 `AudioManager.play('reveal.open' | 'reveal.item.legendary')`，P1 加 log，P3/P4 接真实音效。

**关键约定**：**演出是纯客户端行为**，`RevealResult` 一次性下发，客户端自己编排时间线。P2 迁移时服务端不关心演出细节。

### 5.4 调试面板（仅 P1）

为了加速单机验证，额外做一个 `DebugPanel`（Shift+D 开关）：

- 显示服务端私有状态（container items、实际 value）。
- 手动切换阶段。
- 修改 AI 策略。
- 重置局内状态。

**必须**：发布构建去除此面板（`DEBUG` 宏或条件编译）。

---

## 六、事件总线与订阅设计

### 6.1 为什么需要

状态订阅是"广播式"的，但有些 UI 只关心"离散事件"（如"开始揭晓"），用状态 diff 不优雅。因此额外加一层内部事件总线。

```ts
// client/assets/scripts/game/events/EventBus.ts
export type GameEventMap = {
  'phase:changed': { from: PhaseType; to: PhaseType };
  'bid:submitted': { playerId: string };
  'reveal:start': { result: RevealResult };
  'reveal:item-shown': { item: ItemInstance; index: number };
  'round:ended': { round: number };
};

export class EventBus {
  emit<K extends keyof GameEventMap>(type: K, payload: GameEventMap[K]): void;
  on<K extends keyof GameEventMap>(type: K, handler: (p: GameEventMap[K]) => void): () => void;
}
```

**P2 迁移**：部分事件会变成服务端 broadcast，部分保持客户端内部事件，按需拆分。

---

## 七、任务拆解与时序

### 7.1 任务清单（对齐 P1-01 ~ P1-13）

| ID    | 任务                                             | 工时   | 依赖        | 验收                                 |
| ----- | ------------------------------------------------ | ------ | ----------- | ------------------------------------ |
| P1-01 | `shared` 数据结构（item/container/player）       | 0.5d   | P0          | 类型导出，双端可 import              |
| P1-02 | `shared` 状态机 + RoomState                      | 0.5d   | P1-01       | 转移规则单测通过                     |
| P1-03 | `shared` 配置表（ITEM_DEFS/CONTAINER_TEMPLATES） | 0.5d   | P1-01       | 20+ 物品、5+ 仓库                    |
| P1-04 | `shared` Intent 类型                             | 0.25d  | P1-01       | UI/engine 共用                       |
| P1-05 | 配置表工具雏形（可选）                           | 0.5d   | P1-03       | CSV → TS，能跑即可                   |
| P1-06 | `LocalGameEngine` 状态机 + dispatch/subscribe    | 1.5d   | P1-02/P1-04 | 能跑通 WAITING→…→END                 |
| P1-07 | ContainerGenerator + RandomProvider              | 0.5d   | P1-03       | seedable，同 seed 可复现             |
| P1-08 | BidResolver + Settler                            | 0.5d   | P1-06       | 单测覆盖边界（同价、0 价、无人出价） |
| P1-09 | AIBrain + 3 档策略                               | 1d     | P1-06       | 可单机 1 真人 + 3 AI 打完            |
| P1-10 | 主场景布局 + PlayerSeatView + ContainerCardView  | 1d     | Cocos 工程  | 静态展示                             |
| P1-11 | BiddingPanel + CountdownLabel                    | 0.5d   | P1-06       | 可提交出价                           |
| P1-12 | **RevealPanel + 开箱演出序列**                   | **2d** | P1-06       | 达到"想再玩一局"手感                 |
| P1-13 | SettlementPanel + 回合衔接                       | 0.5d   | P1-12       | 能连续打 3 个仓库                    |
| P1-14 | DebugPanel（仅 P1）                              | 0.5d   | P1-06       | 能看到服务端私有状态                 |
| P1-15 | 单元测试（engine/resolver/settler）              | 1d     | P1-08       | 核心函数覆盖                         |

**合计**：约 11 人日，**1.5 人 → ~7-8 工作日**，**2 周完成**（留 2-3 天给 P1-12 手感打磨）。

### 7.2 周安排

**Week 2**：

- Day 1-2：P1-01 ~ P1-04（所有 shared 类型定稿，**这是 P2 的命脉，不要赶**）
- Day 3：P1-06 engine 骨架 + P1-07 generator
- Day 4：P1-08 resolver/settler + P1-15 单测
- Day 5：P1-09 AI（先跑通 Conservative 一档）

**Week 3**：

- Day 1-2：P1-10 ~ P1-11 UI 主循环
- Day 3-4：**P1-12 开箱演出（核心爽点，给足时间）**
- Day 5：P1-13 衔接 + P1-14 调试面板 + Demo 录屏

### 7.3 关键路径

```
shared 类型（P1-01~04）
  └→ engine（P1-06）
       ├→ generator（P1-07） ─┐
       ├→ resolver/settler（P1-08）┤
       ├→ AI（P1-09）─────────┤
       └→ UI（P1-10~13）────── → 一局打通
```

**`shared 类型`不能拖**：它是所有人的依赖，Day 1-2 必须冻结。

---

## 八、测试策略

### 8.1 单元测试（Vitest）

必须覆盖：

- `PHASE_TRANSITIONS`：合法/非法转移。
- `BidResolver`：同价并列、0 出价、全员放弃。
- `Settler`：余额扣减、物品归属、盈亏计算。
- `ContainerGenerator`：同 seed 可复现、loot table 权重正确。
- `AIBrain`：不会出价超过余额，不会出负数。

### 8.2 手工测试（Demo 录屏）

P1 结束时录制一段 3-5 分钟视频，自己看完问三个问题：

1. 开箱那一下是不是想再来一次？
2. AI 出价像不像"人"？
3. 整个一局节奏会不会太快/太慢？

答案"否"的，回头调数值（`PHASE_DURATION_MS`、AI 策略系数）。

### 8.3 数值冒烟

跑一个 batch 脚本，engine 自动打 500 局（4 个 AI 互打），统计：

- 平均每局利润分布。
- 不同稀有度仓库的匹配频率。
- AI 每档胜率。

目标：**各档 AI 胜率 20%~30%（接近均衡）**。若失衡，调策略系数。

---

## 九、验收标准（DoD）

P1 完成的硬性验收：

### 9.1 代码验收

- [ ] `pnpm lint` / `pnpm typecheck` / `pnpm test` 全绿。
- [ ] `shared` 包导出所有 P1 类型，客户端零类型报错。
- [ ] `LocalGameEngine` 有 ≥ 5 个单测，覆盖状态机、出价、结算。

### 9.2 运行验收

- [ ] Cocos 预览点击"开始"，一局（3 个仓库）可完整打完不报错。
- [ ] 每回合 PREVIEW/BIDDING/REVEALING/SETTLING 阶段时长与配置一致（±0.5s）。
- [ ] 真人出价/不出价/超时未出价三种情况结算无偏差。
- [ ] 3 档 AI 各跑 100 局，胜率在 20%~35% 区间。

### 9.3 体验验收

- [ ] 开箱演出达到"基础爽感"：录屏能给第三方看并收到正面反馈。
- [ ] 一局体验时长 5-8 分钟（4 个仓库）。
- [ ] 没有明显卡顿、UI 闪烁、重叠。

### 9.4 迁移验收（最重要）

- [ ] UI 组件不直接读写 `RoomState` 字段（全走 `engine.subscribe`）。
- [ ] UI 组件不直接调 engine 的任何非 `dispatch/subscribe` 方法。
- [ ] `LocalGameEngine` 所有"权威计算"（出价、结算、抽物品）**不依赖任何 Cocos API**，可在 Node 环境单独跑。

> 最后一条的意义：P2 时可以把 engine 内核代码**原样搬到服务端**，只需改外壳（从 subscribe 模型改为 Colyseus Schema 模型）。

---

## 十、风险与应对

| 风险                   | 概率 | 影响          | 应对                                                      |
| ---------------------- | ---- | ------------- | --------------------------------------------------------- |
| shared 类型频繁改动    | 高   | 前几天返工多  | Day 1-2 专门定稿，定稿后改动必开 PR + reviewer            |
| 开箱演出打磨吃时间     | 高   | P1 延期       | 预留 2 天专项，不行就砍到 1 天 + 接受"粗糙版"             |
| AI 策略调参耗时        | 中   | 数值失衡      | 写 batch 脚本自动跑 500 局统计                            |
| Cocos Tween API 不够用 | 中   | 动效受限      | 用 `tween().call()` 手写关键帧；必要时引入 `cc.Animation` |
| engine 和 UI 耦合      | 高   | P2 迁移代价大 | **Code review 死盯**：UI 不许 import engine 内部文件      |
| 数值测试漏场景         | 中   | 偶发 bug      | 单测 + batch 冒烟一起上                                   |

---

## 十一、对 P2 的交接清单

P1 结束交给 P2 的"半成品"必须包含：

- [x] 完整的 `shared` 协议（P2 直接复用，只在其上加 Colyseus `@Schema` 装饰）。
- [x] 纯业务的 `engine` 内核代码（P2 搬到 `packages/server/src/rooms/BidKingRoom.ts`）。
- [x] UI 层可被"替换数据源"的订阅模型（P2 的 `NetworkManager` 替代 `LocalGameEngine`）。
- [x] 3 档 AI 策略（P2 当机器人补位兜底）。
- [x] 一份"单机可跑"的 Demo 录屏作为体验基线。

**交接完成标志**：P2 第 1 天可以做到"新建 `BidKingRoom`，`onJoin` 时把 `LocalGameEngine` 的状态结构复制过去"，不需要重新设计任何数据结构。

---

## 十二、对 P0 的并行依赖（重要）

本方案假设以下 P0 产出已就绪，如 P0 有延期，P1 相应顺延：

- `packages/shared` 可正常被 `packages/client` 导入（4.7 节 tsconfig paths 已生效）。
- ESLint/Prettier/husky 已配置，提交自动校验。
- Cocos Creator 项目能预览、能 import `@bid-king/shared`。

**并行建议**：

| 时间点      | 你（P0）             | 我（P1）                                        |
| ----------- | -------------------- | ----------------------------------------------- |
| Day 1-3     | 搭 Monorepo + 工具链 | 写 shared 类型稿（先不 commit，等 P0 基础就绪） |
| Day 4-5     | 搭 Cocos + CI        | 开写 engine 骨架                                |
| Week 2 开始 | P0 收尾              | 全力推 P1                                       |

---

**版本历史**

| 版本 | 日期    | 变更                                             |
| ---- | ------- | ------------------------------------------------ |
| v1.0 | 2026-04 | 初版，定义 P1 所有任务、架构、数据结构、验收标准 |

**签字确认**：P1 方案审阅通过后方可进入实施。
