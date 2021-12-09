# react 中间件相关接口源码解析

## 序

在 `react` 的使用中，我们可以将数据放到 `redux`，甚至将一些数据相关的业务逻辑放到 `redux`，这样可以简化我们组件，也更方便组件抽离、封装、复用，只是 `redux` 不能很好的处理异步，当我们获取接口数据的时候，`redux` 就满足不了我们的需要。然后，中间件就出来了，使用中间件可以满足我们异步获取数据，当然也可以干其他的事；

我们都知道一个数据更新，经过`component >> action  >> dispatch >> reducers >> state >> store >> component`，这样一个过程。其实，中间件的本质就是 把异步的这种情况单独的拿出来处理，然后还是把数据经过 `redux` 处理了。也就是说做中间件的关键是先把正常的 `action` 和 异步的 `action` 区分出来，从上边的流程看也只能是 `action >> dispatch` 这一步了。

下边看看中间件相关的一些源码，从 `createStore` 开始：

## 一、createStore

```js
const createStore = (reducers, initialState, enhancer) => {
　　if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
　　　　enhancer = initialState;
    　　initialState = undefined;
   }

   if (typeof enhancer !== 'undefined') {
       if (typeof enhancer !== 'function') {
           //校验enhancer是否为函数，如果不是函数则抛出异常
           throw new Error('Expected the enhancer to be a function.')
       }
       //如果enhancer存在且为函数，那么则返回如下调用，如果enhancer为applyMiddleware，那么调用则
       //是applyMiddleware(createStore)(reducer, preloadedState)。后面讲applyMiddleware再详细讲。
       return enhancer(createStore)(reducer, preloadedState)
   }
　　....
　　// 下边就是没有中间件的时候，返回一些state的方法如：getState, dispatch...

}
```

这就是做了个区分，有中间件和没中间件的区分，有中间件返回的是中间件代码：`enhancer(createStore)(reducer, preloadedState)`，没有就直接返回一些方法；

## 二、applyMiddleware

```js
const applyMiddleware = (...middlewares) => (createStore) => (reducer, initial, enhancer) => {
    const store = createStore(reducer, initial, enhancer);
    let dispatch = store.dispatch;
    let chain = [];
    const middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action)
    };

    chain = middlewares.map(middleware => middleware(middlewareAPI));// a
    dispatch = compose(...chain)(store.dispatch); // b

    return { ...store, dispatch };
}
```

　看名字就可以知道这是应用中间件的一个方法，他是将中间件 `middlewares` 和 `store` 结合返回一个新的`store`对象,实际上是对 dispatch 的重写；

　　结合上边的 createStore 源码我们可以看到，当有中间件的时候 createStore 返回的实际上就是 applyMiddleware 的一个执行结果，从参数看是从第二层的方法开始的，那是因为，我们在执行 createStore之前，会有下面的一步操作：

```js
const enhancer = applyMiddleware(...middlewares)
const store = createStore(reducer, enhancer)
```

其实可以看到在 applyMiddleware 中利用 createState 重新生成了 store，并对 dispatch 进行了重写：先将每一个中间件都执行一次，参数是 middlewareAPI ，然后将返回的数组， 借助于 compose，以原生 dispatch 为参数执行，返回新的 dispatch，最后替换 store 里的 dispatch 并作为新的 store 返回；这个返回结果实际上就是 createStore 中，有中间件传入时的返回结果。

可能会对 dispatch 重写的过程会不太清楚，下边看看 compose 源码：

## 三、compose

```js
const compose = (...middlewares) => {
    if (middlewares.length === 0) {
        return arg => arg;
    } else {
        const last = middlewares[middlewares.length - 1];
        const reset = middlewares.slice(0, -1);
        return (args) => rest.reduceRight((composed, f) => f(composed), last(args))
    }
}
```

结合着 applyMiddleware 看这个源码会更好没理解一点。（reducerRight 方法不熟的朋友，百度一下）

当传入中间件数组的时候，返回的是一个带参数的方法， 参数就是相当于上面的 dispatch ，取出最后一个中间件执行，并最为 `reducerRight` 的 初始值，执行`reducerRight` 方法；

## 四、中间件 middleware

```js
const middleware = ({ state, dispatch}) => (next) => (action) => {
    if (typeof action === 'function') {
        return net(action);
    }
    dispatch(action);
}
```

中间件的本质：判断你要处理的情况，执行你想要执行的方法，如果是异步，我们 `action` 通常是方法，所以就执行`next`，如果不是异步执行的就是原生 `dispatch`；

中间件的第一层是在 `applyMiddleware` 中执行的（标注a处），第二层是 `applyMiddleware` 中 `compose` 中执行的（标注b处），其实 `next` 就是原生的 `dispatch` 或者已经重写的 `dispatch` （即 `middleware` 中最后一层的方法）；

## 五、没有了

到目前为止这个中间件相关的源码算是搞完了，理解这些感觉写个中间件基本上没问题，推荐看看 `redux-thunk` 源码其实很简单，和第四步的差不多；

有一个中间件的小Dome：https://github.com/wayaha/react-demos-middleware