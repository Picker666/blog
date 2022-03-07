# useRef 用法汇总

::: tip
本文例子代码：<https://github.com/Picker666/blog-example>

路径： /src/component/react/ReactUseRef.tsx
:::
## useRef 用法

首先, 我们要实现一个需求 -- 点击 button 的时候 input 设置焦点. 

### createRef API

```ts
const FocusInput = () => {
  const inputElement = createRef();

  const handleFocusInput = () => {
    inputElement.current.focus();
  };

  return (
    <>
      <input type="text" ref={inputElement} />
      <button onClick={handleFocusInput}>Focus Input</button>
    </>
  );
};
```

同样的, 我们可以使用 useRef 来实现完全相同的结果.

### useRef Hook

```ts
const FocusInputHook = () => {
  const inputElement = useRef();

  const handleFocusInput = () => {
    inputElement.current.focus();
  };

  return (
    <>
      <input type="text" ref={inputElement} />
      <button onClick={handleFocusInput}>Focus Input Hook</button>
    </>
  );
};
```

从上面的例子看,  createRef 和 useRef 的作用完全一样, 那为什么 react 要设计一个新的 hook ? 难道只是会了加上 use , 统一 hook 规范么?

## createRef 与 useRef 的区别

事实上, 只要你认真读一下官方文档, 就会发现, 它们两个确实不一样.

官网的定义如下:

::: tip
useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue). The returned object will persist for the full lifetime of the component.
:::

换句人话说：

* useRef 在 react hook 中的作用, 正如官网说的, 它像一个变量, 类似于 this , 它就像一个盒子, 你可以存放任何东西。
* createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用。

来个例子

```ts

仔细看上面的代码. 它会输出什么 ? 

就算组件重新渲染,  由于 refFromUseRef 的值一直存在(类似于 this ) , 无法重新赋值.  运行结果如下: 

```ts
Current render index: 1
refFromUseRef value: 1
refFromCreateRef value: 1
```

如果点击一下按钮结果如下：

```ts
Current render index: 2
refFromUseRef value: 1
refFromCreateRef value: 2
```

## 何时使用 useRef

```ts
const App = () => {
  const [count, setCount] = useState(0);
  const handleAlertClick = () => {
    setTimeout(() => {
      alert("you click on:" + count);
    }, 3000);
  };

  return (
    <div>
      <p>{count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={handleAlertClick}>Show alert</button>
    </div>
  );
};
```

如果先点击 `Show alert` 按钮，然后快速点击 `Click me` 按钮, alert出来的数据是几？

0

* 为什么不是界面上 count 的实时状态?

当我们更新状态的时候, React 会重新渲染组件, 每一次渲染都会拿到独立的 count 状态,  并重新渲染一个  handleAlertClick  函数.  每一个 handleAlertClick 里面都有它自己的 count 。

* 如何让点击的时候弹出实时的 count ?

```ts
const AppRef = () => {
  const [count, setCount] = useState(0);
  const lastestCount = useRef(count);
  useEffect(() => {
    lastestCount.current = count;
  }, [count]);

  const handleAlertClick = () => {
    setTimeout(() => {
      alert("you click on:" + lastestCount.current);
    }, 3000);
  };

  return (
    <div>
      <p>{count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={handleAlertClick}>Show alert</button>
    </div>
  );
};
```

因为 useRef 每次都会返回同一个引用, 所以在 useEffect 中修改的时候 ,在 alert 中也会同时被修改. 这样子, 点击的时候就可以弹出实时的 count 了。

* 上面的问题解决了, 我们继续, 我们希望在界面上显示出**上一个** count 的值。 上代码。

```ts
const TwoCount = () => {
  const [count, setCount] = useState(0);
  const lastestCount = useRef(count);
  useEffect(() => {
    lastestCount.current = count;
  }, [count]);

  return (
    <div>
      <p>preCount： {lastestCount.current}</p>
      <p>Current Count：{count}</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
};
```

每次点击按钮，count值增加1，然后渲染元素，但是**此时lastestCount.current 中的值是上次的旧值**，渲染完成，执行useEffect回调函数，然后将最新的count 更新到 lastestCount.current 中，但是**不会引起渲染**，所以此时组件中preCount展示出来的值为旧值。

## 总结

* useRef 不仅仅是用来管理 DOM ref 的，它还相当于 this , 可以存放任何变量。
* useRef 可以很好的解决闭包带来的不方便性. 你可以在各种库中看到它的身影,   比如 react-use 中的 useInterval , usePrevious ……
* 值得注意的是，当 useRef 的内容发生变化时,它不会通知您。更改.current属性不会导致重新呈现。 因为他一直是一个引用。
