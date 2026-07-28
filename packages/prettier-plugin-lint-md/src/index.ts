import type { Plugin } from 'prettier';
import markdown from 'prettier/plugins/markdown.js';
import { lintMarkdown } from '@lint-md/core';
import { getPluginOptions, getRules, readConfig } from './utils';
import type { LintOptions } from './types';

export const PARSER_NAME = 'markdown';

export const prettierLintMd = (
  ruleOptions: Partial<LintOptions> = {},
): Plugin => {
  return {
    options: getRules(),
    parsers: {
      [PARSER_NAME]: {
        ...markdown.parsers.markdown,
        preprocess: (text, options) => {
          const lint = readConfig({
            ...ruleOptions,
            ...getPluginOptions(options),
          });
          const result = lintMarkdown(text, lint, true, {
            ruleErrorPolicy: 'strict',
          });
          return result.fixedResult.result;
        },
      },
    },
  };
};

export default prettierLintMd();
