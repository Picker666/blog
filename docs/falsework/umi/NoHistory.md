# no ‘history‘

## 1、报错

`'"umi"' has no exported member named 'history'. Did you mean 'History'?`

![报错图](/blog/images/umi/umi1.jpg)

## 2、tsconfig.json 配置

确保 tsconfig.json 中有配置 @@ 的路径，比如 "@@/*": ["src/.umi/*"]。

```ts
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "importHelpers": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "sourceMap": true,
    "baseUrl": "./",
    "strict": true,
    "paths": {
      "@/*": ["src/*"],
      "@@/*": ["src/.umi/*"]
    },
    "allowSyntheticDefaultImports": true
  },
  "include": [
    "mock/**/*",
    "src/**/*",
    "config/**/*",
    ".umirc.ts",
    "typings.d.ts"
  ],
  "exclude": [
    "node_modules",
    "lib",
    "es",
    "dist",
    "typings",
    "**/__test__",
    "test",
    "docs",
    "tests"
  ]
}
```

## 3、执行umi generate tmp命令

在npm install 之后，先执行一次npm run postinstall。对应的命令如下：

```js
"scripts": {
  "postinstall": "umi generate tmp",
  "test:jest": "jest --coverage --env=jest-environment-jsdom-sixteen",
}
```
