# 配置

插件默认启用全部可自动修复规则，无需额外配置。你可以通过 Prettier 配置或 `.lintmdrc` 关闭或调整个别规则。

## Prettier 配置

除 `configFile` 外，插件规则在 Prettier 中都使用布尔值：

```js title=".prettierrc.mjs"
export default {
  plugins: ['prettier-plugin-lint-md'],
  'space-around-alphabet': false,
  'space-around-number': true,
};
```

`true` 表示启用，`false` 表示关闭。命令行也可以使用 Prettier 自动生成的选项，例如：

```sh
prettier --plugin=prettier-plugin-lint-md --no-space-around-alphabet --write README.md
```

## `.lintmdrc`

插件默认从当前工作目录读取 `.lintmdrc`：

```json title=".lintmdrc"
{
  "space-around-alphabet": 0,
  "space-around-number": 2
}
```

`.lintmdrc` 使用 lint-md 的严重级别：`0` 表示关闭、`1` 表示警告、`2` 表示错误。

![lint-md 严重级别配置](/images/image-2.png)

也可以在 Prettier 配置中指定其他文件：

```js title=".prettierrc.mjs"
export default {
  plugins: ['prettier-plugin-lint-md'],
  configFile: 'config/lint-md.json',
};
```

相对路径以当前工作目录为基准，绝对路径会直接使用。

规则优先级依次为 `.lintmdrc`、`prettierLintMd()` 的工厂配置、本次 Prettier 配置或 `format()` 选项。后面的配置会覆盖前面的配置。

## 不支持的规则

插件只暴露可自动修复的规则，因此不包含无法自动修复的 `no-long-code`。
