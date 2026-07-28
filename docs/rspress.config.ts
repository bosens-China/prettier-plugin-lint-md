import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  base: process.env.GITHUB_ACTIONS ? '/prettier-plugin/' : '/',
  siteOrigin: 'https://lint-md.github.io',
  lang: 'zh',
  title: 'prettier-plugin-lint-md',
  description: '让 Prettier 格式化后的 Markdown 符合中文排版规范',
  icon: '/images/logo.png',
  logo: '/images/logo.png',
  logoText: 'prettier-plugin-lint-md',
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/lint-md/prettier-plugin',
      },
    ],
  },
});
