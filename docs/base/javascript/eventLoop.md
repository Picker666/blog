# Event Loop

## Event loop 介绍

浏览器端 javascript 执行流，类似的在 Nodejs 中，都是基于 Event loop。

首先 javascript 的运行环境是 V8 引擎，memory allocation 负责内存分配、stack 为 js 的执行栈，负责记录当前程序所在的位置和代码执行，js 为单线程语言，每次只能运行一段代码。如下：

![js 代码运行结构](/blog/images/base/eventLoop1.png)

js 的执行栈，在执行某段代码时，将其入栈，执行完毕后将其出栈，类似下面这样：

![js 代码运行过程](/blog/images/base/eventLoop2.awebp)

当开始执行 JS 代码时，首先会执行一个 main 函数，然后执行我们的代码。根据**先进后出**的原则，后执行的函数会先弹出栈，在图中我们也可以发现，foo 函数后执行，当执行完毕后就从栈中弹出了。

平时在开发中，大家也可以在报错中找到执行栈的痕迹

```js
function foo() {
  throw new Error('error')
}
function bar() {
  foo()
}
bar()
```

![js 代码运行过程报错](/blog/images/base/eventLoop3.awebp)

大家可以在上图清晰的看到报错在 foo 函数，foo 函数又是在 bar 函数中调用的。

当我们使用递归的时候，因为栈可存放的函数是有限制的，一旦存放了过多的函数且没有得到释放的话，就会出现爆栈的问题

```js
function bar() {
  bar()
}
bar()
```

![js 代码运行过程报错-爆栈](/blog/images/base/eventLoop4.awebp)

## 浏览器中的 Event Loop

上一小节我们讲到了什么是执行栈，大家也知道了当我们执行 JS 代码的时候其实就是往执行栈中放入函数，那么遇到异步代码的时候该怎么办？

其实当遇到异步的代码时，会被挂起并在需要执行的时候加入到 callback queue中。一旦执行栈为空，Event Loop 就会从 callback queue中拿出需要执行的代码并放入执行栈中执行，

所以本质上来说 JS 中的异步还是同步行为。

![js 代码运行过程报错-爆栈](/blog/images/base/eventLoop5.awebp)

## macrotask（宏任务）

上文说到的 callback queue 中包含了调用 WebAPIs 时注册的各种 callback，通常是指下面这些 callback。

* 各种 dom **监听事件**注册的 callback
* **定时器**注册的 callback
* `XMLHttpRequest（ajax）`注册的 callback
* `requestAnimationFrame` 注册的 callback
* `postMessage` 注册的 callback
* 通过 I/O 进行文件读取时注册的 callback （Node 中独有）
* `setImmediate` 中注册的 callback（Node 中独有）

通过上面列出来的这些 WebAPIs 注册的 callback，也通常被称为 **macrotasks（宏任务）**。会被放到 macrotasks queue（宏任务队列）中，对应上文图中的 callback queue，下文也称 task queue。

V8 的 stack 加上 macrotasks queue，它的执行过程有一个特别重要的点，只有当 stack 为空后，才会去取 macrotasks queue 中的下一个 macrotask，并将其推入 stack 执行，同样的，当下一个 macrotask 执行完， stack 正好也变成空，就去 macrotasks queue 取下一个 macrotask,。并将其推入 stack 执行。

可以看到因为 macrotasks queue 的存在，使得 macrotask 会被排队执行，当然为什么会使用这个 macrotasks queue 下文会提到。但是有一点需要注意，macrotask 不会保证立马被执行，它会被放到 macrotasks queue 中去排队，并等待执行。

## microtask（微任务）

现在来引入一个 microtask（微任务）的概念。微任务也是一个 callback，也会存在对应的 microtasks queue（微任务队列）。通常由以下 API 产生。

* .then
* .catch
* .finally
* MutationObersve
* async/await

```js
new Promise((resolve, reject) => {
 resolve() // 会将第一个 .then 注册的回调放入 microtasks queue
 或者
 reject() // 会将第一个 .catch 注册的回调放入 microtasks queue
}).then(() => {
}).then(() => {// 只有前面的 .then 注册的回调执行完毕后，这个 callback 才会被放入到 microtasks queue 中去。
}).catch(() => {
})
```

* process.nextTick （Node 中独有）

## javascript 执行流

V8 的 stack 加上 macrotasks queue 、 microtasks queue，再来更新一下对 javascript 执行流的认知:

* 1、将 `<script>....</script>` （一般 script 中代码也被称为 macrotask）中的代码**依次**推入 stack 并执行，过程中可能会产生 macrotask、microtask。执行完毕，栈变为空。
* 2、stack 为空时，event loop 首先会检查 microtasks queue，将它们**依次**推入 stack 并执行，将其中的任务清空，包括**中途执行时产生**的新的 microtask，直到 microtasks queue 为空。
* 3、将 macrotasks queue 中的下一个 callback 推入 stack 中并执行。执行完毕后 stack 又变为空。
* 4、重复上面的 2 ~ 3 步骤
* 5、如果 microtasks queue、macrotasks queue都为空时， event loop 会继续循环**等待**，等待的过程中消耗的CPU接近于零。

如果想直接往 microtasks queue 中推入一个 microtask。可以使用`queueMicrotask(f)`。

Async Await 也是通过添加 microtask 来进行流程控制，有兴趣可以研究一下经过 babel 编译后的 Async 函数的执行流程。

## 栗子

```js
console.log('start')
setTimeout(() => {
    console.log('setTimeout1')
}, 0)
new Promise((resolve, reject) => {
    console.log('new Promise')
    setTimeout(resolve, 0)
}).then(() => {
    console.log('.then1')
    setTimeout(() => {
        console.log('setTimeout2')
    })
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 0)
    })
}).then(() => {
    console.log('.then2')
    queueMicrotask(() => {
        console.log('queueMicrotask')
    })
}).then(() => {
    console.log('.then3')
})

// start
// new Promise
// setTimeout1
// .then1
// setTimeout2
// .then2
// queueMicrotask
// .then3

```

:::warning

* 1.每执行完一个宏任务后 都会将微任务清空 然后再从宏任务队列中取出第一个宏任务执行；
* 2.宏任务是到时间了才会放在宏任务队列；
* 3.微任务是立刻放入到微任务队列中的。
:::

```js
console.log('1');
 
setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})
 
setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})

// 1768 2435 9 11 10 12

console.log('1');
 
setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
}, 1000)
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})
 
setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
// 1768 9 11 10 12 2435 
```

[参考](https://blog.csdn.net/qq_33207292/article/details/102624553)

## 为什么

**为什么会有 macrotask 和 microtask 及其对应的任务队列**？

javascript 是单线程，它与 GUI 渲染线程是**互斥**的，也就是 **js 执行时不能渲染，渲染时不能执行 js**。负责执行 javascript 的 V8 引擎 如果一直在执行 javascript 代码，那么会导致页面卡顿。

## javascript 执行流 + render

现在我们有 V8 的 stack、macrotasks queue、microtasks queue、**render**。再次更新一下对javascript 执行流的认知。

* 1、将 `<script>....</script>` （一般 script 中代码也被称为 macrotask，在页面加载的时候执行）中的代码依次推入 stack 并依次执行，过程中可能会产生 macrotask、microtask。执行完毕，栈变为空。
* 2、stack 为空时，event loop 首先会检查 microtasks queue，将它们依次推入 stack 并执行，将其中的任务清空，包括清空过程中产生的新的 microtask，直到 microtasks queue 为空。
* 3、`render`
* 4、将 macrotasks queue 中的下一个 callback 推入 stack 中并执行。执行完毕后 stack 又变为空。
* 5、重复上面的 2 ~ 4 步骤 （所以顺序为 macrotask -> microtask -> render）

::: tip 注意
stack 的执行**不可打断**，所以如果执行耗时较长的同步代码，会导致浏览器 render 阻塞，但是可以将代码分解成多个 macrotask 或者 microtask，macrotask 和 microtask 执行完毕后，浏览器就会去 render，然后如此循环。

但是需要注意的是，在清空 microtasks queue 的时候，如果执行时间过长，也会导致无法走到 render 阶段。
:::

## 延申

React 16 之后引入了一个新的概念 concurrentMode，并通过引入 Filber 将之前的递归式遍历替换为可打断的链表遍历，它能利用宏任务（React 中使用的是 postMessage、requestAnimationFrame）来分解渲染任务，也使之前的递归式不可打断的渲染流程变成可打断，在必要的时候，阻塞 js 的执行，将渲染权利交给浏览器，是浏览器可以继续渲染，大幅度减少了卡顿的情况。

## 题

```js
const first = () => (new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
        console.log(7);
        setTimeout(() => {
            console.log(1);
        }, 0);
        setTimeout(() => {
            console.log(2);
            resolve(3);
        }, 0)
        resolve(4);
    });
    resolve(2);
    p.then((arg) => {
        console.log(arg, 5); // 1 bb
    });
    setTimeout(() => {
        console.log(6);
    }, 0);
}))
first().then((arg) => {
    console.log(arg, 7); // 2 aa
    setTimeout(() => {
        console.log(8);
    }, 0);
});
setTimeout(() => {
    console.log(9);
}, 0);
console.log(10);

// 3
// 4 7
// 31 10
// 16 4 5
// 23 2 7
// undefined
// 6 1
// 9 2
// 19 6
// 29 9
// 25 8

```
