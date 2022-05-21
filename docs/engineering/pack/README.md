# 打包资源处理 - 模块化

## 一、模块化的思想

模块化是将一个复杂的程序依据一定的规则/规范装成几个文件，并通过规则/规范组合在一起，内部的数据和实现是私有的，只是向外暴露一些接口活方法 与外部模块通信。

### 模块化解决的问题

* 全局变量冲突
* 依赖关系管理混乱

### 模块化的好处

* 解决命名冲突
* 代码分离，按需加载
* 提高代码复用性和可以维护性

## 二、cjs (commonjs)

* 1、commonjs 是 Node 中的模块规范，通过 require 及 exports 进行导入导出 (进一步延伸的话，module.exports 属于 commonjs2)

* 2、cjs 模块可以运行在**node环境**和**webpack环境**下，但是不能在浏览器直接使用。

::: tip
webpack，rollup 也可以对 cjs 模块解析;

如果前端项目使用webpack解析，在前端项目中是可以写 cjs 代码。
:::

[ms](https://npm.devtool.tech/ms) 只支持 commonjs，但是我们一样可以在webpack项目中使用，但是如果通过cdn的方式直接在浏览器引入，就会有问题。

```js
// sum.js
exports.sum - (x,y) => x + y;

// index.js
const { sum } = require('./sum.js');
```

3、由于cjs 为运行时动态加载，所以可以直接 require 一个变量。

```js
require(`./${a}`)
```

4、cjs 模块输出的是一个值的拷贝

例子如下

## 三、esm (es module)

* 1、esm 是 tc39 对于js的模块规范

* 2、在Node及浏览器均会被支持的

* 3、使用export/import导入导出

```js
// sum.js
export const sum - (x,y) => x + y;

// index.js
const { sum }from './sum.js';
```

* 4、esm为静态导入

因为静态导入，我们就能在编译期进行tree shaking，减少js体积。

tc39也为动态模块加载定义了API

```js
import(module)
```

目前一些前端构建工具已经在从commonjs模块转向esm，比如： skypack、snowpack、vite等等。

### cjs && esm

* cjs 模块输出的是一个值的拷贝，esm 输出的是值的引用

基本数据类型

```js
// 输出模块 counter.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
    counter: counter,
    incCounter: incCounter,
};
// 引入模块 main.js
var mod = require('./counter');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```

复杂数据类型

```js
// 输出模块 counter.js
var counter = {
    value: 3
};

function incCounter() {
    counter.value++;
}
module.exports = {
    counter: counter,
    incCounter: incCounter,
};
// 引入模块 main.js
var mod = require('./counter.js');

console.log(mod.counter.value); // 3
mod.incCounter();
console.log(mod.counter.value); // 4
```

value 是会发生改变的。不过也可以说这是 "值的拷贝"，只是对于引用类型而言，值指的其实是引用。

ESM

```js
// counter.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './counter';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

在node.js中模块导出内容时，exports和module.exports之间的区别（exports就是 module.exports 的引用）。就是node.js 一个模块引入另一个模块的变量的时候就是获取的 module.exports上导出的内容。所以如果你是通过exports这种形式去导出的内容，那么在main.js里面也有是获取exports这个对象上某个属性的内容，在child.js里面改变了这个属性的内容，那么main.js也会有变化；

* cjs 模块是运行时加载，esm 是编译时加载

因为CommonJS加载的是一个对象，（即module.exports属性），该对象只有在脚本运行时才会生成，而ES6模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成

## 四、umd(Universal Module Definition)

一种兼容 cjs 与 amd 的模块，既可以在 node/webpack 环境中被 require 引用，也可以在浏览器中直接用 CDN 被 script.src 引入。

```js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    // CommonJS
    module.exports = factory(require("jquery"));
  } else {
    // 全局变量
    root.returnExports = factory(root.jQuery);
  }
})(this, function ($) {
  // this is where I defined my module implementation

  var Requester = { // ... };

  return Requester;
});
```

* 可以在前端和后端通用
* 与CJS和AMD不同，UMD更像是配置多模块系统的模式
* UMD通常是Rollup、webpack的候补选择

示例: [react-table](https://cdn.jsdelivr.net/npm/react-table/) , [antd](https://cdn.jsdelivr.net/npm/antd/)

这三种模块方案大致如此，部分 npm package 也会同时打包出 commonjs/esm/umd 三种模块化格式，供不同需求的业务使用，比如 antd (opens new window)。

[antd 的 cjs](https://cdn.jsdelivr.net/npm/antd@4.17.2/lib/index.js)

[antd 的 umd](https://cdn.jsdelivr.net/npm/antd@4.17.2/dist/antd.js)

[antd 的 esm](https://cdn.jsdelivr.net/npm/antd@4.17.2/es/index.js)
