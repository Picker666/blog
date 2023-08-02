# React.lazy + Suspense

react-loadable 使用 React 16.5.2 版本，而从 16.6.0 版本开始，React 原生提供了 code-splitting 与组件动态加载的方案，引入了 lazy 函数，同时也支持使用 Suspense 与 ErrorBoundary 来进行异常处理与 fallback 展示。本文我们来看看如何使用 React.lazy 与 Suspense 实现组件动态加载，同时结合源码更深入理解原理。

## React.lazy 和 Suspense 

React.lazy 支持动态引入组件，需要接收一个 dynamic import 函数，函数返回的应为 promise 且需要默认导出需要渲染的组件。同时，React.lazy() 组件需要在 React.Suspense 组件下进行渲染，Suspense 又支持传入 fallback 属性，作为动态加载模块完成前组件渲染的内容。

```js
import Loading from './components/loading';
const MyComponent: React.FC<{}> = () => {
  const [Bar, setBar] = useState(null);
  const firstStateRef = useRef({});
  if (firstStateRef.current) {
    firstStateRef.current = undefined;
    import(/* webpackChunkName: "bar" */ './components/Bar').then(Module => {
      setBar(Module.default);
    });
  }
  if (!Bar) return <Loading />;
  return <Bar />;
}

// 改造后

import React, { lazy, Suspense } from 'react';
import Loading from './components/loading';
const Bar = lazy(() => import('./components/Bar'));
const MyComponent = (
  <Suspense fallback={<Loading />}>
      <Bar />
  </Suspense>
);
```

## 源码角度来看 React lazy 原理

[参考](https://zhuanlan.zhihu.com/p/585197600)
