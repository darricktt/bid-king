# P0 工程准备 - 技术方案

> 阶段：**P0 工程准备**  
> 周期：**Week 1（1 周）**  
> 目标：完成 Monorepo、协议包、服务端骨架、客户端骨架、CI、Docker、代码规范工具链，所有"不写业务也要花时间"的事一次性做掉。  
> 里程碑：**M0 — 仓库就绪，能 `pnpm dev` 同时起客户端预览与服务端 2567 端口**

---

## 一、方案概述

P0 是整个项目的地基。这一阶段不涉及任何业务逻辑，只交付一个**可被后续 P1~P5 所有阶段无缝接入的工程骨架**。

### 交付物一览

| 交付物        | 位置                   | 形态                                                                |
| ------------- | ---------------------- | ------------------------------------------------------------------- |
| Monorepo 骨架 | 仓库根                 | `pnpm-workspace.yaml` + `turbo.json`                                |
| 共享协议包    | `packages/shared`      | 可被双端 import 的 TS 包                                            |
| 服务端骨架    | `packages/server`      | Node.js + Colyseus 最小可启动                                       |
| 客户端骨架    | `packages/client`      | Cocos Creator 3.8 LTS 空工程                                        |
| 本地中间件    | `docker-compose.yml`   | Mongo 7 + Redis 7                                                   |
| 代码规范      | 根                     | ESLint + Prettier + EditorConfig + husky + commitlint + lint-staged |
| CI            | `.github/workflows/`   | lint + typecheck + build 流水线                                     |
| 分支策略      | 文档 + GitHub 分支保护 | `main` / `dev` + 保护规则                                           |
| 文档          | `docs/`                | 本方案 + `开发规范.md`（已有）+ `README.md`                         |

### 不做的事（明确界定）

- 任何业务代码（Room、状态机、UI、技能、账号等）。
- CI 中的测试流水线（P1 再加）。
- 云端部署（P5 再做）。
- Cocos 资源（美术、预制体）。

---

## 二、架构总览

### 2.1 Monorepo 分层

```
bid-king/
├── packages/
│   ├── shared/        ← 协议、常量、类型（双端共享）
│   ├── server/        ← Colyseus 服务端（依赖 shared）
│   └── client/        ← Cocos Creator 项目（依赖 shared）
├── tools/             ← 配置表工具等（P1 再填）
├── docs/
├── .github/workflows/
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .eslintrc.cjs
├── .prettierrc
├── .editorconfig
├── .nvmrc
├── .gitignore
└── package.json
```

### 2.2 依赖关系

```
   shared（零运行时依赖，纯 TS 类型 + 常量）
     ↑              ↑
     │              │
   server         client
  （Node）        （Cocos）
```

**强制约束**：`shared` 不依赖任何 Node 特定 API（`fs`、`path` 等），也不依赖 Cocos。保证能被两端同构使用。

### 2.3 技术栈锁定版本

| 组件          | 版本    | 锁定方式                      |
| ------------- | ------- | ----------------------------- |
| Node.js       | 20 LTS  | `.nvmrc` + `engines`          |
| pnpm          | 9.x     | `packageManager` + `corepack` |
| TypeScript    | ~5.5    | 根 `devDependencies`          |
| Colyseus      | ^0.15   | `packages/server`             |
| Cocos Creator | 3.8 LTS | 本地安装（不走 npm）          |
| MongoDB       | 7       | `docker-compose.yml`          |
| Redis         | 7       | `docker-compose.yml`          |

---

## 三、详细任务拆解

### 3.1 任务清单（对齐 P0-01 ~ P0-10）

| ID    | 任务                             | 工时  | 产出                                                   | 验收                                         |
| ----- | -------------------------------- | ----- | ------------------------------------------------------ | -------------------------------------------- |
| P0-01 | Monorepo 初始化                  | 0.5d  | `pnpm-workspace.yaml`, `turbo.json`, 根 `package.json` | `pnpm install` 成功                          |
| P0-02 | `packages/shared` 协议包         | 0.5d  | `src/index.ts` + `package.json` + `tsconfig.json`      | 导出一个 hello 类型可被 server/client import |
| P0-03 | `packages/server` Colyseus 骨架  | 0.5d  | 最小 Colyseus 服务 + 健康检查 HTTP                     | `pnpm --filter server dev` 起 2567 端口      |
| P0-04 | `packages/client` Cocos 空工程   | 0.5d  | Cocos 项目目录 + 引用 shared                           | Cocos Creator 打开可预览                     |
| P0-05 | Git 分支策略 + 保护              | 0.25d | GitHub 分支保护规则 + `docs/开发规范.md`（已有）       | `main`/`dev` 禁止直 push                     |
| P0-06 | `docker-compose.yml`             | 0.5d  | Mongo 7 + Redis 7 + 端口映射                           | `docker compose up -d` 起两个容器            |
| P0-07 | GitHub Actions CI                | 0.5d  | `.github/workflows/ci.yml`                             | PR 自动跑 lint + typecheck + build           |
| P0-08 | 代码规范工具链                   | 0.25d | ESLint + Prettier + EditorConfig + tsconfig.base       | 根 `pnpm lint` / `pnpm typecheck` 通过       |
| P0-09 | 日志组件                         | 0.5d  | server: pino；client: logger 封装                      | 统一 JSON 日志 / console 包装                |
| P0-10 | husky + commitlint + lint-staged | 0.25d | `.husky/*`, `commitlint.config.cjs`                    | 非规范 commit 被拦截                         |

**合计**：4.5 人日 → 1.5 人团队约 **3 工作日**，**1 周完成**（留 2 天 buffer 应对 Cocos 安装和 CI 调试）。

### 3.2 任务依赖图

```
P0-01 (Monorepo)
 ├─→ P0-02 (shared)
 │    ├─→ P0-03 (server) ──┐
 │    └─→ P0-04 (client) ──┤
 ├─→ P0-06 (docker) ───────┤
 ├─→ P0-08 (lint/format) ──┤
 │    └─→ P0-10 (husky) ───┤
 │                          │
 └─→ P0-07 (CI) ────────────┴─→ M0
P0-05 (分支保护) → 随时可做
P0-09 (日志) → P0-03/04 之后
```

**关键路径**：P0-01 → P0-02 → P0-03/04 → P0-07。

---

## 四、关键文件与配置

### 4.1 根 `package.json`

```jsonc
{
  "name": "bid-king",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0",
  },
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "format": "prettier --write .",
    "prepare": "husky install",
  },
  "devDependencies": {
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.2.0",
    "turbo": "^2.0.0",
    "typescript": "~5.5.0",
  },
}
```

### 4.2 `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
  - 'tools/*'
```

### 4.3 `turbo.json`

```jsonc
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": { "cache": false, "persistent": true },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"],
    },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] },
  },
}
```

### 4.4 `tsconfig.base.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2020"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
  },
}
```

### 4.5 `packages/shared/package.json`

```jsonc
{
  "name": "@bid-king/shared",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
    },
  },
  "scripts": {
    "dev": "tsc --watch --preserveWatchOutput",
    "build": "tsc",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit",
  },
  "devDependencies": {
    "typescript": "~5.5.0",
  },
}
```

**P0 阶段 `shared` 的内容**：只放一个占位导出，验证跨包 import 通路。

```ts
// packages/shared/src/index.ts
export const SHARED_VERSION = '0.1.0';
export interface HealthCheckPayload {
  ok: boolean;
  ts: number;
}
```

### 4.6 `packages/server/package.json`

```jsonc
{
  "name": "@bid-king/server",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit",
  },
  "dependencies": {
    "@bid-king/shared": "workspace:*",
    "@colyseus/monitor": "^0.15.0",
    "colyseus": "^0.15.0",
    "express": "^4.19.0",
    "pino": "^9.0.0",
    "pino-pretty": "^11.0.0",
    "zod": "^3.23.0",
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.7.0",
    "typescript": "~5.5.0",
  },
}
```

**P0 阶段 `server/src/index.ts` 最小实现**：

```ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { monitor } from '@colyseus/monitor';
import pino from 'pino';
import { SHARED_VERSION, HealthCheckPayload } from '@bid-king/shared';

const logger = pino({ transport: { target: 'pino-pretty' } });
const app = express();

app.get('/health', (_req, res) => {
  const payload: HealthCheckPayload = { ok: true, ts: Date.now() };
  res.json(payload);
});
app.use('/colyseus', monitor());

const gameServer = new Server({
  transport: new WebSocketTransport({ server: createServer(app) }),
});

const port = Number(process.env.PORT ?? 2567);
void gameServer.listen(port).then(() => {
  logger.info({ port, sharedVersion: SHARED_VERSION }, 'server started');
});
```

### 4.7 `packages/client/package.json`

Cocos Creator 3.x 项目自带 `package.json`，只需加上对 `shared` 的依赖：

```jsonc
{
  "name": "@bid-king/client",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "lint": "eslint assets/scripts --ext .ts",
    "typecheck": "tsc --noEmit -p tsconfig.json",
  },
  "dependencies": {
    "@bid-king/shared": "workspace:*",
    "colyseus.js": "^0.15.0",
  },
  "devDependencies": {
    "typescript": "~5.5.0",
  },
}
```

**P0 阶段客户端只做到**：

- Cocos Creator 新建空项目，目录放到 `packages/client`。
- `assets/scripts/platform/Bootstrap.ts` 写一个简单打印：
  ```ts
  import { SHARED_VERSION } from '@bid-king/shared';
  console.log('[BidKing] shared version:', SHARED_VERSION);
  ```
- 能在 Cocos 预览器里看到日志输出即可。

> ⚠️ Cocos Creator 对 Monorepo 的 workspace 协议支持有限，如构建时识别不到 `workspace:*`，P0 的兜底方案：**在 `packages/client/tsconfig.json` 里用 `paths` 指向 `../shared/src`**，直接走源码。

```jsonc
// packages/client/tsconfig.json（节选）
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@bid-king/shared": ["../shared/src/index.ts"],
      "@bid-king/shared/*": ["../shared/src/*"],
    },
  },
}
```

### 4.8 `docker-compose.yml`

```yaml
services:
  mongo:
    image: mongo:7
    container_name: bk-mongo
    ports:
      - '27017:27017'
    volumes:
      - ./.data/mongo:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: bk-redis
    ports:
      - '6379:6379'
    volumes:
      - ./.data/redis:/data
    restart: unless-stopped
```

> `.data/` 已加入 `.gitignore`。

### 4.9 `.eslintrc.cjs`

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    eqeqeq: ['error', 'always'],
    'prefer-const': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-floating-promises': 'off', // 需要 type-aware，P1 再开
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: ['dist', 'build', 'node_modules', '.data', 'packages/client/library'],
};
```

### 4.10 `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 4.11 husky + commitlint + lint-staged

```
.husky/pre-commit       → npx lint-staged
.husky/commit-msg       → npx commitlint --edit $1
.husky/pre-push         → pnpm typecheck
```

**`commitlint.config.cjs`**：

```js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

**根 `package.json` 追加**：

```jsonc
{
  "lint-staged": {
    "*.{ts,tsx,js,cjs,mjs}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"],
  },
}
```

### 4.12 CI：`.github/workflows/ci.yml`

```yaml
name: CI
on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main, dev]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm build
```

**注意**：P0 不跑测试（还没有测试），CI 只做静态检查 + 编译验证。

### 4.13 `.gitignore`（关键项）

```
node_modules/
dist/
build/
.data/
.env
.env.local
.DS_Store
packages/client/library/
packages/client/local/
packages/client/temp/
packages/client/profiles/
*.log
.turbo/
```

### 4.14 `.nvmrc`

```
20
```

### 4.15 `.editorconfig`

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

---

## 五、分支保护配置（P0-05）

登录 GitHub 仓库 Settings → Branches，对 `main` 与 `dev` 设置：

- [x] Require a pull request before merging
- [x] Require approvals（2 人时勾选）
- [x] Require status checks to pass（勾选 `check` job）
- [x] Require branches to be up to date
- [x] Include administrators
- [x] Restrict force pushes

> 1 人独立开发也要开，PR 自审机制是纪律来源。

---

## 六、日志组件设计（P0-09）

### 服务端：pino

- 开发环境：`pino-pretty` 彩色输出。
- 生产环境：纯 JSON，便于接入 CLS。
- 统一通过 `server/src/utils/logger.ts` 导出单例：

```ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
});
```

### 客户端：封装 console

Cocos 的 `console.log` 在小游戏/真机调试场景各有差异，统一封装：

```ts
// client/assets/scripts/platform/logger.ts
type Level = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private readonly tag = '[BidKing]';
  debug(...args: unknown[]) {
    this.print('debug', args);
  }
  info(...args: unknown[]) {
    this.print('info', args);
  }
  warn(...args: unknown[]) {
    this.print('warn', args);
  }
  error(...args: unknown[]) {
    this.print('error', args);
  }

  private print(level: Level, args: unknown[]) {
    // 后续可对接 Sentry / 埋点
    const fn = level === 'debug' ? console.log : console[level];
    fn(this.tag, ...args);
  }
}

export const logger = new Logger();
```

**ESLint 规则**允许 `console.warn/error`，其他一律走 `logger`。

---

## 七、验收标准（DoD）

P0 完成的硬性验收：

### 7.1 环境验收

- [ ] `nvm use` 切到 Node 20。
- [ ] `corepack enable` 后 `pnpm -v` ≥ 9。
- [ ] `docker compose up -d` 成功起 `bk-mongo` 和 `bk-redis`，`docker ps` 可见。

### 7.2 构建验收

- [ ] 根目录 `pnpm install` 成功，无 peer warning。
- [ ] `pnpm lint` 退出码 0。
- [ ] `pnpm typecheck` 退出码 0。
- [ ] `pnpm build` 所有包成功，`packages/shared/dist/index.js` 存在。

### 7.3 运行验收

- [ ] `pnpm --filter @bid-king/server dev` 启动，控制台看到 `server started { port: 2567, sharedVersion: '0.1.0' }`。
- [ ] `curl http://localhost:2567/health` 返回 `{"ok":true,"ts":<number>}`。
- [ ] 浏览器访问 `http://localhost:2567/colyseus` 看到 Colyseus Monitor 面板。
- [ ] Cocos Creator 打开 `packages/client`，预览时控制台输出 `[BidKing] shared version: 0.1.0`。

### 7.4 流程验收

- [ ] 非 Conventional Commits 格式的 commit 被 `commit-msg` 钩子拦截。
- [ ] 提交时 lint-staged 自动格式化暂存文件。
- [ ] 直接 push 到 `main` 被 GitHub 拒绝。
- [ ] 新建 PR 后 CI `check` job 自动运行并通过。

### 7.5 文档验收

- [ ] `README.md` 包含：项目简介、环境要求、一键初始化命令、常用脚本。
- [ ] `docs/p0-technical-design.md`（本文档）已归档。

---

## 八、风险与应对

| 风险                                  | 概率 | 影响                      | 应对                                                     |
| ------------------------------------- | ---- | ------------------------- | -------------------------------------------------------- |
| Cocos Creator 不认 `workspace:*` 协议 | 高   | 客户端 import shared 失败 | 已备 paths 兜底（4.7 节）                                |
| pnpm 版本差异导致 lockfile 冲突       | 中   | CI 失败                   | `packageManager` 字段锁定版本，CI 用 `--frozen-lockfile` |
| Windows 开发者 LF/CRLF 换行           | 中   | lint 报错                 | `.editorconfig` + `.gitattributes`（下节）               |
| husky v9 与旧写法不兼容               | 中   | hooks 不生效              | 严格按 v9 文档，`prepare` 脚本里用 `husky install`       |
| CI macOS/Linux 差异                   | 低   | 偶发 flaky                | 锁定 `ubuntu-latest` 一种                                |
| Docker Desktop 资源不足               | 低   | Mongo/Redis 启动失败      | README 注明最小 2C4G                                     |

**补充 `.gitattributes`**：

```
* text=auto eol=lf
*.png binary
*.jpg binary
*.mp3 binary
*.m4a binary
*.prefab text eol=lf
*.scene text eol=lf
```

---

## 九、实施步骤（可执行 Checklist）

建议按顺序执行，每步完成后 commit 一次，便于出问题时回退。

### Day 1

- [ ] 初始化 Git 仓库（已有 `bid-king`）。
- [ ] 创建 `.nvmrc`、`.gitignore`、`.gitattributes`、`.editorconfig`。
- [ ] `pnpm init`，填入根 `package.json`。
- [ ] 创建 `pnpm-workspace.yaml`、`turbo.json`、`tsconfig.base.json`。
- [ ] `pnpm install`，提交初始 commit（`chore: init monorepo scaffold`）。

### Day 2

- [ ] 创建 `packages/shared`（package.json、tsconfig、src/index.ts）。
- [ ] 创建 `packages/server`（package.json、tsconfig、src/index.ts、Colyseus hello）。
- [ ] `pnpm --filter @bid-king/server dev`，验证 `/health` 可访问。
- [ ] commit：`feat(server): bootstrap colyseus server`。

### Day 3

- [ ] 用 Cocos Creator 3.8 LTS 在 `packages/client` 创建空项目。
- [ ] 配置 `tsconfig.json` paths 指向 shared。
- [ ] 新建 `Bootstrap.ts` 打印 `SHARED_VERSION`。
- [ ] commit：`feat(client): bootstrap cocos project`。

### Day 4

- [ ] 写 `docker-compose.yml`，验证 Mongo/Redis 启动。
- [ ] 写 ESLint / Prettier / commitlint 配置。
- [ ] 安装 husky、lint-staged，写 hooks。
- [ ] commit：`build: add lint format and git hooks`。

### Day 5

- [ ] 写 GitHub Actions `ci.yml`。
- [ ] 配置 GitHub 分支保护规则。
- [ ] 写 `README.md`（环境要求、一键启动、常用脚本）。
- [ ] 全流程冒烟：`pnpm dev` 起双端 → 修一行代码 → commit → push → 开 PR → CI 通过。
- [ ] commit：`ci: add github actions pipeline`。
- [ ] **合并到 `dev`，打 tag `v0.1.0-p0`**。

---

## 十、出口标准与交接

P0 结束时，必须确保**任何新成员（包括 3 个月后的你）从零拉仓库**，按 `README.md` 5 行命令就能跑起来：

```bash
git clone <repo> && cd bid-king
nvm use && corepack enable
pnpm install
docker compose up -d
pnpm dev
```

如果做不到这一点，P0 不算完成，不进入 P1。

---

## 十一、对 P1 的交接清单

交给 P1 阶段的"半成品"必须包含：

- [x] 可运行的 Colyseus 服务（P1 在此基础上加 `BidKingRoom`）。
- [x] 可运行的 Cocos 项目（P1 在此基础上搭场景和 UI）。
- [x] `shared` 包（P1 往里填数据结构、Schema、消息类型）。
- [x] Docker 中间件（P1 可按需接 Mongo/Redis，但 P1 原型不强依赖）。
- [x] CI + Git 纪律（P1 所有功能走 PR）。

---

**版本历史**

| 版本 | 日期    | 变更                                   |
| ---- | ------- | -------------------------------------- |
| v1.0 | 2026-04 | 初版，定义 P0 所有任务、配置、验收标准 |

**签字确认**：P0 方案审阅通过后方可进入实施。
