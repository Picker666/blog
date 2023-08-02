# React VS Vue

## 相似之处

### 1、使用 Virtual DOM

都采用虚拟 DOM，使用相似却不相同的 diff 算法，特别是在 有 key DOM 的 diff 上，使用的算法完全不同；

### 2、提供响应式和组件化的视图组件

都是组件化的编程，但是编程方式却不相同

都是响应式的编程，但是响应的方式却是不一样的

### 3、将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库

都更加关注核心库，但是Vue的状态管理和路由功能却是深度集成的。

## 不同之处

### 1、diff 算法

* React

直接查找，位置不同 - 后移

[React Diff](/library/react/diff.html)

* Vue

双指针遍历+搜索+其他

[Vue Diff](/library/vue/diff.html)

### 2、运行时的性能

* React 性能
  * （1）、16之前 React 的更新是遍历整颗DOM树，并且是递归更新，该过程不可相应用户的操作；
  * （2）、16之后 Fiber 的加入，React的更新过程变得可中断、可恢复，更新过程可以优先响应用户的交互，但本质还是一个全量的更新
  * （3）、React 优化 类组件，PureComponent， shouldComponentUpdate，hooks组件 useMemo, useCallback, memo 等等。

* Vue 性能

Vue 的更新逻辑依赖发布订阅和Proxy/Object.defineProperty，是一种精确的订阅和依赖更新系统，个人认为性能更好。并且开发者不需要考虑性能优化。

### 3、使用性

React 使用jsx语法，all in js；

Vue 更推荐使用模版语法，这对初学者更加友好；

另外，Vue还进行了一些额外的开发以方便我们的使用，比如指令： v-on，v-bind，v-model等等功能强大，比如插槽；

样式的处理方式也更加方便

### 4、周边

* 路由

相比Vue，React的路由相对比较简单，单纯的路由；

Vue 的路由和 Vue 本身深度集成，有不同的钩子，全局的路由守卫（beforeEach、beforeResolve、afterEach），路由独享的守卫（beforeEnter），组件内守卫（beforeRouteEnter，beforeRouteUpdate， beforeRouteLeave）

* 状态管理

一般来说React的状态管理我们会用到Redux+Redux-thunk，功能强大，但是使用来了繁琐；

对 Vue 来说，使用深度集成的 Vuex，同样功能强大，使用方便，提供很多易用的API，并且支持异步的操作。


