# import React from ‘react'

先看一段代码：

```js
import React, { Component } from 'react';
class Process extends Component {
  render() {
    return (<div>Picker 666...</div>)
  }
}
```

这是 React17 之前的 react组件开发方式，必须有 `import React from ‘react'`，因为 jsx 语法编译过程中需要使用 `react.createElement` 方法，用于虚拟DOM的创建。

```js
import React from 'react';

function App() {
  return React.createElement('h1', null, 'Hello world');
}
```

在后台，旧的JSX转换为常规的javaScript。因此每个 jsx 文件都需要 引入 React。

## React 17 的更新

看代码：

```js
const Home = () => {
	return (<div>this is home component...</div>)
}

export default Home;
```

编译之后：

```js
var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

var Home = function Home() {
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
    children: "this is home component..."
  });
}
```

其实就是，从`react/jsx-runtime.js` 中去到`jsx`，然后执行；

## 关于 js-runtime.js

从 `js-runtime.js` 导出 `jsxWithValidation`，这个方法的和核心 

```js
var element = jsxDEV(type, props, key, source, self); 

// jsxDEV 方法最后返回的是
ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
```

ReactElement 就是 旧版本中 `React.ReactElement`: 

```js
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner
  };

  {
    element._store = {};

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    });

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    });

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
```

所以，React 的根本没有改变，还是通过 ReactCreateElement 来生成虚拟DOM，只是 react 新增了 jsx 转换的模块，babel 编译的时候，在 jsx 文件中导入该模块，并执行方法即可。
