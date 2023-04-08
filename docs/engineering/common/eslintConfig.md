# eslint 配置

```js
module.exports = {
  extends: ['airbnb', 'prettier', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser', // 定义 ESLint 的解析器
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  parserOptions: {
    // ts 版本的提示信息
    warnOnUnsupportedTypeScriptVersion: false,
  },
  rules: {
    /* ts */
    'no-unused-expressions': ['warn', { allowShortCircuit: true, allowTernary: true }], // 允许短路运算和三元运算 其他warning
    /* js */
    'max-len': ['error', { code: 150 }], // 最大行字符数
    /* react */
    'react-hooks/exhaustive-deps': 'off', // 允许react-hooks依赖不全
    'react/no-array-index-key': 'off', // 允许用index做key
    'react/function-component-definition': [
      2,
      { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
    ], // 默认用箭头函数定义函数组件
    'react/jsx-filename-extension': 'off', // 允许tsx里面不带类型定义
    'react/require-default-props': 'off', // 允许没有默认值
    'react/react-in-jsx-scope': 'off', // 允许React不带import React
    /* import */
    'import/extensions': 'off', // 允许不带扩展名
    'import/prefer-default-export': 'off', // 允许不用export default
    'import/resolver': 'off', // 关闭eslint模块解析（已经有ts做了依赖解析）
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    radix: ['error', 'as-needed'],
    'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
    'jsx-a11y/no-static-element-interactions': 'off',
    curly: ['error', 'all'],
    'brace-style': 'error',
    'no-multiple-empty-lines': 'error',
    'no-underscore-dangle': 'off',
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"]
  },
  // 依赖解析用 ts
  settings: {
    'import/parser': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
};
```
