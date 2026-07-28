# 规则

下面 16 条规则全部默认启用，无需逐条配置。需要关闭某条规则时，可以在 Prettier 配置中将其设置为 `false`。

| 规则                                 | 默认启用 | 说明                           |
| ------------------------------------ | -------- | ------------------------------ |
| `space-around-alphabet`              | 是       | 中文与英文之间增加空格         |
| `space-around-number`                | 是       | 中文与数字之间增加空格         |
| `no-empty-code-lang`                 | 是       | 代码块语言不能为空             |
| `no-empty-url`                       | 是       | 链接和图片地址不能为空         |
| `no-empty-list`                      | 是       | 列表内容不能为空               |
| `no-empty-code`                      | 是       | 代码块内容不能为空             |
| `no-empty-inline-code`               | 是       | 行内代码内容不能为空           |
| `no-empty-blockquote`                | 是       | 引用块内容不能为空             |
| `no-special-characters`              | 是       | 文本中不能有特殊字符           |
| `use-standard-ellipsis`              | 是       | 使用标准省略号                 |
| `no-full-width-number`               | 是       | 不能使用全角数字               |
| `no-half-width-punctuation`          | 是       | 中文语境下不能使用半角标点     |
| `no-space-in-link`                   | 是       | 链接前后不能有空格             |
| `no-multiple-space-blockquote`       | 是       | 引用标记和内容间只能有一个空格 |
| `correct-title-trailing-punctuation` | 是       | 标题末尾只使用合适的标点       |
| `no-space-in-inline-code`            | 是       | 行内代码内容前后不能有空格     |

规则的具体行为由 [`@lint-md/core`](https://github.com/lint-md/lint-md) 提供。
