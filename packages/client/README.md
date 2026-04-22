# Cocos Creator 客户端工程

## 初始化步骤（P0 完成骨架后）

1. 打开 **Cocos Creator 3.8 LTS**。
2. 选择"新建项目"→ 空项目（2D）。
3. **保存路径指向本目录**：`packages/client`（覆盖/合并 `assets/`、`package.json`）。
   - Cocos 会生成：`assets/`、`settings/`、`profiles/`、`library/`、`local/`、`temp/`。
   - 已有的 `assets/scripts/platform/Bootstrap.ts` 和 `logger.ts` 保留。
4. 新建一个空场景 `assets/scenes/Main.scene`，作为入口场景。
5. 新建一个 Component 脚本 `assets/scripts/platform/Entry.ts`（或直接用 Bootstrap 作为 Component），在 `onLoad` 里调用：
   ```ts
   import { bootstrap } from './Bootstrap';
   // onLoad() { bootstrap(); }
   ```
6. 在 Cocos Creator 顶部菜单 → 项目 → 项目设置 → 脚本编译器：确保开启 TypeScript。
7. 预览项目（浏览器或模拟器），控制台应看到：
   ```
   [BidKing] [info] shared version: 0.1.0
   [BidKing] [info] bootstrap ok
   ```

## 目录约定

```
packages/client/
├── assets/
│   ├── scenes/         # Cocos 场景文件
│   ├── prefabs/        # 预制体
│   ├── scripts/        # 业务代码
│   │   ├── game/       # 游戏逻辑（P1 起填充）
│   │   ├── ui/         # UI 组件（P1 起填充）
│   │   └── platform/   # 平台相关（启动、日志、网络等）
│   └── resources/      # 动态加载资源
├── settings/           # Cocos 引擎配置（由编辑器管理）
├── package.json
├── tsconfig.json
└── README.md
```

## 注意事项

- `library/ local/ temp/ profiles/ build/` 均已在根 `.gitignore` 排除，不要入库。
- 所有业务代码必须放 `assets/scripts/`，供 TS 类型检查与 ESLint 扫描。
- Cocos 自动生成的 `*.meta` 文件**需要入库**（`.gitattributes` 已配 LF）。
