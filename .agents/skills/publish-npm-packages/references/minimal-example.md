# 推荐最小示例

## 目录

- 前置假设
- package.json
- npm 网站
- GitHub Actions workflow
- 首次发布
- Staged Publishing
- 其他 package manager

## 前置假设

本示例假设：

- 包已经完成首次发布。
- npm 包已绑定 GitHub Actions Trusted Publisher。
- 发布 job 使用 GitHub-hosted runner。
- 仓库使用 npm lockfile。

## package.json

```json
{
  "name": "@acme/example",
  "version": "1.0.0",
  "files": ["dist"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/acme/example.git"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

## npm 网站

进入 `@acme/example → Settings → Trusted publishing`，填写：

| 字段 | 值 |
|---|---|
| Provider | GitHub Actions |
| Organization or user | `acme` |
| Repository | `example` |
| Workflow filename | `publish.yml` |
| Environment name | 留空 |
| Allowed actions | `npm publish` |

## `.github/workflows/publish.yml`

```yaml
name: Publish package

on:
  push:
    tags:
      - "v*"

permissions:
  contents: read
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: "24"
          registry-url: "https://registry.npmjs.org"
          package-manager-cache: false

      - run: npm ci
      - run: npm run build --if-present
      - run: npm run test --if-present
      - run: npm pack --dry-run
      - run: npm publish
```

不要给最后一步传 `NPM_TOKEN` 或 `NODE_AUTH_TOKEN`。

## 首次发布

Trusted Publisher 不能绑定尚不存在的包。对全新公共 scoped 包：

```bash
npm login
npm pack --dry-run
npm publish --access public
```

使用两小时登录会话和 2FA 完成首发，再填写 npm Trusted Publisher。私有包将 `public` 改为 `restricted`，并确保账户或 organization 已启用付费私有包。

## Staged Publishing 变体

希望发布前人工审批时：

1. npm Allowed actions 选择 `npm stage publish`。
2. workflow 最后一步改为：

```yaml
- run: npm stage publish
```

3. 维护者在 npmjs.com 或 CLI 审核并使用 2FA 批准。

## 其他 package manager

pnpm/Yarn 仓库继续使用原 package manager 安装和构建。确保最终发布由支持 OIDC 的 npm CLI 执行，或在采用现有发布工具前核对其 Trusted Publishing 支持；不要因为发布流程擅自替换 lockfile。
