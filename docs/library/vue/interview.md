# vue2 总结

## 一、生命周期

[生命周期](/vue/lifeCycle.html)

## 二、关于组件

### 1、组件传值

* 1、父子相传
  * （1）、props 传值  - 缺点：不能改变父组件的值，跨组件传值不方便；
  * （2）、this.$parent.count - 不需要传值，直接使用，能改变父组件的值，跨组件传值不方便；
  * （3）、依赖注入，父组件`provide(){return{count: this.count}}`,子组件`inject:['count']`,可以跨层级的子代传值。
* 2、子传父组件
  * （1）、自定义事件 - 子组件 执行`this.$emit('change', arg1,arg2)`， 父组件通过 `this.$on('change', callback)` 或者 在子组件实例绑定 事件`@change=“callback”`;
  * （2）、通过children[index] - 在父组件`this.children[1].count`, 可以更改子组件的值;
  * （3）、refs - `this.$refs[name].count`(name是在子组件实例上的ref="name"),可以更改子组件的值
* 3、兄弟之间的传值
  * （1）、借助父组件
  * （2）、借助工具类 - 新建类返回空（`new Vue()`）,可以直接赋值到属性，可以自定义事件

### 2、父组件修改子组件的值

* 1、this.$refs

### 3、子组件修改父组件的值

* 1、this.$parent

### 4、如何找到父组件

* 1、this.$parent

### 5、如何找到根组件

* 1、this.$root

### slot

* 1、匿名插槽
* 2、具名插槽
* 3、作用域插槽

## 三、Vuex

### 1、都有哪些属性

* （1）、state - 全局的数据
* （2）、getters - 针对全局数据进行二次计算
* （3）、mutations - 存放同步方法 - 不能return
* （4）、actions - 错放异步方法，并提交mutations
* （5）、modules - 对Vuex进行模块细分
* （6）、plugins - 本地化存储

### 2、使用state

* (1)、this.$store.state.xxx - 可以直接修改
* (2)、mapState 辅助函数 - 不能修改

### 3、使用getters

* (1)、this.$store.getters.xxx - 不可以修改
* (2)、mapGetters 辅助函数 - 不能修改

### 4、actions 和 mutations

相同点：

* （1）、都是存放全局方法的；return的值拿不到

区别：

* （1）、mutations 同步，修改state的值；
* （2）、actions 返回的是Promise对象，处理异步，提交mutations

### 5、Vuex持久化存储

刷新页面时候，保存旧的 state

* （1）、存储本地 localStorage, cookie、sessionStorage
* （2）、插件 `vuex-persistedstates`

## 四、路由

### 1、路由模式

* history 路由
  * 找不到页面会给服务端发送一次请求
  * 打包后页面打不开，默认看不到内容
  * /

* hash  路由
  * 找不到页面不会发发送请求
  * 打包结果可以打开
  * \#

### 2、导航故障

```js
Vue.config.productionTip = false;

const routePush = VueRouter.prototype.push;
VueRouter.prototype.push = function (...args) {
  try {
    routePush.apply(this, args);
  } catch (err) {
    console.log('err: ', err);
  }
}
```

重写 push 和 replace 方法

### 3、$route 和 $router

$router 路由的实例，包含路由类的所有方法

$route 当前路由对象

### 4、导航守卫

* （1）、全局路由
  * a、beforeEach
  * b、afterEach
* （2）、路由独享守卫
  * beforeEnter
* （3）、组件内守卫
  * a、beforeRouteEnter
  * b、beforeRouteUpdate
  * c、beforeRouteLeave

## 五、API

### 1、$set

数据更新了，视图没有更新

```js
this.arr[1] = 'xxx'; // 视图不更新

this.$set(this.arr, '1', 'xxx'); // 更新了
```

原因是数据没有被劫持

。。。。

### 2、$nextTick

在 created 生命周期内获取 真是 DOM，可以使用异步，或者 `$nextTick`

`$nextTick` 就是异步的，参数是回调含数据 获取更新后的DOM，源码如下：

```js
class Vue {
  constructor(options) {
    options.create.call(this);
    this.$el = options.el;
    options.mounted.call(this);
  }

  $nextTick(callback) {
    return Promise.resolve().then(callback)
  }
}

new Vue({
  el: '#app',
  created() {
    console.log(this.$el);
  },
  mounted() {
    console.log(this.$el);
  }
})
```

### 3、$el

获取根节点

### 4、$data

当前组件的data

### 5、$children

获取当前组件的所有子组件

### 6、$root

找到根组件

### 7、data 定义的数据

```js
{
  data() {
    this.num = 2
    return {
      str: 1
    }
  }
}
```

num 和 str的区别，str是响应式的数据，num不可以，因为vue对data的数据进行劫持，设置了getter和setter。

### 8、computed

computed 的计算属性方法的形式是不可以修改，如果写成`{get(){},set(val){}}`，可以改变。

当通过 v-modal的形式绑定 computed 计算属性，计算属性可以更改吗？答案同上。

### 9、watch

```js
immediate:true // 初始化就监听
deep: true // 深度监听
```

### 10、computed 和 methods 区别

computed 有缓存机制

methods 没缓存机制

## 六、指令

### 1、自定义指令

全局的

```js
// bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
// inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
// update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。

// componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
// unbind：只调用一次，指令与元素解绑时调用。

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

局部的

```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

### 2、单项绑定

双向 v-model

单向 v-bind

### 3、v-if 和 v-for 优先级

Vue2: v-for > v-if

Vue3: v-for < v-if

## 七、原理

### 1、$nextTick

[nextTicket](/sourceAnalysis/nextTicket.html)

### 2、MVVM

model: 模型 - vue.data

viewModal: 视图模型层 - vue源码 数据和视图做关联

view： 视图 - doms
