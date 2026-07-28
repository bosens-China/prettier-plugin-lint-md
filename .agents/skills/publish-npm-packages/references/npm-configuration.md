# npm 配置项与 CI 字段映射

## 目录

- npmjs.com 通用入口
- GitHub Actions 字段映射
- GitLab CI/CD 字段映射
- CircleCI 字段映射
- `npm trust` 命令映射
- Publishing access
- `package.json`
- `.npmrc` 与 CI secrets

## npmjs.com 通用入口

对每个已经存在的包进入：

```text
npmjs.com → Packages → <package> → Settings → Trusted publishing
```

先满足：

- 当前 npm 用户对包具有 write 权限。
- npm 账户已启用 2FA。
- 包已经发布过至少一个版本。
- 准备使用受支持的 cloud-hosted CI runner。

新建配置时必须选择一个 provider，并至少允许 `npm publish` 或 `npm stage publish` 之一。一个包只能保留一个 Trusted Publisher。

## GitHub Actions 字段映射

假设仓库为 `acme/widgets`，入口 workflow 为 `.github/workflows/release.yml`，发布 job 使用 GitHub Environment `npm`：

| npm 网站字段 | 填写示例 | 对应来源 | 填写规则 |
|---|---|---|---|
| Provider | `GitHub Actions` | workflow 所在平台 | 选择 GitHub Actions |
| Organization or user | `acme` | `github.repository_owner` | 只填 owner，不带 `@` |
| Repository | `widgets` | `github.event.repository.name` | 只填仓库名，不填 `acme/widgets` 或 URL |
| Workflow filename | `release.yml` | `.github/workflows/release.yml` | 只填文件名；保留 `.yml`/`.yaml`；大小写完全一致 |
| Environment name | `npm` | `jobs.publish.environment` | 可选；使用时两边完全一致，不使用就留空 |
| Allowed actions | `npm publish` | workflow 中的 `npm publish` | 直接上线时选择 |
| Allowed actions | `npm stage publish` | workflow 中的 `npm stage publish` | 先暂存、再由维护者 2FA 审批时选择 |

对应 workflow：

```yaml
permissions:
  contents: read
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest
    environment: npm
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: "24"
          registry-url: "https://registry.npmjs.org"
          package-manager-cache: false
      - run: npm ci
      - run: npm publish
```

必须对应：

- `permissions.id-token: write` 允许 GitHub 签发 OIDC token。
- `environment: npm` 对应 npm 网站的 Environment name；若网站留空，workflow 不必设置 environment。
- `repository.url` 精确指向 `acme/widgets`。
- 使用 `workflow_call` 或 `workflow_dispatch` 时，npm 会校验入口/calling workflow。填写调用入口文件名，并让父子 workflow 都有 `id-token: write`。
- workflow 文件必须位于 `.github/workflows/`。

## GitLab CI/CD 字段映射

假设项目为 `acme/platform/widgets`，顶层 CI 文件为 `.gitlab-ci.yml`，environment 为 `npm`：

| npm 网站字段 | 填写示例 | 对应来源 | 填写规则 |
|---|---|---|---|
| Provider | `GitLab CI/CD` | pipeline 所在平台 | 选择 GitLab CI/CD |
| Namespace | `acme/platform` | GitLab project namespace | 填用户、group 或 subgroup 路径，不含项目名 |
| Project name | `widgets` | GitLab project name/path | 只填项目名 |
| Top-level CI file path | `.gitlab-ci.yml` | 项目实际顶层 CI 配置 | 填完整相对路径，必须以 `.yml` 结尾 |
| Environment name | `npm` | publish job 的 `environment.name` | 可选；使用时完全一致 |
| Allowed actions | `npm publish` / `npm stage publish` | publish job 命令 | 至少选择一个 |

对应 publish job：

```yaml
publish:
  stage: publish
  image: node:24
  environment:
    name: npm
  id_tokens:
    NPM_ID_TOKEN:
      aud: "npm:registry.npmjs.org"
    SIGSTORE_ID_TOKEN:
      aud: sigstore
  script:
    - npm ci
    - npm run build --if-present
    - npm publish
  only:
    - tags
```

必须对应：

- `NPM_ID_TOKEN.aud` 精确为 `npm:registry.npmjs.org`。
- `SIGSTORE_ID_TOKEN.aud` 为 `sigstore`，供受支持的 provenance 流程使用。
- 使用 GitLab.com shared runner；self-hosted runner 当前不受支持。
- Top-level CI file path 对应顶层配置，不是被 include 的子文件。

## CircleCI 字段映射

| npm 网站字段 | 填写内容 | 获取位置 | 填写规则 |
|---|---|---|---|
| Provider | `CircleCI` | pipeline 所在平台 | 选择 CircleCI |
| Organization ID | UUID | CircleCI Organization Settings Overview | 填 organization UUID，不填名称 |
| Project ID | UUID | CircleCI Project Settings | 填 project UUID |
| Pipeline definition ID | UUID | Project Settings → Project Setup | 填 pipeline definition UUID |
| VCS origin | `github.com/acme/widgets` | 项目的 VCS origin | 不带 `https://`，与项目来源一致 |
| Context IDs | 一个或多个 UUID | Organization Settings → Contexts | 可选；用于限制只有指定 context 的 job 能发布 |
| Allowed actions | `npm publish` / `npm stage publish` | publish job 命令 | 至少选择一个 |

publish 步骤必须产生 `NPM_ID_TOKEN`：

```yaml
- run:
    name: Publish to npm with OIDC
    command: |
      export NPM_ID_TOKEN=$(circleci run oidc get --claims '{"aud":"npm:registry.npmjs.org"}')
      npm publish
```

使用 CircleCI cloud。CircleCI Trusted Publishing 当前不生成 npm provenance。

## `npm trust` 命令映射

使用 npm `>=11.15.0`，从已登录且启用 2FA 的维护者环境执行。`npm trust` 不接受启用 Bypass 2FA 的 granular access token，也不接受旧式用户名/密码 basic auth。

### GitHub

```bash
npm trust github @acme/widgets \
  --repo acme/widgets \
  --file release.yml \
  --env npm \
  --allow-publish
```

| CLI 参数 | npm 网站字段 |
|---|---|
| package 参数 | 当前 npm 包 |
| `--repo acme/widgets` | Organization or user + Repository |
| `--file release.yml` | Workflow filename |
| `--env npm` | Environment name |
| `--allow-publish` | Allowed actions: `npm publish` |
| `--allow-stage-publish` | Allowed actions: `npm stage publish` |
| `--registry` | npm registry；默认 `https://registry.npmjs.org/` |
| `--yes` | 跳过 CLI 确认，不改变权限含义 |

### GitLab

```bash
npm trust gitlab @acme/widgets \
  --project acme/platform/widgets \
  --file .gitlab-ci.yml \
  --env npm \
  --allow-publish
```

`--project` 使用完整 `group/subgroup/project`；网站将其拆成 Namespace 和 Project name。

### CircleCI

```bash
npm trust circleci @acme/widgets \
  --org-id <organization-uuid> \
  --project-id <project-uuid> \
  --pipeline-definition-id <pipeline-uuid> \
  --vcs-origin github.com/acme/widgets \
  --context-id <context-uuid> \
  --allow-publish
```

查看和替换配置：

```bash
npm trust list @acme/widgets
npm trust revoke @acme/widgets --id <trust-id>
```

删除配置会立即改变后续发布认证；没有用户明确授权不要执行 revoke。

## Publishing access

先验证一次 OIDC 发布，再进入：

```text
Package → Settings → Publishing access
```

选择：

```text
Require two-factor authentication and disallow tokens
```

此设置禁止传统 token 发布，但不会阻止 Trusted Publisher。更严格时同时：

- Trusted Publisher 只允许 `npm stage publish`。
- CI 执行 `npm stage publish`。
- 维护者通过 npmjs.com 或 CLI 使用 2FA 审批。

## `package.json`

推荐逐包核对：

| 字段 | 示例 | 用途与规则 |
|---|---|---|
| `name` | `@acme/widgets` | 组织包必须使用 organization scope |
| `version` | `1.2.3` | `name@version` 必须从未发布过 |
| `files` | `["dist"]` | 限制 tarball 内容 |
| `repository.type` | `"git"` | 使用 Git 仓库 |
| `repository.url` | `"git+https://github.com/acme/widgets.git"` | 必须与 Trusted Publisher 仓库精确对应 |
| `repository.directory` | `"packages/widgets"` | monorepo 包填写 package 所在相对目录 |
| `private` | `true` | 阻止发布；不要用它表示 npm 私有包 |
| `publishConfig.registry` | `"https://registry.npmjs.org/"` | 锁定发布 registry |
| `publishConfig.access` | `"public"` / `"restricted"` | 公共包/私有包 |
| `publishConfig.tag` | `"latest"` / `"next"` | 可选；控制 dist-tag |
| `publishConfig.provenance` | `false` | 仅在明确需要关闭 provenance 时使用；OIDC 默认不要设置 |

公共包示例：

```json
{
  "name": "@acme/widgets",
  "version": "1.0.0",
  "files": ["dist"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/acme/widgets.git"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

私有 npm 包使用 `access: "restricted"`，不要设置 `"private": true`。

## `.npmrc` 与 CI secrets

仓库需要明确 registry 时，只写非敏感配置：

```ini
registry=https://registry.npmjs.org/
@acme:registry=https://registry.npmjs.org/
```

规则：

- 不要提交 `//registry.npmjs.org/:_authToken=...`。
- 不要全局设置 `access=public`；它可能影响其他 scope。优先逐包使用 `publishConfig.access`。
- 不要为 Trusted Publishing 添加 `NPM_TOKEN` 或 `NODE_AUTH_TOKEN`。
- 私有依赖使用只读 granular token，并只放在读取步骤：

```yaml
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_READ_TOKEN }}

- run: npm publish
```

发布步骤不继承该 token。

## 官方来源

- [Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)
- [`npm trust`](https://docs.npmjs.com/cli/v11/commands/npm-trust/)
- [`package.json`](https://docs.npmjs.com/cli/configuring-npm/package-json/)
- [npm config](https://docs.npmjs.com/cli/using-npm/config/)
