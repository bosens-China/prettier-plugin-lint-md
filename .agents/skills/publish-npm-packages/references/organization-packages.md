# 组织公共包与私有包

## 目录

- 组织和 scope
- 公共包
- 私有包
- Trusted Publishing
- 私有依赖
- Provenance

## 组织和 scope

组织只能管理 scoped 包：

```text
@organization/package
```

创建包前确认：

- npm organization 已存在。
- 发布者属于 organization 并有对应包的 write 权限。
- 包的 `name` 使用正确 organization scope。

## 公共包

- npm organization 可免费发布公共包。
- 所有人可以查看和安装。
- 只有拥有 read-write 权限的 organization team 成员或受信 workflow 可以发布。
- 设置：

```json
{
  "name": "@acme/public-package",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

- 首次发布明确运行：

```bash
npm publish --access public
```

## 私有包

- 需要付费 npm user/organization plan。
- 只有获得 organization team read 权限的成员可以安装。
- 只有获得 read-write 权限的成员或受信 workflow 可以发布。
- 设置：

```json
{
  "name": "@acme/private-package",
  "publishConfig": {
    "access": "restricted",
    "registry": "https://registry.npmjs.org/"
  }
}
```

- 首次发布运行：

```bash
npm publish --access restricted
```

不要使用：

```json
{
  "private": true
}
```

`private: true` 会让 npm 拒绝发布。它适用于 monorepo 根目录或永不发布的内部 workspace，不代表 npm registry 上的私有可见性。

## Trusted Publishing

公共包和私有包都可以使用 OIDC Trusted Publishing。每个包分别配置 Trusted Publisher，即使它们属于同一个 organization。

配置成功并验证后，进入包的 Publishing access，选择：

```text
Require two-factor authentication and disallow tokens
```

## 私有依赖

Trusted Publishing 只认证 publish/stage 操作。CI 安装私有包仍需只读 granular token：

```yaml
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_READ_TOKEN }}

- run: npm publish
```

将 token 限制到必要 scope/package，并只传给读取步骤。不要给发布步骤写 token。

## Provenance

自动 provenance 需要同时满足：

- 使用 GitHub Actions 或 GitLab Trusted Publishing。
- 源码仓库公开。
- npm 包公开。

私有包、私有源码仓库和 CircleCI Trusted Publishing 当前不会生成 npm provenance，但仍可使用 OIDC 发布。

## 官方来源

- [Organization scoped packages](https://docs.npmjs.com/creating-and-publishing-an-organization-scoped-package/)
- [Package access matrix](https://docs.npmjs.com/package-scope-access-level-and-visibility/)
- [Private packages](https://docs.npmjs.com/about-private-packages/)
