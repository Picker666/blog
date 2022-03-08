# `Promise.allSettled`

`Promise.allSettled` 的作用，如何自己实现一个 `Promise.allSettled`

本文从四个方面循序渐进介绍 `Promise.allSettled` ：

- `Promise.all()` 的缺陷
- 引入 `Promise.allSettled()`
- `Promise.allSettled()` 与 `Promise.all()` 各自的适用场景
- 手写 `Promise.allSettled()` 实现

## `Promise.all()` 的缺陷

我们在之前的一篇文章中 面试官问：[Promise.all](/base/promiseAll) 使用、原理实现及错误处理 已经介绍过，当我们使用 `Promise.all()` 执行过个 `promise` 时，只要其中任何一个 `promise` 失败都会执行 `reject` ，并且 `reject` 的是第一个抛出的错误信息，只有所有的 `promise` 都 resolve 时才会调用 .then 中的成功回调

```js
const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3 = new Promise((resolve, reject) => {
  setTimeout(reject, 1000, 'three');
});

Promise.all([p1, p2, p3])
.then(values => {
    console.log('resolve: ', values)
}).catch(err => {
    console.log('reject: ', err)
}) 

// reject:  three
```

::: warning
其中任意一个 `promise` 被 `reject` ，`Promise.all` 就会立即被 `reject` ，数组中其它未执行完的 `promise` 依然是在执行的， `Promise.all` 没有采取任何措施来取消它们的执行
:::

但大多数场景中，我们期望传入的这组 `promise` 无论执行失败或成功，都能获取每个 `promise` 的执行结果，为此，`ES2020` 引入了 `Promise.allSettled()`

## `Promise.allSettled()`

`Promise.allSettled()` 可以获取数组中每个 `promise` 的结果，无论成功或失败

```js
const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3 = new Promise((resolve, reject) => {
  setTimeout(reject, 1000, 'three');
});

Promise.allSettled([p1, p2, p3])
.then(values => {
    console.log(values)
}) 

/*
[
  {status: "fulfilled", value: 1}, 
  {status: "fulfilled", value: 2}, 
  {status: "rejected", reason: "three"}
]
*/
```

当浏览器不支持 `Promise.allSettled`，可以如此 `polyfill`：

```js
if (!Promise.allSettled) {
  const rejectHandler = reason => ({status: "rejected", reason})
  const resolveHandler = value => ({status: "fulfilled", value})
  Promise.allSettled = promises =>
    Promise.all(
      promises.map((promise) =>
        Promise.resolve(promise) 
          .then(resolveHandler, rejectHandler)
      )
      // 每个 promise 需要用 Promise.resolve 包裹下
      // 以防传递非 promise
    );
}

// 使用
const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3 = new Promise((resolve, reject) => {
  setTimeout(reject, 1000, 'three');
})
const promises = [p1, p2, p3]
Promise.allSettled(promises).then(console.log)
/*
[{status: 'fulfilled', value: 1}, {status: 'fulfilled', value: 2}, {status: 'rejected', reason: 'three'}, ]

*/

```

## `Promise.allSettled()` 与 `Promise.all()` 各自的适用场景

### `Promise.allSettled()` 更适合：

- 彼此不依赖，其中任何一个被 `reject` ，对其它都没有影响
- 期望知道每个 `promise` 的执行结果

### `Promise.all()` 更适合：

- 彼此相互依赖，其中任何一个被 reject ，其它都失去了实际价值

## 手写 Promise.allSettled 源码

与 `Promise.all` 不同的是，当 `promise` 被 `reject` 之后，我们不会直接  `reject` ，而是记录下该 `reject` 的值和对应的状态 `'rejected'` ；

同样地，当 `promise` 对象被 `resolve` 时我们也不仅仅局限于记录值，同时也会记录状态 `'fulfilled'` 。

当所有的 `promise` 对象都已执行（解决或拒绝），我们统一 `resolve` 所有的 `promise` 执行结果数组

[手写 Promise.allSettled 源码](/newFunction/newPromise.html#五、promise-allsettled)

## 总结

彼此相互依赖，一个失败全部失效（全无或全有）用 `Promise.all` ；相互独立，获取每个结果用 `Promise.allSettled`
