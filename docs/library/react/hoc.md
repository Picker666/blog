# 高级组件 HOC

## 高阶组件是什么

简单的理解是：一个包装了另一个基础组件的组件。（相对高阶组件来说，我习惯把被包装的组件称为基础组件）

::: warning
注意：这里说的是包装，可以理解成包裹和组装；
:::

具体的是高阶组件的两种形式吧：

* 属性代理（Props Proxy）
可以说是对组件的包裹，在包裹的过程中对被包裹的组件做了点什么（`props`的处理，把基础组件和其他元素组合），然后返回，这就成了一个高阶组件；

* 反向继承 (Inheritance Inversion)
可以理解成是组装，和属性代理不同的是，反向继承是继承自基础组件，所有很自然，它可以直接获取基础组件的`props`，操作基础组件的`state`。可以通过 反向继承的形式，配合`compose`将携带不同功能模块的高阶组件组装到基础组件上，加强基础组件。

::: tip
本文栗子：https://github.com/Picker666/react-demos-HOC
compose栗子：https://github.com/Picker666/react-dom-compose
:::

## 属性代理（Props Proxy）

我们可以先建一个基础组件，如下：

```js
class BaseComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      baseName: 'base component'
      };
  };

  render () {
    const { name} = this.props;
    const { baseName } = this.state;
    return <div>{`${name} + ${baseName}`}</div>
  };
};
```

为了便于说明问题，写一个很简答的基础组件，它的作用仅仅是返回一个div，显示他自己的名字；

### 对props的操作

这个高阶组件是一个相对简单的无状态组件，只是这个高阶组件返回了一个新的组件，而这个新的组件是对基础组件的一个包装。仅仅对基础组件的props进行了增加，当然也可以进行改变，删除和读取（具体的可以下载代码上手试试）。

::: warning
（1）、此时`render`方法内的`this.props`，它是`InnerComponent`组建的`props`，而`BaseComponent`组件实际也就是`InnerComponent`组件。

（2）、高阶组件中的`InnerComponent`组件是一个完整的组件，可以根据需要添加一下`state`状态，作为`props`传到`BaseComponent`组件。可以将基础组件作为一个公共的组件，然后根据需要，使用的不同的高阶组件包装出具有不一样功能的组件。
:::

```js
import React, { Component } from 'react';
const PropsComponent = (BaseComponent) => {
  class InnerComponent extends Component {
    render () {
      const props = {
        ...this.props,
        name: 'HOC Component'
      };
      return <BaseComponent {...props} />
    };
  };
  return InnerComponent;
}
export default PropsComponent;
```

### 把基础组件和其他元素组合

出于操作样式、布局或其它的考虑，可以将 基础组件与其它组件包裹在一起。一些相对简单的用法也可以使用正常的父组件来实现，只是使用高阶组件可以获得更多的灵活性。也利于组件的抽象和复用。

```js
const WrapperComponent = (BaseComponent) => {
  class InnerComponent extends Component {
    render () {
      const props = {
        ...this.props,
        name: 'HOC Component'
      };
      return <div style={{backgroundColor: 'orange'}}>
            <BaseComponent {...props} />
        </div>
    };
  };
  return InnerComponent;
}
```

## 反向继承（Inheritance Inversion）

反向继承是继承自基础组件，并不是高阶组件继承传入的基础组件，所以成为反向继承。由于高阶组件继承了基础组件，那么高阶组件通过`this`可以操作基础组件的`state`，`props`以及基础组件的方法，甚至可以通过`super`来操作基础组件的生命周期。

### 渲染劫持

所谓渲染劫持就是，高阶组件控制了基础组件渲染生成的结果，因为基础组件的渲染被控制，高阶组件就可以对它做点什么。。。比如：

* 看心情（根据条件），控制渲染的结果；
* 改变dom树的样式；
* 改变基础组件中一下被渲染元素的props；
* 操作dom树中的元素。

这个就是根据props传入的条件来决定要不要渲染。

```js
const HOCComponent = (BaseComponent) => {
  return class Enhancer extends BaseComponent{
    render() {
      if (this.props.loggedIn) {
        return super.render()
      } else {
        return null
      }
    }
  }
}
```

通过`super.render()`获取基础组件的`dom`树，然后就可以进行一些操作，改变`dom`树的样式，改变基础组件中一下被渲染元素的`props`，操作`dom`树中的元素等等。

```js
HOCComponent = (BaseComponent) => {
  return class Enhancer extends BaseComponent {
    render() {
      const domsTree = super.render()
      let newProps = {};
      if (domsTree && domsTree.type === 'input') {
        newProps = {value: 'this is new value'}
      }
      const props = Object.assign({}, domsTree.props, newProps)
      const newDomsTree = React.cloneElement(domsTree, props, domsTree.props.children)
      return newDomsTree
    }
  }
}
```

### 操作state

高阶组件可以读取、编辑和删除 基础组件 实例的 `state`，如果你需要，你也可以给它添加更多的 `state`。需要注意的是，这会搞乱基础组件 的 `state`，导致你可能会破坏原有的`state`。所以，要限制高阶组件读取或添加 `state`，添加 `state` 时应该放在单独的命名空间里，而不是和基础组件的 `state` 混在一起。

另外，高阶组件配合 [compose](https://github.com/Picker666/react-dom-compose) 实现功能模块化，和个功能模块的随意组合使用。
每一个高阶组件封装一种功能，例如例子中的AddStaff，ChangeStaffData，DeleteStaff，ShowStaffMsg，可以根据需要将高阶组件组合到任意的基础组件中，实现功能模块化，也方便代码的抽离和复用。
