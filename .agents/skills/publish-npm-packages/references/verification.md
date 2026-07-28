# 发布前验证与排错

## 配置验证

- 检查 `node --version` 和 `npm --version`。
- Trusted Publishing 使用 npm `>=11.5.1`；`npm trust`/stage 使用 npm `>=11.15.0`。
- 检查 registry 为 `https://registry.npmjs.org/`，不要写成 `.com`。
- 检查包名、version、scope、access、repository 和打包文件。
- 运行 `npm pack --dry-run` 并检查 tarball 清单。
- 检查 npm Trusted Publisher 的 repo、workflow、environment 和 allowed action 完全匹配。
- 检查 CI 使用受支持的 cloud-hosted runner。
- 检查 GitHub workflow 有 `id-token: write`。
- 检查发布步骤没有写 token。
- 私有依赖只在读取步骤使用只读 token。
- 确认新包已经完成首次发布。
- 确认 monorepo 每个目标包都有独立 Trusted Publisher。

`npm publish --dry-run` 和 `npm pack --dry-run` 不会验证真实 OIDC 认证。不要把 dry run 成功当作 Trusted Publisher 已验证。

## 常见错误

### `ENEEDAUTH`、token expired/revoked 或 404

依次检查：

1. npm 是否低于 11.5.1。
2. registry 是否误写为 `https://registry.npmjs.com`。
3. npm 网站的 owner、repository、workflow 文件名和 environment 是否完全匹配。
4. workflow 文件名是否包含 `.yml`/`.yaml`，且只填文件名。
5. GitHub 是否有 `permissions.id-token: write`。
6. 是否使用 self-hosted runner。
7. `workflow_call` 是否错误绑定了被调用文件而不是入口 workflow。
8. `package.json.repository.url` 是否指向实际发布仓库。

npm 可能用 404 隐藏无权限资源，不要只按“包不存在”处理。

### 403 或 access 错误

- 检查 organization team 的 read-write 权限。
- 检查公共 scoped 包首次发布是否设置 `--access public`。
- 检查私有包是否有付费计划并使用 `access: restricted`。
- 检查 Trusted Publisher Allowed actions 与实际 `npm publish`/`npm stage publish` 是否一致。

### 私有依赖安装失败

OIDC 不认证 `npm ci`、`npm install` 或 `npm view`。给对应读取步骤配置 scope 受限的只读 granular token，不要传给发布步骤。

### Provenance 缺失

确认：

- provider 是 GitHub Actions 或 GitLab。
- 源码仓库公开。
- npm 包公开。

CircleCI、私有源码仓库或私有 npm 包当前不会生成自动 provenance。不要为了隐藏配置错误随意设置 `NPM_CONFIG_PROVENANCE=false`。

## 完成报告

说明：

- 修改了哪些本地文件。
- npm 网站仍需用户填写或已经明确授权完成哪些配置。
- 是否只运行 dry run。
- 是否实际创建 Trusted Publisher 或发布版本。
- 哪些限制仍存在，例如首次发布、付费私有包、self-hosted runner 或私有依赖 token。
