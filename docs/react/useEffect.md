# useEffect用法汇总

::: tip
下面将通过与类组件生命周期对比的方式说明`useEffect()`。
:::

## 用法

`useEffect()` 本身是一个函数，由 React 框架提供，在函数组件内部调用即可。

可以认为`useEffect`的作用是替代类组件中的一些声明周期（`componentDidMount`, `componentWillUnmount`, `componentWillUpdate`, `componentDidUpdate`）

我们希望组件加载以后，网页标题`document.title`会随之改变。那么，改变网页标题这个操作，就是组件的副效应，必须通过`useEffect()`来实现。

### React hook两大守则

* 只能在外层`scope`使用
* 只能在 `function component` 或 `custom hook` 中使用。

### useEffect基本語法

useEffect接收两个参数，第一个是一个函式，定义 `componentDidMount` 或 `componentDidUpdate` 要做什么事，此函式的返回值要是一个函式，表示 `componentWillUnmount` 或者 `componentWillUpdate` 要做什么事。第二个是一个 `array`，数组对应的变量被修改是，`useEffect` 要重新被触发。这个类组件的`componentDidUpdate`和`prevState!=this.state`类似。

## `useEffect` 第二个参数为 `[]` 空数组

第二个参数为 `[]` 空数组(不是省略)，代表除了第一次以外，接下来每次re-render，都不会执行useEffect，所以就等同于componentDidMount。

此时，第一个参数的 `return` 方法，
会在组件销毁的时候执行，相当于类组件的 `componentWillUnmount`。

```js
useEffect(() => {
    /* 下面是 componentDidMount */
    
    /* 上面是 componentDidMount */

    return (() => {
      /* 下面是 componentWillUnmount */
      
      /* 上面是 componentWillUnmount */
    });
}, []);
```

## `useEffect`第二个参数为**非空数组**

此时，
第一次`render`会执行`effect`  -- `componentDidMount`
每次依赖项 `dependencies` 发生改变的时候也会执行`effect` -- `componentDidUpdate`

第一个参数的 `return` 方法
会在组件`re-render`前执行，相当于类组件的 `componentWillUpdate`；
会在组件销毁的时候执行， 相当于类组件的 `componentWillUnmount`.

```js
useEffect(() => {
    /* 下面是 componentDidMount 和  componentDidUpdate */
    
    /* 上面是 componentDidMount 和  componentDidUpdate */
    
    return () => {
      /* 下面是 componentWillUnmount */
      
      /* 上面是 componentWillUnmount */
    };
}, [dependencies]);
```

## `useEffect` 省略第二个参数

此时，
第一次`render`会执行`effect`  -- `componentDidMount`
每次 `render` 的时候也会执行`effect` -- `componentDidUpdate`

第一个参数的 `return` 方法，
会在组件`re-render`前执行，相当于类组件的 `componentWillUpdate`；
会在组件销毁的时候执行， 相当于类组件的 `componentWillUnmount`。

::: warning
不建议这么使用，由于每次 `render` 都会触发 `useEffect`.
:::

## useEffect的其他

可以有多个 `useEffect`存在同一`function component`和`custom hook`中，所以我们可以针对不同的情况去使用不同的`useEffect`。

## 表格总结

| `useEffect` 第二个参数 | `useEffect`第一个参数 | `useEffect`第一个参数的`return`参数 |
| -------------------- | :------------------: | :------------------------------: |
|         `[]`         |  `componentDidMount` |      `componentWillUnmount`      |
|   `[dependencies]`   | **`componentDidMount`** 和 `dependencies` 触发的 `componentDidUpdate`  | `dependencies` 触发的 `componentWillUpdate` 和 `componentWillUnmount`|
|     `undefined`      | **`componentDidMount`** 和 所有更新触发的 `componentDidUpdate`  | 所有更新触发的 `componentWillUpdate` 和 `componentWillUnmount`|
