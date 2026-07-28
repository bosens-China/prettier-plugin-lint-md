# Monorepo 多包发布

## 目录

- 根目录和 workspace
- Trusted Publisher 模型
- 批量配置
- 选择发布范围
- 非原子性

## 根目录和 workspace

阻止根包发布：

```json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

每个可发布 workspace 独立设置：

- 唯一 `name` 和 `version`
- `files`、入口和 exports
- `repository.url`
- `repository.directory`
- `publishConfig.registry`
- `publishConfig.access`
- npm 权限和 Trusted Publisher

示例：

```json
{
  "name": "@acme/core",
  "version": "1.2.0",
  "files": ["dist"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/acme/monorepo.git",
    "directory": "packages/core"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

不要给准备发布到 npm 的私有 workspace 设置 `private: true`；使用 `publishConfig.access: "restricted"`。

## Trusted Publisher 模型

npm 按包保存 Trusted Publisher，不按 organization、scope 或仓库保存。多个包可以全部绑定同一个：

```text
Repository: acme/monorepo
Workflow: release.yml
Environment: npm
```

但每个 npm 包都必须单独建立配置。新 workspace 的包必须先完成首次发布。

## 批量配置

`npm trust` 不感知 workspaces。使用 npm `>=11.15.0`，显式列出已经存在的包：

```bash
packages=(
  "@acme/core"
  "@acme/react"
  "@acme/utils"
)

for package in "${packages[@]}"; do
  npm trust github "$package" \
    --repo acme/monorepo \
    --file release.yml \
    --env npm \
    --allow-publish \
    --yes
  sleep 2
done
```

第一次请求完成 2FA；保留短暂间隔避免限流。需要人工审批时把 `--allow-publish` 换成 `--allow-stage-publish`。

只有用户明确授权时执行批量 trust 变更。

## 选择发布范围

所有 workspace 同步升级且全部发布：

```bash
npm publish --workspaces
```

只发布明确包：

```bash
npm publish \
  --workspace=@acme/core \
  --workspace=@acme/react
```

独立版本或只发布变化包：

- 优先复用仓库已有 Changesets、Lerna 或发布脚本。
- 只有确实需要版本计算、依赖联动和 changelog 自动化时才新增工具。
- 确认工具最终调用支持 OIDC 的 npm CLI。
- 不要用 `npm whoami` 判断 OIDC 是否可用；OIDC 只在 publish/stage 操作期间生效。

## 非原子性

`npm publish --workspaces` 不是原子事务。后续 workspace 失败不会回滚已经发布的包。

发布前：

1. build 和 test 全部目标包。
2. 对每个包运行或等价执行 `npm pack --dry-run`。
3. 确认每个 `name@version` 尚未存在。
4. 排除 `private: true` 和本次不发布的 workspace。
5. 按内部依赖顺序发布，或让现有 release 工具选择变化包。
6. 确认每个包的 `publishConfig.access`，允许同一 monorepo 混合公共包和私有包。

私有包的版本查询和依赖安装可能需要只读 granular token；不要因此给发布步骤写 token。

## 官方来源

- [`npm trust`](https://docs.npmjs.com/cli/v11/commands/npm-trust/)
- [`npm publish`](https://docs.npmjs.com/cli/publish/)
- [npm workspaces](https://docs.npmjs.com/misc/workspaces/)
- [`package.json`](https://docs.npmjs.com/cli/configuring-npm/package-json/)
