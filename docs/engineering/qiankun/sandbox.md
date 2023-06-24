# 沙箱

## 三种沙箱的区别

* 1、SnapshotSandbox - 快照沙箱
  * 不支持 window.Proxy 的环境；
  * 要遍历window实现，性能差；
  * 只能支持单例；
* 2、LegacySandbox - 传统沙箱
  * 使用window.Proxy 实现，但是最终还是更改 window的值；
  * 只需要遍历发生变化的值，性能有所提升；
  * 支持单例；
* 3、ProxySandbox - 代理沙箱
  * 使用window.Proxy 实现；
  * 创建自己的 fakeWindow，不改变window对象上的值；
  * 支持多例；

[沙箱源码分析](/sourceAnalysis/qiankunSandbox.html)

## 沙箱隔离原理

window.a = 1 是怎么做到对 a 变量隔离的呢？

这个逻辑的实现并不在 qiankun 的源码里，而是在它所依赖的 import-html-entry 中，这里做一下简化：

```js
const executableScript = `
  ;(function(window, self, globalThis){
    ;${scriptText}${sourceUrl}
  }).bind(window.proxy)(window.proxy, window.proxy, window.proxy);
`
eval.call(window, executableScript)
```

把上面字符串代码展开来看看：

```js
function fn(window, self, globalThis) {
  // 你的 JavaScript code
}
const bindedFn = fn.bind(window.proxy);
bindedFn(window.proxy, window.proxy, window.proxy);
```

可以发现这里的代码做了三件事：

* 把要执行 JS 代码放在一个立即执行函数中，且函数入参有 window, self, globalThis;
* 给这个函数 绑定上下文 window.proxy;
* 执行这个函数，并 把上面提到的沙箱对象 window.proxy 作为入参分别传入;

因此，当我们在 JS 文件里有 window.a = 1 时，实际上会变成：

```js
function fn(window, self, globalThis) {
  window.a = 1;
}
const bindedFn = fn.bind(window.proxy);
bindedFn(window.proxy, window.proxy, window.proxy);
```

那么此时，window.a 的 window 就不是全局 window 而是 fn 的入参 window 了。又因为我们把 window.proxy 作为入参传入，所以 window.a 实际上为 window.proxy.a = 1。这也正好解释了 qiankun 的 JS 隔离逻辑。

[](https://www.jb51.net/article/264077.htm);
