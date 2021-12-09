# redux-thunk 源码分析

## 用法

首先，我们还是来看一下这个库的用法。redux-thunk是作为redux的 middleware 存在的，用法和普通 middleware 的用法是一样的，注册 middleware 的代码如下：

```js
import thunkMiddleware from 'redux-thunk'
const store = createStore(reducer, applyMiddleware(thunkMiddleware))
```

注册后可以这样使用：

```js
// 用于发起登录请求，并处理请求结果
// 接受参数用户名，并返回一个函数(参数为dispatch)
const login = (userName) => (dispatch) => {
  dispatch({ type: 'loginStart' })
  request.post('/api/login', { data: userName }, () => {
    dispatch({ type: 'loginSuccess', payload: userName })
  })
}
store.dispatch(login('Lucy'))
```

可以看到，`redux-thunk` 主要的功能就是可以让我们 `dispatch` 一个函数，而不只是普通的 `Object`。后面我们会看到，这一点改变可以给我们巨大的灵活性。
了解了如何使用，接下来我们看一下它的实现原理。

## 什么是 thunk？

在很长的时间里都把redux-thunk的名字看成了redux-thank，理解成了感谢 redux。。。其实我觉得这个库最令人迷惑的地方之一就是它的名字。其实thunk是函数编程届的一个专有名词，主要用于calculation delay，也就是延迟计算。
用代码演示如下：

```js
function wrapper(arg) {
  // 内部返回的函数就叫`thunk`
  return function thunk() {
    console.log('thunk running, arg: ', arg)
  }
}
// 我们通过调用wrapper来获得thunk
const thunk = wrapper('wrapper arg')

// 然后在需要的地方再去执行thunk
thunk()
```

可以看到，这种代码的模式是非常简单的，以前我们可能都写过类似这样的代码，只是不知道这种代码叫做thunk而已。

## redux-thunk 源码

由于`redux-thunk`的代码量非常少，我们直接把它的代码贴上来看一下。

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

如果，对 Redux 及它的 middleware 机制有所了解，那么上面这段代码是非常容易理解的。redux-thunk就是一个标准的 Redux middleware。
它的核心代码其实只有两行，就是判断每个经过它的action：如果是function类型，就调用这个function（并传入 dispatch 和 getState 及 extraArgument 为参数），而不是任由让它到达 reducer，因为 reducer 是个纯函数，Redux 规定到达 reducer 的 action 必须是一个 plain object 类型。
redux-thunk的原理就这么多，是不是非常简单。

## 为什么需要？

现在我们理解了redux-thunk可以让我们 dispatch 一个 function，但是这有什么用呢？其实我觉得这是一项基础设施，虽然功能简单，但可扩展性极其强大。

比如很多时候我们需要在一个函数中写多次 dispatch。这也是上面 issue 中提到的问题。比如上面我们示例代码中，我们定义了 login 函数做 API 请求，在请求发出前我们可能需要展示一个全局的 loading bar，在请求结束后我们又需要将请求结果存储到 redux store 中。这都需要用到 redux 的 dispatch。

当然在一个函数中写多个 dispatch 只是我们可以做的事情之一，既然它是一个 function，而且并不要求像 reducer 一样是 pure function，那么我们可以在其中做任意的事情，也就是有副作用(side effect)的事情。

## 总结

`redux-thunk`是一个非常小的 `library`，但我觉得理解它的概念对于我们理解 `redux` 是至关重要的。它和另一个非常流行的库`redux-saga`一样，都是在 `redux` 中做`side effect`必不可少的。
