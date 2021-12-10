# React生命周期（旧）

## 零、react的生命周期函数：

- 组件将要挂载时触发的函数：`componentWillMount`
- 组件挂载完成时触发的函数：`componentDidMount`
- 是否要更新数据时触发的函数：`shouldComponentUpdate`
- 将要更新数据时触发的函数：`componentWillUpdate`
- 数据更新完成时触发的函数：`componentDidUpdate`
- 组件将要销毁时触发的函数：`componentWillUnmount`
- 父组件中改变了props传值时触发的函数：`componentWillReceiveProps`

react v16.0前生命周期的更新图:

![react v16.0前生命周期的更新图](/images/react/1.jpg)

## 一、组件初始化

然后是初始化，也就是以下代码中类的构造方法  `constructor()` , PickerDemo 类继承了 `react Component` 这个基类，也就继承这个 `react` 的基类，才能有 `render()` ,生命周期等方法可以使用，这也说明为什么函数组件不能使用这些方法的原因。

`super(props)` 用来调用基类的构造方法 `constructor()` , 也将父组件的 `props` 注入给子组件，功子组件读取(组件中 `props` 只读不可变，`state` 可变)。
而 `constructor()` 用来做一些组件的初始化工作，如定义 `this.state`  的初始内容。

## 二、挂载部分

根据官方生命周期图我们可以看到，一个组件的加载渲染，首先是 `defaultProps` 和 `propsTypes` ;

然后就是 `constructor` 及 `this.state` 里的初始数据，所以到这里是第一步。接着就是 `componentWillMount` 组件将要开始挂载了，这是第二步。然后组件挂载，`render` 解析渲染，所以第三步呼之欲出，就是render数据都渲染完成，最后 `componentDidMount` 组件挂载完成。

```js
import React ,{Component} from 'react'

class PickerDemo extends Component{
  constructor(props){
  console.log('01构造函数');
  super(props)
    this.state={
      
    }
  }
  //组件将要挂载时候触发的生命周期函数
  componentWillMount(){
    console.log('02组件将要挂载')
  }
  //组件挂载完成时候触发的生命周期函数
  componentDidMount(){
    console.log('04组件将要挂载')
  }
  render(){
    console.log('03数据渲染render')
    return(
      <div>
        生命周期函数演示
      </div>
    ) 
  }
}
export default PickerDemo;
```

打开控制台查看

```js
01构造函数
02组件将要挂载
03数据渲染render
04组件将要挂载
```

## 三、数据更新部分

数据更新的话第一步是 `shouldComponentUpdate` 确认是否要更新数据，当这个函数返回的是 `true` 的时候才会进行更新，并且这个函数可以声明两个参数 `nextProps` 和 `nextState`，`nextProps` 是父组件传给子组件的值，`nextState` 是数据更新之后值，这两个值可以在这个函数中获取到。第二步当确认更新数据之后 `componentWillUpdate` 将要更新数据，第三步依旧是 `render`，数据发生改变 `render` 重新进行了渲染。第四步是 `componentDidUpdate` 数据更新完成。

代码的话子组件在上一部分的基础上，在 `this.state` 中定义一个初始数据，`render` 中绑定一下这个数据，之后再增加一个按钮声明一个 `onClick` 事件去改变这个数据。这样可以看到数据更新部分的效果，我这里把第一部分的代码删掉了，看着不那么乱。

代码的话子组件在上一部分的基础上，在 `this.state` 中定义一个初始数据，`render` 中绑定一下这个数据，之后再增加一个按钮声明一个 `onClick` 事件去改变这个数据。这样可以看到数据更新部分的效果，我这里把第一部分的代码删掉了，看着不那么乱。

```js
import React ,{Component} from 'react'

class PickerDemo extends Component{
  constructor(props){
    super(props)
    this.state={
      msg:'我是一个msg数据'
    }
  }
  //是否要更新数据，如果返回true才会更新数据
  shouldComponentUpdate(nextProps,nextState){
    console.log('01是否要更新数据')
    console.log(nextProps) //父组件传给子组件的值，这里没有会显示空
    console.log(nextState) //数据更新后的值
    return true; //返回true，确认更新
  }
  //将要更新数据的时候触发的
  componentWillUpdate(){
    console.log('02组件将要更新')
  }
  //更新数据时候触发的生命周期函数
  componentDidUpdate(){
    console.log('04组件更新完成')
  }
  //更新数据
  setMsg(){
    this.setState({
      msg:'我是改变后的msg数据'
    })
  }
  render(){
    console.log('03数据渲染render')
    return(
      <div>
        {this.state.msg}
        <br/>
        <hr/>
        <button onClick={()=>this.setMsg()}>更新msg的数据</button>
      </div>
    ) 
  }
}
export default PickerDemo;
```

```js
01是否要更新数据
{title: ''}
{msg: '我是改变后的msg数据}
02组件将要更新
03数据渲染render
04组件更新完成
```

## 四、单独说一下componentWillReceiveProps，父组件中改变了props传值时触发的函数

这个函数也就是 props 的值发生改变时（父子组件传值或者通过 `connect` 从 `redux` 接收的值）触发的函数，刚才在第二部分中也说到 `shouldComponentUpdate` 这个函数可以携带两个参数， `nextProps` 就是父组件传给子组件的值。
在父组件中定义一个初始 `title` 数据，写一个按钮声明一个 `onClick` 事件去改变这个 `title`。

## 五、componentWillUnmount组件将要销毁时的函数

在父组件中定义一个 `flag` 为 `true` 的状态值，添加一个按钮声明一个 `onClick` 事件去
更改这个 `flag` 实现销毁组件。

这里可以看到 `componentWillReceiveProps` `这个函数被触发了，nextProps` 这个值也发生了改变。

父组件代码：

```js
import React, { Component } from 'react';
import PickerDemo from './components/PickerDemo'

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      flag:true,
      title:"我是app组件的标题"
    }
  }
  //创建/销毁组件
  setFlag(){
    this.setState({
      flag:!this.state.flag
    })
  }
  //改变title
  setTitle(){
    this.setState({
      title:'我是app组件改变后的title'
    })
  }
    render() {
      return (
        <div className="App">
        {
          this.state.flag?<PickerDemo title={this.state.title}/>:''
        }
        <button onClick={()=>this.setFlag()}>挂载/销毁生命周期函数组件</button>
        <button onClick={()=>this.setTitle()}>改变app组件的title</button>
        </div>
      );
  }
}
export default App;
```

父组件代码：

```js
import React ,{Component} from 'react'

class PickerDemo extends Component{
  constructor(props){
    super(props)
    this.state={
      msg:'我是一个msg数据'
    }
  }
  //组件将要挂载时候触发的生命周期函数
  componentWillMount(){
    console.log('02组件将要挂载')
  }
  //组件挂载完成时候触发的生命周期函数
  componentDidMount(){
    //Dom操作，请求数据放在这个里面
    console.log('04组件挂载完成')
  }
  //是否要更新数据，如果返回true才会更新数据
  shouldComponentUpdate(nextProps,nextState){
    console.log('01是否要更新数据')
    console.log(nextProps) //父组件传给子组件的值，这里没有会显示空
    console.log(nextState) //数据更新后的值
    return true; //返回true，确认更新
  }
  //将要更新数据的时候触发的
  componentWillUpdate(){
    console.log('02组件将要更新')
  }
  //更新数据时候触发的生命周期函数
  componentDidUpdate(){
    console.log('04组件更新完成')
  }
  //你在父组件里面改变props传值的时候触发的函数
  componentWillReceiveProps(){
    console.log('父子组件传值，父组件里面改变了props的值触发的方法')
  }
  setMsg(){
    this.setState({
      msg:'我是改变后的msg数据'
    })
  }
  //组件将要销毁的时候触发的生命周期函数，用在组件销毁的时候执行操作
  componentWillUnmount(){
    console.log('组件销毁了')
  }
  render(){
    console.log('03数据渲染render')
    return(
      <div>
        生命周期函数演示--{this.state.msg}--{this.props.title}
        <br/>
        <hr/>
        <button onClick={()=>this.setMsg()}>更新msg的数据</button>
      </div>
    ) 
  }
}
export default PickerDemo
```

点击挂载/销毁生命周期函数组件这个按钮的时候，子组件消失，控制台打印：组件销毁了。

当父组件给子组件传值时：

```js
01是否要更新数据
{title: '我是app组件的标题'}
{msg: '我是改变后的msg数据'}
02组件将要更新
03数据渲染render
04组件更新完成
```

这里 `nextProps` 这个就有上图划红线的值了。
那么我们再点击改变 `app` 组件的 `title` 这个按钮:

```js
父子组件传值，父组件里面改变了props的值触发的方法
01是否要更新数据
{title: '我是app组件的标题'}
{msg: '我是改变后的msg数据'}
02组件将要更新
03数据渲染render
04组件更新完成
```

这里可以看到componentWillReceiveProps这个函数被触发了，nextProps这个值也发生了改变。