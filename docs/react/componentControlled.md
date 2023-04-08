# react 中的受控组件和非受控组件

react 中，受控组件指的是组件状态受我们控制的组件，非受控组件反之。

## 非受控组件

举个例子来说明，现在有一个组件包含一个输入框

```js
function App() {
  return (
    <div className="App">
      <input />
    </div>
  );
}
```

这时候，输入框的值可以随着我们的输入而变化，也就是不受程序所控制，这就是**非受控组件**。

## 受控组件

当我们通过输入框的 value 属性和 onChange 事件来主动控制输入框的值

```js
unction App() {
  const [val, setVal] = useState('hello');
  const handleChange = (e) => {
    setVal(e.target.value);
  };
  return (
    <div className="App">
      <input value={val} onChange={handleChange} />
    </div>
  );
}
```

这就是**受控组件**了。

* 优点：受控组件的值受我们控制，方便就行一些判断、验证、格式化或者触发一些副作用；
* 缺点：每次值得更新都会进行组件的重新渲染。

## 获得非受控组件中的值

这时候需要使用 ref 了。

```js
class eForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

也可以使用 useRef Hook

```js
function App() {
  const inputEl = useRef(null);

  const handleClick = () => {
    alert('A name was submitted: ' + inputEl.current.value);
  };
  return (
    <div className="App">
      <input ref={inputEl} />
      <button onClick={handleClick}>Click</button>
    </div>
  );
}
```

如果你需要指定一个默认值，而不需要控制之后的更新，可以使用 defaultValue 属性。

* 优点： 不会有一个实时更新触发渲染的过程；
* 缺点：值不受控制，不方便进行一下值的处理。
