# React Loadable

## 代码分割（code-splitting）

webpack等打包工具已经支持各种 code-splitting 策略进行优化代码体积。code-splitting，顾名思义，就是将一个完整的 bundle 拆分成多个，实现按需加载或被浏览器缓存，进而实现前端应用代码量加载体积减少。

ES 标准中的 import() 函数提供了原生动态加载支持，例如：

```js
import Module from './bar.js';
console.log(Module);
可以改写成：

import('./bar.js').then(Module => {
  console.log(Module);
});

```

import 将模块内容转换为 ESM 标准的数据结构后，通过 promise 形式返回，加载完成后获取 Module 并在 then 中注册回调函数。

此外，当 webpack 检测到 import() 存在时，将会自动进行 code-splitting，将动态 import 的模块打到一个新 bundle 中：

如果我们希望给动态加载的 bundle 指定命名，也可以在 import 中插入注释：

```js
import((/* webpackChunkName: "bar" */ './bar.js').then(Module => {
  console.log(Module);
});
```

![自定义名字的chunk](/blog/images/react/react-loadable-1.webp)

## 一个简易版的动态加载方案

```js
import Loading from './components/loading';

const MyComponent: React.FC<{}> = () => {
  const [Bar, setBar] = useState(null);
  // 首次 render 前加载 Bar 组件，加载完成后设置 this.state.Bar
  // 起到 componentWillMount 的效果
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

```

上述代码在组件渲染之前，先加载 Bar 组件，加载完成前先渲染 Loading，完成后再重新渲染 Bar 组件。然而，对于每个动态加载组件都需要补充生命周期，兼容加载失败与未完成等场景，是十分复杂且不优雅的。

为了更好地封装与复用，同时处理各种附加场景，本系列我们研究几种 React 相关的动态加载方案，结合源码来给大家讲解其实现原理。

## React-loadable 

react-loadable 提供了一个动态加载任意模块（主要是UI组件）的函数，返回一个封装了动态加载模块（组件）的高阶组件。通过传入诸如模块加载函数、Loading 状态组件、超时等配置参数，统一封装并处理动态加载成功与异常等场景。

我们可以利用 react-loadable 将其改造成 Loadable Component：

```js
import Loadable from 'react-loadable';
import Loading from './components/loading';

const MyComponent = Loadable({
  loader: () => import('./components/Bar'),
  loading: () => <Loading />,
});
```

此外，react-loadable 还支持多资源动态加载，借用官方文档的例子：

```js
Loadable.Map({
  loader: {
    Bar: () => import('./Bar'),
    i18n: () => fetch('./i18n/bar.json').then(res => res.json()),
  },
  render(loaded, props) {
    // loaded 此时是一个对象，key 对应 loader 传入的 key
    // 访问 loaded[key] 即可获取加载完成后的对应模块
    let Bar = loaded.Bar.default;
    let i18n = loaded.i18n;
    return <Bar {...props} i18n={i18n}/>;
  },
});
```

## Loadable Component 是如何支持动态加载的

[参考](https://zhuanlan.zhihu.com/p/584826954)
