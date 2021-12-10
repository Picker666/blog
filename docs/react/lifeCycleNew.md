# React生命周期（新）

react 生命周期(新)的更新图:

![react 生命周期(新)的更新图](/images/react/2.png)

react16.4后使用了新的生命周期，使用 `getDerivedStateFromProps`代替了旧的 `componentWillReceiveProps` 及 `componentWillMount` 。使用 `getSnapshotBeforeUpdate` 代替了旧的 `componentWillUpdate` 。

## `getDerivedStateFromProps`

`getDerivedStateFromProps(nextProps, prevState)`

旧的 `React` 中 `componentWillReceiveProps` 方法是用来判断前后两个 `props` 是否相同，如果不同，则将新的 `props` 更新到相应的 `state` 上去。在这个过程中我们实际上是可以访问到当前 `props` 的，这样我们可能会对 `this.props` 做一些奇奇怪怪的操作，很可能会破坏 `state` 数据的单一数据源，导致组件状态变得不可预测。(比如根据 `props` 变化，操作一些副作用)

而在 `getDerivedStateFromProps` 中禁止了组件去访问 `this`，强制让开发者去比较 `nextProps` 与 `prevState` 中的值，以确保当开发者用到  `getDerivedStateFromProps` 这个生命周期函数时，就是在根据当前的 `props` 来更新组件的 `state` ，而不是去访问 `this.props` 并做其他一些让组件自身状态变得更加不可预测的事情。

## getSnapshotBeforeUpdate

`getSnapshotBeforeUpdate(prevProps, prevState)`

在 `React` 开启异步渲染模式后，在执行函数时读到的 `DOM` 元素状态并不总是渲染时相同，这就导致在 `componentDidUpdate` 中使用 `componentWillUpdate` 中读取到的 `DOM` 元素状态是不安全的，因为这时的值很有可能已经失效了。

而 `getSnapshotBeforeUpdate` 会在最终的 `render` 之前被调用，也就是说在 `getSnapshotBeforeUpdate` 中读取到的 `DOM` 元素状态是可以保证与 `componentDidUpdate` 中一致的。
