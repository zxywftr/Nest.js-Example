module.exports = {
  root: true, // true：停止在父级目录中寻找配置文件，以避免导致意想不到的结果
  // plugin 插件主要是为 eslint 新增一些检查规则
  // eslint-config-prettier 的作用是关闭eslint中与prettier相互冲突的规则。
  // eslint-plugin-prettier 的作用是赋予eslint用prettier格式化代码的能力。 安装依赖并修改.eslintrc文件
  // 'eslint-plugin-tsdoc': tsdoc
  plugins: ['@typescript-eslint', 'eslint-plugin-prettier'],
  /* 指定如何解析语法。*/
  parser: '@typescript-eslint/parser',
  /* 优先级低于parse的语法解析配置 */
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  // estends 的作用，就是继承社区整理好的配置规则
  extends: [
    'plugin:@typescript-eslint/recommended', // typescript-eslint推荐规则,
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'eol-last': 'off', // 要求或禁止文件末尾存在空行
    'no-unused-vars': 'off', // 未使用变量
    'no-plusplus': 'off', // 禁用一元操作符 ++ 和 --
    'no-trailing-spaces': 'off', // 禁用行尾空格
    'no-underscore-dangle': 'off', // 禁止标识符中有悬空下划线
    'no-nested-ternary': 'off', // 禁用嵌套的三元表达式
    'no-await-in-loop': 'off', // 禁止在循环中出现 await
    eqeqeq: 'off', // 要求使用 === 和 !==
    'no-bitwise': 'off', // 禁用按位运算符
    'no-tabs': 'off', // 禁用 tab
    'no-var': 'off', // 禁止使用 var
    '@typescript-eslint/no-unused-vars': 'off', // 未使用变量
    '@typescript-eslint/no-explicit-any': 'off', // 使用any
    // '@typescript-eslint/triple-slash-reference': 'off', // 禁用三斜线表达式
    // 'tsdoc/syntax': 'warn', // tsdoc
    endOfLine: "CRLF", //不让prettier检测文件每行结束的格式
  },
  // 设置您的脚本在哪种环境中运行。每个环境都会带来一组特定的预定义全局变量。可以简单理解为批量设置全局变量，这些环境不是互斥的，因此您一次可以定义多个环境。
  env: {
    node: true, // Node.js 全局变量和 Node.js 作用域
    commonjs: true, // CommonJS 全局变量和 CommonJS 作用域 (启用此环境用于使用 Browserify/WebPack 的 browser-only 代码)
    'shared-node-browser': true, // Node.js 和 Browser 通用的全局变量
    es6: true, // 启用除 modules 以外的所有 ECMAScript 6 特性  (这会自动将 `ecmaVersion` 解析器选项设置为 6)
    es2017: true, // 添加所有 ECMAScript 2017 的全局变量并且自动设置 `ecmaVersion` 解析器选项设置为 8
    es2020: true, // 添加所有 ECMAScript 2020 的全局变量并且自动设置 `ecmaVersion` 解析器选项设置为 11
    es2021: true, // 添加所有 ECMAScript 2021 的全局变量并且自动设置 `ecmaVersion` 解析器选项设置为 12
    worker: true, // web workers 全局变量
  },
};
