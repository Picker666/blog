# 按需加载

出于性能的考虑，我们会对模块和组件进行按需加载。

## 通过 umi/dynamic 接口实现

```js
import dynamic from 'umi/dynamic';

const delay = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));
const App = dynamic({
  loader: async function() {
    await delay(/* 1s */1000);
    return () => <div>I will render after 1s</div>;
  },
});
```

## dynamicImport

官方插件 [umi-plugin-react](https://v2.umijs.org/zh/plugin/umi-plugin-react.html#dynamicimport)

* 类型：Object

实现路由级的动态加载（code splitting），可按需指定哪一级的按需加载。

* 配置项包含：
  * webpackChunkName，是否通过 webpackChunkName 实现有意义的异步文件名
  * loadingComponent，指定加载时的组件路径
  * level，指定按需加载的路由等级

## 按需加载模块

通过 import() 实现，比如：

```js
import('g2').then(() => {
  // do something with g2
});
```
