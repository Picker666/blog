# setState

## 1、setState 是同步还是异步

回答是执行过程代码同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”，所以表现出来有时是同步，有时是“异步”。

## 2、何时是同步，何时是异步

只在合成事件和钩子函数中是“异步”的，在原生事件和 setTimeout/setInterval等原生 API 中都是同步的。简单的可以理解为被 React 控制的函数里面就会表现出“异步”，反之表现为同步。

## 3、那为什么会出现异步的情况

为了做性能优化，将 state 的更新延缓到最后批量合并再去渲染对于应用的性能优化是有极大好处的，如果每次的状态改变都去重新渲染真实 dom，那么它将带来巨大的性能消耗。

## 4、异步的函数里准确拿到更新后的 state

* 通过第二个参数 setState(partialState, callback) 中的 callback 拿到更新后的结果。
* 或者可以通过给 setState 传递函数来表现出同步的情况：

```js
this.setState((state) => {
    return { val: newVal }
})
```

## 5、原理详解

首先抛第一个结论：

在`legacy`模式中，更新可能为同步，也可能为异步；
在`concurrent`模式中，一定是异步。

### 问题一、legacy 模式和 concurrent 模式是什么鬼？

通过 `ReactDOM.render(<App />, rootNode)` 方式创建应用，则为 `legacy` 模式，这也是 `create-react-app`目前采用的默认模式；

通过`ReactDOM.unstable_createRoot(rootNode).render(<App />)`方式创建的应用，则为`concurrent`模式，这个模式目前只是一个实验阶段的产物，还不成熟。

### legacy 模式下可能同步，也可能异步

是的，这不是玄学，我们来先抛出结论，再来逐步解释它。

* 1、当直接调用时 this.setState 时，为异步更新；
* 2、当在异步函数的回调中调用 this.setState，则为同步更新；
* 3、当放在自定义 DOM 事件的处理函数中时，也是同步更新。

实验代码如下：

```jsx
class StateDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 0
        }
    }
    render() {
        return <div>
            <p>{this.state.count}</p>
            <button onClick={this.increase}>累加</button>
        </div>
    }
    increase = () => {
        this.setState({
            count: this.state.count + 1
        })
        // 异步的，拿不到最新值
        console.log('count', this.state.count)

        // setTimeout 中 setState 是同步的
        setTimeout(() => {
            this.setState({
                count: this.state.count + 1
            })
            // 同步的，可以拿到
            console.log('count in setTimeout', this.state.count)
        }, 0)
    }

    bodyClickHandler = () => {
        this.setState({
            count: this.state.count + 1
        })
        // 可以取到最新值
        console.log('count in body event', this.state.count)
    }

    componentDidMount() {
        // 自己定义的 DOM 事件，setState 是同步的
        document.body.addEventListener('click', this.bodyClickHandler)
    }
    componentWillUnmount() {
        // 及时销毁自定义 DOM 事件
        document.body.removeEventListener('click', this.bodyClickHandler)
    }
}
```

要解答上述现象，就必须了解 setState 的主流程，以及 react 中的 `batchUpdate` 机制。

## `batchUpdate` 机制

### setState 的主流程

首先我们来看看 ：

* 1、调用 `this.setState(newState)`；
* 2、`newState` 会存入 pending 队列；
* 3，判断是不是 `batchUpdate`, 那么就遍历所有的脏组件，并更新它们；
* 4，如果是 `batchUpdate`，则将组件先保存在所谓的脏组件`dirtyComponents`中；

由此我们可以判定：**所谓的异步更新，都命中了`batchUpdate`，先保存在脏组件中就完事；而同步更新，总是会去更新所有的脏组件**。

非常有意思，看来是否命中`batchUpdate`是关键。问题也随之而来了，为啥直接调用就能命中`batchUpdate`，而放在异步回调里或者自定义 DOM 事件中就命中不了呢？

### react 中函数的调用模式

这就涉及到一个很有意思的知识点：react 中函数的调用模式。对于刚刚的 increase 函数，还有一些我们看不到的东西，现在我们通过魔法让其显现出来：

```js
increase = () => {
    // 开始：默认处于bashUpdate
    // isBatchingUpdates = true
    this.setState({
        count: this.state.count + 1
    })
    console.log('count', this.state.count)
    // 结束
    // isBatchingUpdates = false

}
increase = () => {
    // 开始：默认处于bashUpdate
    // isBatchingUpdates = true
    setTimeout(() => {
        // 此时isBatchingUpdates已经设置为了false
        this.setState({
            count: this.state.count + 1
        })
        console.log('count in setTimeout', this.state.count)
    }, 0)
    // 结束
    // isBatchingUpdates = false
}
```

当 react 执行我们所书写的函数时，会默认在首位设置`isBatchingUpdates`变量。看到其中的差异了吗？

当 setTimeout 执行其回调时，`isBatchingUpdates`早已经在同步代码的末尾被置为 `false` 了，所以没命中`batchUpdate`。

那自定义 DOM 事件又是怎么回事？代码依然如下：

```js
componentDidMount() {
  // 开始：默认处于bashUpdate
  // isBatchingUpdates = true
  document.body.addEventListener("click", () => {
    // 在回调函数里面，当点击事件触发的时候，isBatchingUpdates早就已经设为false了
    this.setState({
      count: this.state.count + 1,
    });
    console.log("count in body event", this.state.count); // 可以取到最新值。
  });
  // 结束
  // isBatchingUpdates = false
}
```

我们可以看到，当 `componentDidMount`跑完时，`isBatchingUpdates`已经设置为`false`了，

而点击事件后来触发，并调用回调函数时，取得的`isBatchingUpdates`当然也是false，不会命中`batchUpdate`机制。

### 什么时候更新

[源码解析](https://zhuanlan.zhihu.com/p/35801438?utm_source=wechat_session)

两个关键事务

* 1、批量更新策略的事务 `ReactDefaultBatchingStrategy`
* 2、执行批量更新的的事务，`ReactDefaultBatchingStrategyTransaction`

* 在react的生命周期或者react 合成事件中
  * 在生命周期或者react 合成事件 之前先执行`ReactDefaultBatchingStrategy.batchedUpdates`，将`ReactDefaultBatchingStrategy.isBatchingUpdates` 设置成 true，也就是**开启**了批量更新；
  * 接下来的 setState， newState 都会被放到更新队列，此时检测到 ReactDefaultBatchingStrategy.isBatchingUpdates` 为true, 把当前的组件标记为 `dirtyComponent` 存到 `dirtyComponents` 数组中，并没有立即更新，只是存储。

* 原生事件和 setTimeout/setInterval中
  * 此时，批量更新已结束，`ReactDefaultBatchingStrategy.isBatchingUpdates` 为false；
  * setState newState 都会被放到更新队列，因为`ReactDefaultBatchingStrategy.isBatchingUpdates` 为false，直接执行 `batchingStrategy.batchedUpdates(enqueueUpdate, component)`;
  * 在 `batchedUpdates` 再次验证 `ReactDefaultBatchingStrategy.isBatchingUpdates` 为false，执行 `transaction.perform(callback, null, a, b, c, d, e) `，启动事务，将callback (enqueueUpdate) 放到事务里执行。（ReactDefaultBatchingStrategy.isBatchingUpdates 会被设为 true;）
  
* 然后，在ReactDefaultBatchingStrategy 的事务结束的生命周期，将`ReactDefaultBatchingStrategy.isBatchingUpdates` 设为false;
* 批量更新是在ReactDefaultBatchingStrategyTransaction事务的close阶段, 在flushBatchedUpdates函数中启动了ReactUpdatesFlushTransaction事务负责批量更新。
* flushBatchedUpdates启动了一个更新事务, 这个事务执行了runBatchedUpdates，遍历 dirtyComponents，进行批量更新。
* 接着，递归调用实例的 `updateComponent`，调用实例的生命周期，新旧虚拟dom对比。

## 总结

* `this.setState`是同步还是异步，关键就是看能否命中`batchUpdate`机制；
* 能不能命中，就是看`isBatchingUpdates`是true还是false能命中；
* batchUpdate的场景包括：
  * 生命周期和其调用函数、React中注册的事件和其调用函数。总之，是React可以“管理”的入口，关键是“入口”。

::: warning 注意一点
React去加isBatchingUpdate的行为不是针对“函数”，而是针对“入口”。比如setTimeout、setInterval、自定义DOM事件的回调等，这些都是React“管不到”的入口，所以不会去其首尾设置isBatchingUpdates变量
:::
