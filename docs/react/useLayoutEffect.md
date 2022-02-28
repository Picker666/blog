# useLayoutEffect

布局副作用

* `useEffect` 在浏览器渲染完成后执行

基本上90%的情况下,都应该用这个,这个是在render结束后,你的callback函数执行,但是不会block browser painting,算是某种异步的方式吧,但是class的 `componentDidMount` 和 `componentDidUpdate` 是同步的,在render结束后就运行, `useEffect` 在大部分场景下都比class的方式性能**更好**。

* `useLayoutEffect` 在浏览器渲染前执行

这个是用在处理DOM的时候,当你的 useEffect 里面的操作需要处理DOM,并且会改变页面的样式,就需要用这个,否则可能会出现出现闪屏问题, `useLayoutEffect` 里面的callback函数会在DOM更新完成后立即执行,但是会**在浏览器进行任何绘制之前运行完成**，阻塞了浏览器的绘制。

特点：

* `useLayoutEffect` 总是比 `useEffect` 先执行
* `useLayoutEffect` 里面的任务最好影响了Layout（布局）

```ts
import React, {useState, useLayoutEffect, useEffect} from "react";
import ReactDOM from "react-dom";

function App() {
  const [n, setN] = useState(0)
  const onClick = ()=>{
    setN(i=>i+1)
  }
  useEffect(()=>{
    console.log("useEffect")
  })
  useLayoutEffect(()=>{ // 改成 useEffect 试试
    console.log("useLayoutEffect")
  })
  return (
    <div className="App">
      <h1>n: {n}</h1>
      <button onClick={onClick}>Click</button>
    </div>
  );
}
```

注意：为了用户体验最好优先使用 useEffect

```ts
import React, {useState, useRef, useLayoutEffect, useEffect} from "react";
import ReactDOM from "react-dom";

function App() {
  const [n, setN] = useState(0)
  const time = useRef(null)
  const onClick = ()=>{
    setN(i=>i+1) 
    time.current = performance.now()
  }
  useLayoutEffect(()=>{ // 改成 useEffect 试试
    if(time.current){
      console.log(performance.now() - time.current)
    }
  })
  return (
    <div className="App">
      <h1>n: {n}</h1>
      <button onClick={onClick}>Click</button>
    </div>
  );
}
```

另外一个例子

```ts
import React, { useEffect, useLayoutEffect, useRef } from "react";
import TweenMax from "gsap/TweenMax";
import './index.less';

const Animate = () => {
    const REl = useRef(null);
    useEffect(() => {
        /*下面这段代码的意思是当组件加载完成后,在0秒的时间内,将方块的横坐标位置移到600px的位置*/
        TweenMax.to(REl.current, 0, {x: 600})
    }, []);
    return (
        <div className='animate'>
            <div ref={REl} className="square">square</div>
        </div>
    );
};
```
