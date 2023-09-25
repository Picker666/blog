# Vue2 到 Vue3 变化

## 一、Proxy 代替 Object.defineProperty

### Vue 2

在 Vue2 中双向数据绑定是利用 Object.defineProperty 对数据进行劫持，然后结合发布订阅模式实现的。

通过 Object.defineProperty 劫持数据的 setter 和 getter ，在 getter 时候进行订阅，当发生 setter 发布改变给到订阅者，订阅者收到消息进行相应的更新操作。

* 1、遍历data中的所有属性，通过Observer（监听器）来完成数据的劫持，如果有变动 即 setter 触发，通知订阅者；
* 2、Watcher 订阅者，getter 是生成实例存入 发布订阅中心（Dep），setter 触发，执行相应的函数，从而更新视图；
* 3、Compile 解析器，扫描和解析每个节点的相关指令，并初始化模版数据和初始化相应的订阅；
* 4、Dep 发布订阅中心，负责收集订阅，属性变化时通知订阅者。

### Vue3

在 Vue3 中使用 es6 的 Proxy 对数据进行处理，

* 通过 reactive 函数给对象进行代理，返回代理对象，如果代理对象发生改变， Proxy 可以监听到变化；
* 通过 ref 函数，对简单数据类型或对象 进行监听或者代理，简单数据类型返回代理对象，value存储原值，对象走 reactive 方法。

与 Object.defineProperty 相比 Proxy 有以下优势：

* 1、直接监听对象而非属性，不需要遍历属性，并且可以深层监听；
* 2、可以监听数组变化；
* 3、拦截方式较多，不限于 get 和 set；[Proxy](/base/javascript/Proxy.html)
* 4、Proxy 返回新对象，可以直接操作新对象进行修改，Object.defineProperty 只能遍历对象属性进行修改；
* 5、Proxy作为新标准将受到浏览器厂商重点持续的性能优化。

需要注意的：

* 1、简单数据类型需要通过 ref 处理，返回代理对象，值存在对象的value属性中；
* 2、不管是 对象或者简单数据类型，通过 ref 或者 reactive 处理返回的代理对象不能重新赋值，每次改变只能再此基础上进行修改。

## 二、组合式API

Vue2 中使用的是选项式API，Vue3 中更推荐使用组合式API，（Composition API）

在选项式API 中，代码被分割成不同的属性，data，computed，methods，watch等等；

在组合式API 中，让我们 coding 更加自由。

## 三、生命周期

|Vue2|Vue3 组合式API|说明|
|----|---|---|
|beforeCreate|setup|组件创建前|
|created|setup|组件创建前|
|beforeMount|onBeforeMount|组件挂载前|
|mounted|onMounted|组件挂载完成|
|beforeUpdate|onBeforeUpdate|组件更新前|
|updated|onUpdated|组件更新后|
|beforeDestroy|onBeforeDestroy|组件销毁前|
|destroyed|onUnmounted|组件销毁后|

在 Vue3 中使用 选项式API生命周期不变。

## 四、组件通信

|方式|Vue2|Vue3|
|---|----|---|
|父传子|props|props|
|子传父|$emit|emit|
|父传子|$attr|attrs|
|子传父|$listeners|合并到attrs方式|
|父传子|provide|provide|
|子传父|inject|inject|
|子组件访问父组件|$parent|-|
|父组件访问子组件|$children|-|
|父组件访问子组件|$ref|expose&ref|
|兄弟传值|$EventBus|EventBus（mitt）|

## 五、diff 算法

[Vue diff 原理](https://github.com/Picker666/vue-origin-source/tree/main/diff)

[Vue diff]