# 写个Redux

使用 Redux 之后就会发现 Redux 几个关键的 API:

* createStore - 创建 store，并返回一些方法 getState, dispatch；
* combineReducers - 将多个Reducer聚合在一起；
* bindActionCreators - 生成可以dispatch 指定 action 的方法
* applyMiddleware - 使用中间件

## createStore

```js
function createStore(reducers, initialState, enhance) {
  // 有中间件的情况
  if (enhance) {
    return enhance(createStore)(reducers, initialState);
  }

  let state = initialState || {};
  let listeners = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    // 触发reducer
    state = reducers(state, action);

    // 触发监听逻辑 相当于 发布事件
    listeners.forEach((listener) => {
      listener();
    });

    return action;
  }

// 订阅
  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      // 移除订阅
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    }
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
}
```

## combineReducers

```js
function combineReducers(reducers) {
  const finalReducers = { ...reducers };

  return function combination(state, action) {
    let hasChanged = false;
    const newState = {};
    Object.keys(finalReducers).forEach((key) => {
      const reducer = finalReducers[key];
      const preStateForKey = state[key];
      // 执行单个reducer 并返回结果
      const nextStateForKey = reducer(preStateForKey, action);

// 结果的浅对比
      hasChanged = hasChanged || nextStateForKey !== preStateForKey;
      newState[key] = nextStateForKey;
    });
// 只有变化的时候才更新
    return hasChanged ? newState : state;
  };
}
```

## bindActionCreators

```js
function bindActionCreators(actionCreators, dispatch) {
  const boundActionCreators = {};

// 遍历 actionCreators，并为其生成 dispatcher
  Object.keys(actionCreators).forEach((actionCreator) => {
    boundActionCreators[actionCreator] = function (...rest) {
      const action = actionCreator.at.call(this, ...rest);
      dispatch(action);
    };
  });

  return boundActionCreators;
}
```

## applyMiddleware

```js
function applyMiddleware(...middlewares) {
  // 返回柯里化函数
  return (createStore) => (reducer, initialState) => {
    // 执行createStore 获取store
    const store = createStore(reducer, initialState);

    const { getState, dispatch } = store;
    const middlewareChain = middlewares.map((middleware) => middleware({ state: getState }));

    // 串行调用 中间件并返回新的dispatch，即增强dispatch
    const newDispatcher = middlewareChain.reduceRight((last, crt) => crt(last), dispatch);

    return {
      ...store,
      dispatch: newDispatcher,
    };
  };
}
```

[项目地址](https://github.com/Picker666/redux-principle)
