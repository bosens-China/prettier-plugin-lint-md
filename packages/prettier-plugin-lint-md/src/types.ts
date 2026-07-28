export interface LintOptions {
  /**
   * lint-md 配置文件路径，默认为 .lintmdrc
   * 如果存在其他名称可以直接输入
   * 如果在其他文件夹也可以直接输入为绝对路径
   *
   * @type {string}
   * @memberof LintOptions
   */
  configFile?: string;
  /**
   * 中文与英文之间需要增加空格
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'space-around-alphabet'?: boolean;

  /**
   * 中文与数字之间需要增加空格
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'space-around-number'?: boolean;

  /**
   * 代码语言不能为空
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-empty-code-lang'?: boolean;

  /**
   * 链接和图片地址不能为空
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-empty-url'?: boolean;

  /**
   * list 内容不能为空
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-empty-list'?: boolean;

  /**
   * 代码块内容不能为空
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-empty-code'?: boolean;

  /**
   * 行内代码块内容不能为空
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-empty-inline-code'?: boolean;

  /**
   * 引用块内容不能为空
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-empty-blockquote'?: boolean;

  /**
   * 文本中不能有特殊字符
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-special-characters'?: boolean;

  /**
   * 使用标准规范的省略号
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'use-standard-ellipsis'?: boolean;

  /**
   * 不能用全角数字
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-full-width-number'?: boolean;

  /**
   * 中文语境下不能使用半角标点符号
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-half-width-punctuation'?: boolean;

  /**
   * 链接前后不能有空格
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-space-in-link'?: boolean;

  /**
   * 引用块头部和内容间只能有一个空格
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-multiple-space-blockquote'?: boolean;

  /**
   * 标题末尾只能使用合适的标点符号（允许问号、叹号、省略号）
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'correct-title-trailing-punctuation'?: boolean;

  /**
   * 行内代码内容前后不能有空格
   *
   * @type {boolean}
   * @memberof LintOptions
   */
  'no-space-in-inline-code'?: boolean;
}

declare module 'prettier' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RequiredOptions extends LintOptions {}
}

export {};
