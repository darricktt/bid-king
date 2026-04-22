# bid-king 竞拍之王

国产独立游戏《竞拍之王》(BidKing) 的手游复刻项目。目标平台：iOS + Android + 微信小游戏。

> 📄 项目背景与规划文档见 [`docs/`](./docs/) 目录。

## 技术栈

- **客户端**：Cocos Creator 3.8 LTS（TypeScript）
- **服务端**：Node.js 20 + Colyseus 0.17（TypeScript）
- **数据**：MongoDB 7 + Redis 7
- **Monorepo**：pnpm workspace + Turborepo
- **规范**：ESLint + Prettier + husky + commitlint + lint-staged

## 目录结构

```
bid-king/
├── packages/
│   ├── shared/        # 协议、常量、类型（双端共享）
│   ├── server/        # Colyseus 服务端
│   └── client/        # Cocos Creator 客户端
├── docs/              # 调研、选型、排期、规范、阶段方案
├── docker-compose.yml # 本地 Mongo + Redis
└── .github/workflows/ # CI
```

## 环境要求

| 工具           | 版本                         |
| -------------- | ---------------------------- |
| Node.js        | ≥ 20 LTS（`.nvmrc` 固定 20） |
| pnpm           | ≥ 9（推荐 10.18.x）          |
| Docker Desktop | 最新版（本机 ≥ 2C4G）        |
| Cocos Creator  | 3.8 LTS（客户端开发）        |

## 一键初始化

```bash
# 1. 切 Node 版本
nvm use         # 或 nvm install 20 && nvm use 20

# 2. 启用 pnpm（推荐走 Corepack）
corepack enable

# 3. 安装依赖
pnpm install

# 4. 启动本地 Mongo + Redis（P2 起使用，P0/P1 非必须）
docker compose up -d

# 5. 启动服务端（终端 1）
pnpm --filter @bid-king/server dev

# 6. 打开 Cocos Creator 3.8 LTS，加载 packages/client 目录（见该目录 README）
```

## 常用脚本

| 命令                | 作用                         |
| ------------------- | ---------------------------- |
| `pnpm dev`          | 并行启动所有包的 dev 模式    |
| `pnpm build`        | 构建所有包                   |
| `pnpm lint`         | ESLint 检查                  |
| `pnpm typecheck`    | TS 类型检查（不出产物）      |
| `pnpm test`         | 运行所有测试（P1 起）        |
| `pnpm format`       | Prettier 格式化全部文件      |
| `pnpm format:check` | Prettier 格式化校验（CI 用） |

## 验证服务端

启动 `pnpm --filter @bid-king/server dev` 后：

```bash
curl http://localhost:2567/health
# → {"ok":true,"ts":<number>,"sharedVersion":"0.1.0"}
```

浏览器访问 <http://localhost:2567/colyseus> 查看 Colyseus Monitor 面板。

## 分支与提交

- 分支模型：`main`（发布）← `dev`（集成）← `feature/*` / `fix/*`
- 提交格式：[Conventional Commits](https://www.conventionalcommits.org/)
  - `feat(server): add bid resolver`
  - `fix(client): prevent double-click on submit`
- 所有变更必须通过 PR（1 人独立开发也要 self-approve，留审计记录）

详见 [`docs/开发规范.md`](./docs/开发规范.md)。

## 文档索引

| 文档                                                           | 说明                    |
| -------------------------------------------------------------- | ----------------------- |
| [`docs/竞拍之王-调研报告.md`](./docs/竞拍之王-调研报告.md)     | 原版游戏玩法与市场调研  |
| [`docs/技术选型方案.md`](./docs/技术选型方案.md)               | 技术栈选型与架构理由    |
| [`docs/MVP开发排期.md`](./docs/MVP开发排期.md)                 | 14 周排期与任务拆解     |
| [`docs/开发规范.md`](./docs/开发规范.md)                       | 工程规范总纲            |
| [`docs/p0-technical-design.md`](./docs/p0-technical-design.md) | P0 工程准备技术方案     |
| [`docs/p1-technical-design.md`](./docs/p1-technical-design.md) | P1 核心循环原型技术方案 |

## 当前进度

- ✅ P0 工程准备（Week 1）— Monorepo / 协议包 / 服务端骨架 / 客户端骨架 / CI
- ⏳ P1 核心循环原型（Week 2-3）— 本地单机主循环
- ⏳ P2 联机 MVP（Week 4-6）— Colyseus 接入
- ⏳ P3 系统完整化（Week 7-10）— 干员 / 经济 / 账号 / 图鉴
- ⏳ P4 三端适配（Week 11-12）
- ⏳ P5 打磨上线（Week 13-14）

## License

私有项目，暂无开源授权。
