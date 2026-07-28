import { beforeEach, describe, expect, test } from 'vitest';
import prettierPluginLintMd, {
  prettierLintMd,
  PARSER_NAME,
} from '../src/index';
import { format } from 'prettier';
import fs from 'node:fs';

/*
 * \n是prettier默认携带的，这里忽略掉，不是错误
 */

const formatCode = async (code: string) =>
  format(code, {
    parser: PARSER_NAME,
    plugins: [prettierPluginLintMd],
  });

test(`格式化中英文空格`, async () => {
  const code = `测试abc`;
  await expect(formatCode(code)).resolves.toBe(`测试 abc\n`);
});

test(`格式化中文`, async () => {
  const code = `测试`;
  await expect(formatCode(code)).resolves.toBe(`测试\n`);
});
test(`格式化英文`, async () => {
  const code = 'abc';
  await expect(formatCode(code)).resolves.toBe(`${code}\n`);
});

test(`保留 lint-md 修复后的空字符串`, async () => {
  await expect(formatCode('```\n```')).resolves.toBe('');
});

test(`验证配置`, async () => {
  const code = `测试abc`;
  await expect(
    format(code, {
      parser: PARSER_NAME,
      plugins: [
        prettierLintMd({
          'space-around-alphabet': false,
        }),
      ],
    }),
  ).resolves.toBe(`${code}\n`);
});

test(`读取 Prettier 插件选项`, async () => {
  const code = `测试abc`;
  await expect(
    format(code, {
      parser: PARSER_NAME,
      plugins: [prettierPluginLintMd],
      'space-around-alphabet': false,
    }),
  ).resolves.toBe(`${code}\n`);
});

test(`Prettier 插件选项覆盖工厂配置`, async () => {
  const code = `测试abc`;
  await expect(
    format(code, {
      parser: PARSER_NAME,
      plugins: [
        prettierLintMd({
          'space-around-alphabet': true,
        }),
      ],
      'space-around-alphabet': false,
    }),
  ).resolves.toBe(`${code}\n`);
});

test(`根据 Markdown 文件名推断解析器`, async () => {
  await expect(
    format(`测试abc`, {
      filepath: 'README.md',
      plugins: [prettierPluginLintMd],
    }),
  ).resolves.toBe(`测试 abc\n`);
});

describe('配置文件', () => {
  const configFile = '.config';
  beforeEach(() => {
    // 写入一个配置文件，之后删除
    fs.writeFileSync(
      configFile,
      JSON.stringify({ 'space-around-alphabet': false }),
      'utf-8',
    );
    return () => {
      fs.rmSync(configFile);
    };
  });
  test(`验证配置文件是否有效`, async () => {
    const code = `测试abc`;
    await expect(
      format(code, {
        parser: PARSER_NAME,
        plugins: [prettierPluginLintMd],
        configFile: configFile,
      }),
    ).resolves.toBe(`${code}\n`);
  });
  test(`覆盖配置文件`, async () => {
    const code = `测试abc`;
    await expect(
      format(code, {
        parser: PARSER_NAME,
        plugins: [prettierPluginLintMd],
        configFile: configFile,
        'space-around-alphabet': true,
      }),
    ).resolves.toBe(`测试 abc\n`);
  });
});
