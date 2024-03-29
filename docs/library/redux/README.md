# redux

## 一、redux 的使用场景

* 1、应用中有很多 state 在多个组件中需要使用
* 2、应用 state 会随着时间的推移而频繁更新
* 3、更新 state 的逻辑很复杂
* 4、中型和大型代码量的应用，很多人协同开发

## 二、Redux 的特点及核心概念

### 在Redux作为数据管理的应用中，应该包含一下几个部分

* 1、reducer：Redux 纯函数部分，是Redux state 的更新逻辑；
* 2、action：根据用户在的操作，描述用户操作的目的即期望reducer执行的逻辑块，需要dispatch 派发；
* 3、view：当前的视图 - 在这里可以使用 dispatch，派发 action 对象，用触发redux纯函数（即reducer）的计算逻辑，并返回新的state；
* 4、state：数据源 - 用来驱动视图，来自于 一个或多个 reducer，存储到Store中，并通过 Provider ,存放到应用的全局；

### 特点

* 1、单向数据流

对于 Redux 管理的数据来说，数据的变化只能是通过dispatch action 来触发，最终数据更新到store中，在分发到各个组件中，这是一个单向的过程。

* 2、数据不可变

在 Redux 中需要遵循数据不可变原则，即 当数据需要发生变化的时候，我们需要生成新的数据，并返回，所以在reducer中，每次需要返回新的 state，而不是更改原来的state，这么处理的原因是：可以让redux的发布订阅系统检测到数据发生变化（通过浅对比），以便推动视图的更新。

* 3、纯函数

纯函数本身就意味着 在函数内部不存在状态，该函数不具有副作用；

在Redux中，需要纯函数来保证数据不可变。

## 三、redux 数据流

![redux 数据流](/blog/images/library/redux1.png)

* View 是我们的页面，在页面中的操作比如：点击事件，在事件的回调函数中执行dispatch方法
* dispatch的参数就是action，是一个对象，对象可以由 actionCreator 生成；
* dispatch的执行将对触发reducer中的纯函数，执行逻辑并返回新的state，
* 新的state，更新到 store，然后通过 Provider 存放全局，通过connect，将需要的数据同步到组件也就是view，此时将触发对应组件的更新。

## 三、使用

Redux 是一个小型的独立 JS 库，常见的在React中使用，配合React-Redux。

[redux Demo](https://github.com/Picker666/redux-principle)
