# 介绍

## 为什么需要这个插件

[Prettier 3](https://prettier.io/blog/2023/07/05/3.0.0.html#stop-inserting-spaces-between-chinese-or-japanese-and-western-characters) 不再自动在中文、日文与西文之间插入空格。这个决定适合 Prettier 的整体用户群体。中文技术文档往往仍希望保留这类排版规则。

![Prettier 3 关于中西文空格的变更说明](/images/image.png)

相关讨论可参考 [Markdown: Add an option to re-enable Prettier 2.x's automatic space insertion in CJK](https://github.com/prettier/prettier/issues/15015)。

## 工作原理

插件复用 Prettier 内置的 Markdown 解析器，并在解析前调用 [`@lint-md/core`](https://github.com/lint-md/lint-md) 修复中文排版：

```text
Markdown 源文档 → lint-md 修复 → Prettier 格式化 → 输出
```

lint-md 的规则参考了[中文技术文档的写作规范](https://github.com/ruanyf/document-style-guide)。插件只暴露能够自动修复的规则，避免在格式化流程中加入仅报告、无法修正的问题。

![lint-md 规则示例](/images/image-1.png)
