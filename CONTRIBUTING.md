# 参与贡献

感谢你为 `prettier-plugin-lint-md` 提交改进。

## 开始之前

- 修复缺陷或新增功能前，请先搜索现有 Issue。
- 安全漏洞不要提交公开 Issue，请按照[安全策略](./SECURITY.md)报告。
- 一个 Pull Request 只处理一个主题，避免混入无关改动。

## 本地开发

项目需要 Node.js 22 或更高版本，并使用 pnpm 管理依赖。

```sh
pnpm install
pnpm check
```

提交 Pull Request 前，请确保类型检查、测试、代码检查、格式检查和构建全部通过。

## 提交信息

项目使用 Conventional Commits 生成版本和更新日志。常用类型如下：

- `feat:` 新增功能
- `fix:` 修复缺陷
- `docs:` 修改文档
- `test:` 修改测试
- `chore:` 维护项目

请说明修改原因，并为行为变更补充测试或文档。
