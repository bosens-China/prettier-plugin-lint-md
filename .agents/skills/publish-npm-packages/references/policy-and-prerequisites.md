# 政策、版本、token 与执行边界

## 执行边界

- 把检查和修改发布配置视为可执行工作。
- 只有用户明确要求实际发布时，才运行 `npm publish`、`npm stage publish`、修改 npm 包可见性或创建/撤销 Trusted Publisher。
- 发布前展示包名、版本、registry、访问级别和实际命令。
- 不要读取、输出、记录或提交 token。不要把真实 token 写进 `.npmrc`、workflow 或仓库文件。

## 每次重新核对

发布政策会变化。修改配置前查询 npm 官方文档：

- [Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)
- [`npm trust`](https://docs.npmjs.com/cli/v11/commands/npm-trust/)
- [`npm publish`](https://docs.npmjs.com/cli/publish/)
- [npm authentication changes](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/)

以下基线核对于 2026-07-28：

- Trusted Publishing 要求 npm `>=11.5.1`、Node.js `>=22.14.0`。
- `npm trust` 和 Staged Publishing 使用 npm `>=11.15.0`。
- GitHub Actions GitHub-hosted runners、GitLab.com shared runners 和 CircleCI cloud 支持 Trusted Publishing。
- Self-hosted runners 当前不受支持；不要假设企业或自建 runner 可以使用 npm OIDC。
- 每个 npm 包只能配置一个 Trusted Publisher。
- Trusted Publisher 只能为已经存在于 registry 的包配置。

## 为什么推荐 Node.js 24

OIDC 能否工作取决于 npm CLI，而不只取决于 Node.js：

- Node.js 24 通常自带满足 OIDC 要求的 npm 11，因此官方示例使用 Node 24。
- Node.js 22 虽满足最低 Node 要求，但常自带 npm 10；npm 10 不会执行 Trusted Publishing 的 OIDC exchange。
- 使用 Node 22 时，显式安装 npm `>=11.5.1`；若还使用 `npm trust` 或 Staged Publishing，安装 npm `>=11.15.0`。
- 不存在能让 npm 10 支持 Trusted Publishing 的兼容 env。给旧 npm 设置 `NODE_AUTH_TOKEN` 只是改用 token 认证。

推荐发布 job 使用：

```yaml
- uses: actions/setup-node@v6
  with:
    node-version: "24"
    registry-url: "https://registry.npmjs.org"
    package-manager-cache: false
```

必须使用 Node 22 时：

```yaml
- uses: actions/setup-node@v6
  with:
    node-version: "22.14"
    registry-url: "https://registry.npmjs.org"

- run: npm install --global npm@^11.15.0
- run: node --version && npm --version
```

## Token 政策

准确区分：

- **Classic npm token**：已于 2025-12-09 永久撤销，不能恢复、继续使用或重新生成。
- **Granular access token**：仍受支持；写 token 最长 90 天，可配置 Bypass 2FA。只在 Trusted Publishing 不受支持时把写 token 作为 CI 后备方案。
- **只读 granular token**：允许用于安装或查询私有包；限制到必要 package/scope，并只传给读取步骤。
- **`npm login` session**：本地登录产生约两小时会话，适合首次发布或交互式管理，不适合作为长期 CI secret。

不要写“所有 npm token 都已废弃”。应写：

> npm classic token 已永久撤销；granular token 仍存在，但 CI 写 token 需要轮换且暴露面更大。支持的平台优先使用绑定具体 workflow 的 OIDC Trusted Publishing。

## OIDC 的权限范围

OIDC 支持：

- `npm publish`
- `npm stage publish`

OIDC 不替代以下操作的普通认证：

- `npm install` / `npm ci` 读取私有依赖
- `npm view` / `npm access`
- `npm whoami`
- `npm stage list/view/approve/reject`

私有依赖只给读取步骤只读 token；发布步骤不要传 token。
