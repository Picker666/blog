# 异常捕获

## 1、错误类型

### 1、常规运行时错误

```js
let a;
console.log(a.length); // TypeError: Cannot read properties of undefined (reading 'length')
```

### 2、语法错误

```js
const a; // The constant "b" must be initialized 
```

这种错误在代码编译阶段就会出问题。

### 3、异步中的错误

```js
setTimeout(() => {
  let a;
  console.log(a.length)
}, 1000);
```

### 4、资源加载错误

```js
<script src='https://www.testing.com/react'></script>
<img src="https://www.testing.com/picker.png" />
```

资源加载不到时的报错。

### 5、promise 的报错

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(99);
  }, 1000);
}).then((val) => {
  console.log('val: ', val);
});
```

### 6、async/await中的错误

```js
const val = await (async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(99);
    }, 1000);
  });
})();
```

:::warning 特别注意

* 1、Promise 的 reject 错误在没有被 reject 回调或者 catch 捕获到的时候才能被 `unhandledrejection` 事件捕获;
* 2、Promise 中错误不能通过 `try...catch` 的方式捕获;
* 3、async/await 中的错误 通过 `try...catch` 的方式捕获， 也可以通过 `unhandledrejection` 事件捕获。

:::

## 2、捕获异常的方式 - try/catch

* 1、常规运行时的错误；
* 2、async/await 中的异常（未被处理过）;
* 3、async/await 中的 reject（未被处理过）。

## 3、捕获异常的方式 - window.onerror

```js
window.onerror = (message, source, lineno, colno, error) => {
  console.log('message, source, lineno, colno, error: ', message, source, lineno, colno, error);
};
```

* 1、常规运行时的错误；
* 2、异步错误（宏任务 - setTimeout、setInterval）;

## 4、捕获异常的方式 - error 事件

```js
const handleError = (error) => {
  console.log('=======error: ', error);
};
window.addEventListener('error', handleError, true);
```

* 1、常规运行时的错误；
* 2、资源错误；
* 3、异步错误（宏任务 - setTimeout、setInterval）;

## 5、捕获异常的方式 - unhandledrejection 事件

```js
 const handleUnhandledrejection = (event) => {
    console.log('error=======: ', event);
    // event.preventDefault();
  };
window.addEventListener('unhandledrejection', handleUnhandledrejection);
```

前提是：未被reject回调或者catch接收；

* 1、Promise 中的异常;
* 2、Promise 中的 reject；
* 3、async/await 中的异常;
* 4、async/await 中的 reject。

## 6、总结

||常规运行时错误|异步错误|资源加载错误|Promise中的异常/reject|async/await中的异常/reject|
|----------------------|----------|----------|----------|----------|----------|
|try/catch|√|-|-|-|√|
|window.onerror|√|√|-|-|-|
|error事件|√|√|√|-|-|
|unhandledrejection 事件|-|-|-|√|√|

## 7、vue - errorCaptured 生命周期期

该生命周期会监听所有下级组件的错误，可以返回false阻止向上传播，可能会有多个上级节点都在监听错误。

```js
errorCaptured(error, instance, info) {
  console.log('error, instance, info: ', error, instance, info);
}
```

## 8、vue - errorHandler

全局的错误监听，所有的组件的报错都会汇总到这里。 errorCaptured 返回false 则不会。

```js
const app = createApp(App);
app.config.errorHandler = (error, instance, info) {
  console.log('error, instance, info: ', error, instance, info);
};
```

::: warning

errorhandler 会阻止错误走向 window.onerror。
:::

## 9、react - ErrorBoundary

React 16+ 引入，可以监听所有下级组件的报错，同时降级展示UI。

```js
ReactDom.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
```
