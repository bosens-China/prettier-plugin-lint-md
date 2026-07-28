# prettier-plugin-lint-md

让 Prettier 格式化后的 Markdown 符合中文排版规范。

## 安装

```sh
npm install --save-dev prettier prettier-plugin-lint-md
```

## 配置

在 Prettier 配置中启用插件：

```js
export default {
  plugins: ['prettier-plugin-lint-md'],
};
```

无需逐条配置规则。插件默认启用全部 16 条可自动修复规则，覆盖中西文空格、数字空格、中文标点、省略号、空链接和代码块等常见问题。

完整的规则列表和高级配置请阅读[在线文档](https://lint-md.github.io/prettier-plugin/)。

[GitHub](https://github.com/lint-md/prettier-plugin) · [问题反馈](https://github.com/lint-md/prettier-plugin/issues) · [MIT License](./LICENSE.txt)
