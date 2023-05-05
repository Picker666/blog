# 动态引入原理

ECMAScript 2016 引入模块化，使用 import 引入模块的引用，并且是在编译的时候引入， 只能出现在最顶层；

ECMAScript 2021 新增动态 Dynamic import，可以根据需要动态引入模块。

用法：

```js
const calc = async () => {
  const module = await import('./temp.js')
  module.default(1,2);
  module.minus(2, 2)
}

// 或者

const calc = async () => {
  import('./temp.js').then(moduls => {
    module.default(1,2);
    module.minus(2, 2)
  })
}
```

## 一、环境

```json
"webpack": "^5.82.0",
"webpack-cli": "^5.0.2",
```

## 二、Demo详情

![目录](/blog/images/engineering/webpack-dynamic-import1.png)

```js
// ./src/index.js
const calc = async () => {
  const module = await import('./temp.js')
  module.default(1,2);
  module.minus(2, 2)
}
(() => {
  document.querySelector('.div').addEventListener('click', calc)
})()

export default calc;

// ./src/temp.js
function add (a, b) {
  console.log(a, b);
  return a + b;
}

const minus = (a, b) => {
  console.log('a, b: ', a, b);
  return a - b;
}

export default add;

export {minus};
```

## 三、原理

从代码层面一步一步的看，如何做到动态加载，已经缓存机制。

## 四、编译之后的index.js

```js index.js
(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

  // 将 __webpack_exports__ 标记为 Module 对象，并且设置 __esModule值为true
  __webpack_require__.r(__webpack_exports__);

  // 将 default 设置为 __webpack_exports__ 的可枚举属性
  __webpack_require__.d(__webpack_exports__, {
    "default": () => (__WEBPACK_DEFAULT_EXPORT__)
  });

  const calc = async () => {
    const module = await __webpack_require__.e("src_temp_js").then(__webpack_require__.bind(__webpack_require__, "./src/temp.js"))
    
    module.default(1,2);
    module.minus(2, 2)
  }

  (() => {
    document.querySelector('.div').addEventListener('click', calc)
  })()

  /* harmony default export */ 
  const __WEBPACK_DEFAULT_EXPORT__ = (calc);
  //# sourceURL=webpack://testing/./src/index.js?"

}
```

动态的 `import` 变成了 `__webpack_require__.e("src_temp_js")`。

## 五、`__webpack_require__.e`

```js
__webpack_require__.e = (chunkId) => {
  return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
    __webpack_require__.f[key](chunkId, promises);
    return promises;
  }, []));
}
```

这里只是 循环执行 `__webpack_require__.f[key]` 并返回的 `promises` 作为 `Promise.all` 参数。

## 六、`__webpack_require__.f`

```js
var installedChunks = {
  "main": 0
};

__webpack_require__.f: {
  j: (chunkId, promises) => {
    // JSONP chunk loading for javascript
    var installedChunkData = __webpack_require__.o(installedChunks, chunkId)
        ? installedChunks[chunkId]
        : undefined;
    if (installedChunkData !== 0) { // 0 means "already installed".

      // a Promise means "currently loading".
      if (installedChunkData) {
          promises.push(installedChunkData[2]);
      } else {
        if (true) { // all chunks have JS
          // setup Promise in chunk cache
          var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
          promises.push(installedChunkData[2] = promise);

          // start chunk loading
          var url = __webpack_require__.p + __webpack_require__.u(chunkId);
          // create error before stack unwound to get useful stacktrace later
          var error = new Error();
          var loadingEnded = (event) => {
              if (__webpack_require__.o(installedChunks, chunkId)) {
                  installedChunkData = installedChunks[chunkId];
                  if (installedChunkData !== 0) 
                      installedChunks[chunkId] = undefined;
                  if (installedChunkData) {
                      var errorType = event && (event.type === 'load'
                          ? 'missing'
                          : event.type);
                      var realSrc = event && event.target && event.target.src;
                      error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                      error.name = 'ChunkLoadError';
                      error.type = errorType;
                      error.request = realSrc;
                      installedChunkData[1](error);
                  }
              }
          };
          __webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
        } else 
          installedChunks[chunkId] = 0;
      }
    }
  }
}
```

`__webpack_require__.f` 是个对象，并且只有一个key 为 `j` 的方法，也就是在 `__webpack_require__.e` 的 `reduce` 中执行的方法；

`__webpack_require__.f.j` 方法的作用：

* 1、创建 `promise`，并将 `[resolve, reject, promise]` 存储到 `installedChunks`, `chunkId` 作为 key；
* 2、将 `promise` 存储到 promises 中，用来作为 `__webpack_require__.e`  `reduce` 的返回值；
* 3、定义加载文件失败的回调，执行 promise 的 reject 并抛出错误，同时删除 installedChunks[chunkId] 的缓存；
* 4、生成资源的的url（`http://127.0.0.1:5500/dist/src_temp_js.bundle.js`）;
* 5、并调用`__webpack_require__.l`。

:::tip
以上是初次执行逻辑，再次执行时候  `installedChunks[chunkId]` 等于 0；
:::

## 七、`__webpack_require__.l`

```js
var inProgress = {};
var dataWebpackPrefix = "testing:";

__webpack_require__.l: (url, done, key, chunkId) => {
  if (inProgress[url]) {
      inProgress[url].push(done);
      return;
  }
  var script,
      needAttach;
  if (key !== undefined) {
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) {
          var s = scripts[i];
          if (s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) {
              script = s;
              break;
          }
      }
  }
  if (!script) {
      needAttach = true;
      script = document.createElement('script');

      script.charset = 'utf-8';
      script.timeout = 120;
      if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
      }
      script.setAttribute("data-webpack", dataWebpackPrefix + key);
      script.src = url;
  }
  inProgress[url] = [done];
  var onScriptComplete = (prev, event) => {
      // avoid mem leaks in IE.
      script.onerror = script.onload = null;
      clearTimeout(timeout);
      var doneFns = inProgress[url];
      delete inProgress[url];
      script.parentNode && script
          .parentNode
          .removeChild(script);
      doneFns && doneFns.forEach((fn) => (fn(event)));
      if (prev) 
          return prev(event);
      }
  var timeout = setTimeout(onScriptComplete.bind(null, undefined, {
      type: 'timeout',
      target: script
  }), 120000);
  script.onerror = onScriptComplete.bind(null, script.onerror);
  script.onload = onScriptComplete.bind(null, script.onload);
  needAttach && document
      .head
      .appendChild(script);
}
```

`__webpack_require__.l` 的作用：

* 1、先验证是否要加载的资源正在加载，如果是，只需要给对应的url设置错误回调即可，否则，继续往下；
* 2、判断当前url是否已经存在对应script，如果是 只需要 找到对应的 script 标签即可，否则继续往下；
* 3、设置script加载完或者错误回调函数，清除 inProgress 中的进行中的缓存，删除 script，执行 `__webpack_require__.f` 中的回调（一定是失败的回调）；
* 4、设置 120 秒加载资源倒计时；
* 4、创建script标签并设置url为当前资源url，并插入到head标签中；

总结一下：`__webpack_require__.l` 的作用就是执行通过 script标签加载 资源（编译后的），加载完之后清除script标签。

## 八、编译之后的temp.js

```js temp.js（稍微格式化一下）
"use strict";
(self["webpackChunktesting"] = self["webpackChunktesting"] || []).push([["src_temp_js"],{

  "./src/temp.js": ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

    // 将 __webpack_exports__ 标记为 Module 对象，并且设置 __esModule值为true
    __webpack_require__.r(__webpack_exports__);

    // 将 default 和 minus 设置为 __webpack_exports__ 的可枚举属性
    __webpack_require__.d(__webpack_exports__, {
      "default": () => (__WEBPACK_DEFAULT_EXPORT__),
      "minus": () => (minus)
    });

    function add (a, b) {
      console.log(a, b);
      return a + b;
    }

    const minus = (a, b) => {
      console.log('a, b: ', a, b);
      return a - b;
    }
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = (add);

    //# sourceURL=webpack://testing/./src/temp.js?
  })
}]);
```

总结来说就是 往 `self["webpackChunktesting"]` 里边 `push` 一个数组，数组第一项是 `["src_temp_js"]`，第二项是个对象，内容是：名为 `"./src/temp.js"`的方法。

```js
self["webpackChunktesting"].push([[], {}])
```

## 九、webpackJsonpCallback

```js
var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
  var [chunkIds, moreModules, runtime] = data;
  // add "moreModules" to the modules object,
  // then flag all "chunkIds" as loaded and fire callback
  var moduleId, chunkId, i = 0;
  if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
    for(moduleId in moreModules) {
      if(__webpack_require__.o(moreModules, moduleId)) {
        __webpack_require__.m[moduleId] = moreModules[moduleId];
      }
    }
    if(runtime) var result = runtime(__webpack_require__);
  }
  if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
  for(;i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
      installedChunks[chunkId][0]();
    }
    installedChunks[chunkId] = 0;
  }
   
}
   
var chunkLoadingGlobal = self["webpackChunktesting"] = self["webpackChunktesting"] || [];
chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
```

首先看`chunkLoadingGlobal`:

* 1、`chunkLoadingGlobal` 就是 `self` 上的 `webpackChunktesting`;
* 2、`chunkLoadingGlobal` 的 `push` 方法被重写。

再看看 `webpackJsonpCallback`:

* 1、将数据 `data` 缓存到 `__webpack_require__.m`;
* 2、将数据 `data` push 到 `chunkLoadingGlobal` 也就是 `self["webpackChunktesting"]`；
* 3、执行 promise 的 resolve 方法，（`installedChunks[chunkId][0]()`）;
* 4、将 `installedChunks[chunkId]` 置为 0，下次再加载该资源直接调用缓存中的资源。

## 十、temp.js 加载

在 `__webpack_require__.l` 中，将 script 添加到 head 标签，加载 资源，并运行；

此时会有一系列数据传递：

* 1、调用 `self["webpackChunktesting"].push([[], {}])`，也就是`webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal))`，
* 2、资源数据（temp.js）被更新到 `__webpack_require__.m` 和 `self["webpackChunktesting"]`;
* 3、执行 promise 的 resolve；
* 4、将 `installedChunks[chunkId]` 置为 0。

---

到此时 动态import 完成了**前半部分** `__webpack_require__.e("src_temp_js")`， 资源已经缓存到 `__webpack_require__.m` 和 `self["webpackChunktesting"]`;

接下来就是 `then(__webpack_require__.bind(__webpack_require__, "./src/temp.js"))`。

---

## 十一、资源获取

先看个方法 `__webpack_require__`：

```js
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {
  // Check if module is in cache
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  // Create a new module (and put it into the cache)
  var module = __webpack_module_cache__[moduleId] = {
    // no module.id needed
    // no module.loaded needed
    exports: {}
  };

  // Execute the module function
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

  // Return the exports of the module
  return module.exports;
}

// expose the modules object (__webpack_modules__)
__webpack_require__.m = __webpack_modules__;
```

`__webpack_require__`相关的几个点：

* 1、查看 `__webpack_module_cache__` 模块缓存中，是否有需要资源，有的话就直接返回资源，否则，往下走；
* 2、初始化一个 新的空的 module 对象，并存入 `__webpack_module_cache__`;
* 3、执行 `__webpack_modules__` 中存储的资源，目的是：将要导出的 对象，挂载到 `module.exports` 对象上，同时也更新到 `__webpack_module_cache__`。

:::tip
`__webpack_module_cache__` 中缓存了所有通过 `__webpack_require__` 加载的资源；

`__webpack_require__.m` 和 `__webpack_modules__` 是同一个内存地址;
:::

先看一下 then 内部的部分

```js
__webpack_require__.bind(__webpack_require__, "./src/temp.js")

// 等价于
function () {
  return __webpack_require__("./src/temp.js");
};
```

此时，返回 promise，内容为：`module.exports`

即：

```js
{
  "default": () => (__WEBPACK_DEFAULT_EXPORT__),
  "minus": () => (minus)
}
```
