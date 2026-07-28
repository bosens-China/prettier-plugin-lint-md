# Node.js API

## 直接使用默认插件

```ts
import { format } from 'prettier';
import prettierPluginLintMd from 'prettier-plugin-lint-md';

const result = await format('中文abc', {
  parser: 'markdown',
  plugins: [prettierPluginLintMd],
});
```

## 创建固定配置的插件

`prettierLintMd()` 可以创建带有固定规则的插件实例：

```ts
import { format } from 'prettier';
import { prettierLintMd } from 'prettier-plugin-lint-md';

const plugin = prettierLintMd({
  'space-around-alphabet': false,
});

const result = await format('中文abc', {
  parser: 'markdown',
  plugins: [plugin],
});
```

调用 `prettierLintMd()` 时传入的规则会覆盖 `.lintmdrc`；本次 `format()` 调用中的同名插件选项仍具有最高优先级。

## CommonJS

构建产物也包含 CommonJS 版本：

```js
const prettierPluginLintMd =
  require('prettier-plugin-lint-md/dist/prettier-plugin-lint-md.cjs').default;
```
