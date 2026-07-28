import path from 'node:path';
import fs from 'node:fs';
import * as rules from './rules';
import type { LintOptions } from './types';
import type { SupportOptions } from 'prettier';

/**
 * 读取 JSON 文件
 * 如果异常返回 null
 * @param file JSON 路径，可以为绝对地址也可以为相对地址
 * @returns
 */
export const readJson = (file: string) => {
  if (!file) {
    return null;
  }
  const p = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
  if (!fs.existsSync(p)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
};

/**
 * 读取配置文件
 *
 * @param {Partial<LintOptions>} [config={}]
 * @return {*}
 */
export const readConfig = (config: Partial<LintOptions> = {}) => {
  const { configFile = '.lintmdrc', ...rest } = config;
  const userConfig = readJson(configFile);
  const lint = {
    ...userConfig,
    ...rest,
  };
  /*
   * 对 lint 进行转换
   * 如果是一个数字，那么表示规则的等级：
   * 0：忽略（off），不检查该规则
   * 1：警告（warning），仅出现警告，程序正常退出，不会阻断 CI
   * 2：错误（error），出现错误，程序异常退出，会阻断 CI
   */
  for (const [key, value] of Object.entries(lint)) {
    if (typeof value === 'boolean') {
      lint[key] = value ? 1 : 0;
    }
  }
  return lint;
};

export const getRules = () => {
  const obj: SupportOptions = {};
  for (const rule of Object.values(rules)) {
    obj[rule.name] =
      'type' in rule
        ? {
            type: 'string',
            description: rule.description,
            category: 'Global',
          }
        : {
            type: 'boolean',
            description: rule.description,
            category: 'Global',
          };
  }
  return obj;
};

export const getPluginOptions = (
  options: Record<string, unknown>,
): Partial<LintOptions> => {
  const pluginOptions: Partial<LintOptions> = {};

  for (const rule of Object.values(rules)) {
    const value = options[rule.name];
    const type = 'type' in rule ? 'string' : 'boolean';
    if (typeof value === type) {
      Object.assign(pluginOptions, { [rule.name]: value });
    }
  }

  return pluginOptions;
};
