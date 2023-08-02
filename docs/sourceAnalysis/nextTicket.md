# vue - $nextTicket

这是我们用的 $nextTick

```js vue2
Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this);
};

// 回调收集
function nextTick (cb, ctx) {
  callbacks.push(function () {
      if (cb) {
          try {
              cb.call(ctx);
          }
          catch (e) {
              handleError(e, ctx, 'nextTick');
          }
      }
      else if (_resolve) {
          _resolve(ctx);
      }
  });
}

// 更新
var isUsingMicroTask = false;
var callbacks = [];
var pending = false;
function flushCallbacks() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
        copies[i]();
    }
}

// 执行更新逻辑
// Promise
// MutationObserver
// setImmediate
// setTimeout
```

```js vue3
$nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy))

function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
```
