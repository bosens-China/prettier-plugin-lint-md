import { afterEach, expect, test } from 'vitest';
import { format } from 'prettier';
import { prettierLintMd, PARSER_NAME } from '../src/index';
import fs from 'node:fs';
import path from 'node:path';

const configPath = path.join(process.cwd(), '.test');

afterEach(() => {
  fs.rmSync(configPath, { force: true });
});

test(`no-space-in-inline-code`, async () => {
  const md = '- right `      const a = 1     ` 你好';

  await expect(
    format(md, {
      parser: PARSER_NAME,
      plugins: [
        prettierLintMd({
          'no-space-in-inline-code': true,
        }),
      ],
    }),
  ).resolves.toBe('- right `const a = 1` 你好\n');
});

test(`no-full-width-number 可以关闭`, async () => {
  await expect(
    format('全角１数字', {
      parser: PARSER_NAME,
      plugins: [
        prettierLintMd({
          'no-full-width-number': false,
        }),
      ],
    }),
  ).resolves.toBe('全角１数字\n');
});

test(`no-half-width-punctuation`, async () => {
  await expect(
    format('中文,中文', {
      parser: PARSER_NAME,
      plugins: [prettierLintMd()],
    }),
  ).resolves.toBe('中文，中文\n');
});

test(`no-half-width-punctuation 可以关闭`, async () => {
  await expect(
    format('中文,中文', {
      parser: PARSER_NAME,
      plugins: [
        prettierLintMd({
          'no-half-width-punctuation': false,
        }),
      ],
    }),
  ).resolves.toBe('中文,中文\n');
});

test(`no-space-in-inline-code 配置文件`, async () => {
  fs.writeFileSync(
    configPath,
    JSON.stringify({ 'no-space-in-inline-code': true }),
    'utf-8',
  );

  const md = '- right `      const a = 1     ` 你好';

  await expect(
    format(md, {
      parser: PARSER_NAME,
      plugins: [
        prettierLintMd({
          configFile: configPath,
        }),
      ],
    }),
  ).resolves.toBe('- right `const a = 1` 你好\n');
});
