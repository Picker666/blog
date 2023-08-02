# useState用法汇总

## useState 常规用法

```js
const [count, setCount] = useState(0);
```

返回一个 `count`，以及更新 `count` 的函数.
在初始渲染期间，返回的状态 `count` 就是初始化的 `0`。
`setCount` 函数用于更新 `count`。它接收一个新的 `count` 值并将组件的一次重新渲染加入队列。

```js
setCount(newCount)
```

在后续的重新渲染中，useState 返回的第一个值将始终是更新后最新的  `count` 。

## 初始化

初始化的时候，可以根据条件初始化成不同的count；

```js
function Counter(props) {
  const [count, setCount] = useState(() => {
    const { morePlus } = props;
    const initialCount = morePlus ? 1 : 0;
    return initialCount;
  }));

  return (
    <>
      Count: {count}
    </>
  );
}
```

## 函数式更新

如果新的 `count` 需要通过使用先前的 `count` 计算得出，那么可以将函数传递给 `setCount`。该函数将接收先前的 `count`，并返回一个更新后的值。下面的计数器组件示例展示了 `setCount` 的两种用法：

```js
function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1)
  }
  function handleClickFn() {
    setCount((prevCount) => {
      return prevCount + 1
    })
  }
  return (
    <>
      Count: {count}
      <button onClick={handleClick}>+</button>
      <button onClick={handleClickFn}>+</button>
    </>
  );
}
```

### 两种方式的区别

注意上面的代码，`handleClick` 和 `handleClickFn` 一个是通过一个新的 `count` 值更新，一个是通过函数式更新返回新的 `count`。现在这两种写法没有任何区别，但是如果是`异步更新`的话，那你就要注意了，他们是有区别的，来看下面例子：

```js
function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setTimeout(() => {
      setCount(count + 1)
    }, 3000);
  }
  function handleClickFn() {
    setTimeout(() => {
      setCount((prevCount) => {
        return prevCount + 1
      })
    }, 3000);
  }
  return (
    <>
      Count: {count}
      <button onClick={handleClick}>+</button>
      <button onClick={handleClickFn}>+</button>
    </>
  );
}
```

当我设置为异步更新，点击按钮延迟到3s之后去调用 `setCount` 函数，当我快速点击按钮时，也就是说在3s多次去触发更新，但是只有一次生效，因为 `count` 的值是没有变化的。

当使用函数式更新 `count` 的时候，这种问题就没有了，因为它可以获取之前的 `count` 值，也就是代码中的 `prevCount` 每次都是最新的值。

其实这个特点和类组件中 `setState` 类似，可以接收一个新的 `state` 值更新，也可以函数式更新。如果新的 `state` 需要通过使用先前的 `state` 计算得出，那么就要使用函数式更新。

因为 `setState` 更新可能是异步，当你在事件绑定中操作 `state` 的时候， `setState` 更新就是异步的。

```js
class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }
  handleClick = () => {
    this.setState({ count: this.state.count + 1 })
    this.setState({ count: this.state.count + 1 })
    // 这样写只会加1
  }
  handleClickFn = () => {
    this.setState((prevState) => {
      return { count: prevState.count + 1 }
    })
    this.setState((prevState) => {
      return { count: prevState.count + 1 }
    })
  }
  render() {
    return (
      <>
        Count: {this.state.count}
        <button onClick={this.handleClick}>+</button>
        <button onClick={this.handleClickFn}>+</button>
      </>
    );
  }
}
```

当你在定时器中操作 `state` 的时候，而 `setState` 更新就是同步的。

```js
class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }
  handleClick = () => {
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 })
      this.setState({ count: this.state.count + 1 })
      // 这样写是正常的，两次setState最后是加2
    }, 3000);
  }
  handleClickFn = () => {
    this.setState((prevState) => {
      return { count: prevState.count + 1 }
    })
    this.setState((prevState) => {
      return { count: prevState.count + 1 }
    })
  }
  render() {
    return (
      <>
        Count: {this.state.count}
        <button onClick={this.handleClick}>+</button>
        <button onClick={this.handleClickFn}>+</button>
      </>
    );
  }
}
```

注意这里的同步和异步指的是 `setState` 函数。因为涉及到 `state` 的状态合并，react 认为当你在事件绑定中操作 `state` 是非常频繁的，所以为了节约性能 react 会把多次 `setState` 进行合并为一次，最后在一次性的更新 `state`，而定时器里面操作 `state` 是不会把多次合并为一次更新的。

::: warning
对于 `setState` 可以认为:

* 只有一个参数，是一个回调函数，参数是 `preState`, 并且返回新对象, 是同步；
* 在定时器/原生事件中的操作是同步的；
* 其他的都是异步；

对于 `useState` 中更新状态的方法，如： `setCount`:

* 只有一个参数，是一个回调函数，参数是 `preCount`, 并且返回新对象, 是同步；
* 其他的情况都是异步。
  
与 class 组件中的 `setState` 方法相同，当同时有多个set操作（不同的set方法）时，`useState` 会自动合并更新对象。（都可以生效）

当同时有多个set操作（相同的set方法）时，只有最后一个生效
:::

## 性能优化

::: warning
React 使用 `Object.is` 比较算法来比较 `state`。
:::

在 React 应用中，当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树。

```js
function Child({ onButtonClick, data }) {
  console.log('Child Render')
  return (
    <button onClick={onButtonClick}>{data.number}</button>
  )
}

function App() {
  const [number, setNumber] = useState(0)
  const [name, setName] = useState('hello') // 表单的值
  const addClick = () => setNumber(number + 1)
  const data = { number }
  return (
    <div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <Child onButtonClick={addClick} data={data} />
    </div>
  )
}
```

如要避免不必要的子组件的重渲染，使用 `React.memo` 仅检查 `props` 变更。 默认情况下其只会对复杂对象做浅层对比。所有使用 `memo` 优化后的代码如下：

```js
function Child({ onButtonClick, data }) {
  console.log('Child Render')
  return (
    <button onClick={onButtonClick}>{data.number}</button>
  )
}
Child = memo(Child); // 在这里优化了
function App() {
  const [number, setNumber] = useState(0)
  const [name, setName] = useState('hello') // 表单的值
  const addClick = () => setNumber(number + 1)
  const data = { number }
  return (
    <div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <Child onButtonClick={addClick} data={data} />
    </div>
  )
}
```

你以为代码中的 `Child = memo(Child);` 已经优化了吗，然而并没有，当你在更改了父组件的状态，子组件依然会重新渲染，因为这关系到了React是如何浅层比较的，在子组件中 `onButtonClick` 和 `data` 都是引用类型，所以他们是始终都不相等的，也就是 `[]===[]` 这样比较时始终返回 `false`，在基本数据类型比较时 `memo` 才会起作用。

关于如何解决这个问题，我们就要使用两个新的API，[useMemo](/library/react/useMemo/) 和 [useCallback](/library/react/useCallback/) 的Hook。下面是经过优化之后的代码。

```js
function Child({ onButtonClick, data }) {
  console.log('Child Render')
  return (
    <button onClick={onButtonClick}>{data.number}</button>
  )
}

Child = memo(Child)

function App() {
  const [number, setNumber] = useState(0)
  const [name, setName] = useState('hello') // 表单的值
  const addClick = useCallback(() => setNumber(number + 1), [number])
  const data = useMemo(() => ({ number }), [number])
  return (
    <div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <Child onButtonClick={addClick} data={data} />
    </div>
  )
}

export default App;
```

把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 `memoized` 值。这种优化有助于避免在每次渲染时都进行高开销的计算。如果没有提供依赖项数组， `useMemo` 在每次渲染时都会计算新的值。

`useCallback` 返回一个 `memoized` 回调函数。`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

`useCallback` 和 `useMemo` 参数相同，第一个参数是函数，第二个参数是依赖项的数组。主要区别是 `React.useMemo` 将调用 fn 函数并返回其结果，而 `React.useCallback` 将返回 `fn` 函数而不调用它。
