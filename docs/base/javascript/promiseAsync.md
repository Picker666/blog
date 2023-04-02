---
sidebarDepth: 3
---
# promise和async/await的区别

## 是什么

Promise是ES6中的一个内置对象，实际是一个构造函数，是JS中进行异步编程的新的解决方案。

* 通常用来解决异步调用问题；
* 解决多层回调嵌套的方案；
* 提高代码可读性、更便于维护。

async function 用来定义一个返回 AsyncFunction 对象的异步函数。异步函数是指通过事件循环异步执行的函数，它会通过一个隐式的 Promise 返回其结果，。如果你在代码中使用了异步函数，就会发现它的语法和结构会更像是标准的同步函数。

await 操作符用于等待一个 Promise 对象。它只能在异步函数 async function 中使用。

* async/await是ES7新特性；
* async/await是写异步代码的新方式，以前的方法有回调函数和Promise；
* async/await是基于Promise实现的，它不能用于普通的回调函数；
* async/await与Promise一样，是非阻塞的；
* async/await使得异步代码看起来像同步代码，这正是它的魔力所在。

## 区别

### 1、简洁的代码

使用async函数可以让代码简洁很多，不需要像Promise一样需要些then，不需要写匿名函数处理Promise的resolve值，也不需要定义多余的data变量，还避免了嵌套代码。

### 2、错误处理

Promise 中不能自定义使用 try/catch 进行错误捕获，但是在 Async/await 中可以像处理同步代码处理错误。

```js
//#Promise
const makeRequest = () => {
  try {
    getJSON()
      .then(result => {
        // this parse may fail
        const data = JSON.parse(result)
        console.log(data)
      })
      // uncomment this block to handle asynchronous errors
      // .catch((err) => {
      //   console.log(err)
      // })
  } catch (err) {
    console.log(err)
  }
}
//#Async/await
const makeRequest = async () => {
  try {
    // this parse may fail
    const data = JSON.parse(await getJSON())
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}
```

### 3、条件语句

条件语句也和错误捕获是一样的，在 Async 中也可以像平时一般使用条件语句

```js
//#Promise
const makeRequest = () => {
  return getJSON()
    .then(data => {
      if (data.needsAnotherRequest) {
        return makeAnotherRequest(data)
          .then(moreData => {
            console.log(moreData)
            return moreData
          })
      } else {
        console.log(data)
        return data
      }
    })
}

//#Async
const makeRequest = async () => {
  const data = await getJSON()
  if (data.needsAnotherRequest) {
    const moreData = await makeAnotherRequest(data);
    console.log(moreData)
    return moreData
  } else {
    console.log(data)
    return data    
  }
}
```

### 4、中间值

在一些场景中，也许需要 promise1 去触发 promise2 再去触发 promise3，这个时候代码应该是这样的

```js
const makeRequest = () => {
  return promise1()
    .then(value1 => {
      // do something
      return promise2(value1)
        .then(value2 => {
          // do something          
          return promise3(value1, value2)
        })
    })
}
```

如过 promise3 不需要 value1，嵌套将会变得简单。如果你有强迫症，则将值1&2使用 promise.all() 分装起来。

```js
const makeRequest = () => {
  return promise1()
    .then(value1 => {
      // do something
      return Promise.all([value1, promise2(value1)])
    })
    .then(([value1, value2]) => {
      // do something          
      return promise3(value1, value2)
    })
}
```

但是使用 Async 就会变得很简单

```js
const makeRequest = async () => {
  const value1 = await promise1()
  const value2 = await promise2(value1)
  return promise3(value1, value2)
}
```

### 5、错误栈

如过 Promise 连续调用，对于错误的处理是很麻烦的。你无法知道错误出在哪里。

```js
const makeRequest = () => {
  return callAPromise()
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => {
      throw new Error("oops");
    })
}

makeRequest()
  .catch(err => {
    console.log(err);
    // output
    // Error: oops at callAPromise.then.then.then.then.then (index.js:8:13)
  })
```

但是对于 Async 就不一样了

```js
const makeRequest = async () => {
  await callAPromise()
  await callAPromise()
  await callAPromise()
  await callAPromise()
  await callAPromise()
  throw new Error("oops");
}

makeRequest()
  .catch(err => {
    console.log(err);
    // output
    // Error: oops at makeRequest (index.js:7:9)
  })
```

### 6、调试

async/await能够使得代码调试更简单。2个理由使得调试Promise变得非常痛苦:

* 不能在返回表达式的箭头函数中设置断点
* 如果你在.then代码块中设置断点，使用Step Over快捷键，调试器不会跳到下一个.then，因为它只会跳过异步代码。

使用await/async时，你不再需要那么多箭头函数，这样你就可以像调试同步代码一样跳过await语句。
