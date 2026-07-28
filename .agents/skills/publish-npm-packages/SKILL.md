---
name: publish-npm-packages
description: Configure, audit, or migrate npm package publishing to current secure practices. Use when Codex needs to publish or prepare an npm package, fill npm Trusted Publisher settings, create a GitHub Actions/GitLab/CircleCI release workflow, adopt OIDC, replace npm tokens, publish organization-scoped public or private packages, or release multiple packages from a monorepo/npm workspaces repository.
---

# Publish npm Packages

按任务读取对应章节，不要一次加载无关内容：

- [政策、版本、token 与执行边界](references/policy-and-prerequisites.md)：开始任何发布工作前读取。
- [npm 配置项与 CI 字段映射](references/npm-configuration.md)：填写 npmjs.com、`package.json`、`.npmrc`、`npm trust` 或 CI 配置时读取。
- [推荐最小示例](references/minimal-example.md)：为单个包建立最小 GitHub Actions OIDC 发布流程时读取。
- [组织公共包与私有包](references/organization-packages.md)：处理 npm organization、scope、visibility、Teams 或私有依赖时读取。
- [Monorepo 多包发布](references/monorepo.md)：处理 workspaces、批量 Trusted Publisher 或独立版本发布时读取。
- [发布前验证与排错](references/verification.md)：完成配置后或发布失败时读取。
